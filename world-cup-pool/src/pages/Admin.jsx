import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { STAGE_NAMES, KNOCKOUT_STAGES, GROUP_LETTERS } from '../data/tournament'
import { computeGroupStandings, advanceGroupWinners, advanceKnockoutWinner, advanceThirdPlaceTeams } from '../lib/bracket'
import { fetchAllOdds, getMatchOdds } from '../lib/odds'

function ResultModal({ match, odds, onSave, onClose }) {
  const [home, setHome] = useState(match.home_score !== null ? String(match.home_score) : '')
  const [away, setAway] = useState(match.away_score !== null ? String(match.away_score) : '')
  const [saving, setSaving] = useState(false)

  const underdog = odds
    ? odds.home < odds.away ? { name: match.home_team, prob: odds.home }
    : odds.away < odds.home ? { name: match.away_team, prob: odds.away }
    : null
    : null

  async function handleSave() {
    const h = parseInt(home); const a = parseInt(away)
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return
    setSaving(true)
    await onSave(match.id, h, a, odds?.home ?? null, odds?.away ?? null)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="card max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
        <h3 className="font-bold text-lg">{match.home_team} vs {match.away_team}</h3>
        {underdog && (
          <div className="text-xs text-amber-400 bg-amber-900/20 rounded px-3 py-1.5 text-center">
            Underdog: <strong>{underdog.name}</strong> ({underdog.prob}% win prob) · 2× bonus applied if wins
          </div>
        )}
        <div className="flex items-center gap-3 justify-center">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">{match.home_team}</div>
            <input type="number" min="0" max="30" value={home} onChange={e => setHome(e.target.value)} className="score-input" placeholder="0" />
          </div>
          <span className="text-gray-500 text-xl">–</span>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">{match.away_team}</div>
            <input type="number" min="0" max="30" value={away} onChange={e => setAway(e.target.value)} className="score-input" placeholder="0" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving || home === '' || away === ''} className="btn-primary flex-1">
            {saving ? 'Saving…' : 'Save Result'}
          </button>
          <button onClick={onClose} className="btn-secondary px-4">Cancel</button>
        </div>
      </div>
    </div>
  )
}

function MatchRow({ match, onEdit }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-navy-700/50 gap-2">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{match.home_team} vs {match.away_team}</div>
        <div className="text-xs text-gray-500">
          {match.match_date ? new Date(match.match_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}
        </div>
      </div>
      <div className="text-right flex items-center gap-3">
        {match.is_completed ? (
          <span className="font-bold text-amber-400">{match.home_score} – {match.away_score}</span>
        ) : (
          <span className="text-gray-600 text-sm">No result</span>
        )}
        <button onClick={() => onEdit(match)} className="text-xs bg-navy-700 hover:bg-navy-600 px-2 py-1 rounded transition-colors whitespace-nowrap">
          {match.is_completed ? 'Edit' : 'Enter'}
        </button>
      </div>
    </div>
  )
}

export default function Admin() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [editingOdds, setEditingOdds] = useState(null)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState('group')
  const [activeGroup, setActiveGroup] = useState('A')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const loadMatches = useCallback(async () => {
    const { data } = await supabase.from('matches').select('*').order('id')
    setMatches(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadMatches() }, [loadMatches])

  async function handleOpenEdit(match) {
    setEditing(match)
    // Try live API odds first; fall back to probs already stored on the match row
    const events = await fetchAllOdds()
    const liveOdds = events ? getMatchOdds(match.home_team, match.away_team, events) : null
    if (liveOdds) {
      setEditingOdds(liveOdds)
    } else if (match.home_prob != null && match.away_prob != null) {
      setEditingOdds({ home: match.home_prob, away: match.away_prob, draw: 100 - match.home_prob - match.away_prob, bookmakers: 0 })
    } else {
      setEditingOdds(null)
    }
  }

  async function handleSaveResult(matchId, homeScore, awayScore, homeProb, awayProb) {
    // 1. Save result and recalculate points via RPC
    const { error } = await supabase.rpc('save_match_result', {
      p_match_id: matchId,
      p_home_score: homeScore,
      p_away_score: awayScore,
      p_home_prob: homeProb,
      p_away_prob: awayProb,
    })

    if (error) { showToast(`Error: ${error.message}`); return }

    // Reload matches so bracket logic has fresh data
    const { data: freshMatches } = await supabase.from('matches').select('*').order('id')
    const allMatches = freshMatches ?? []
    setMatches(allMatches)

    const completedMatch = allMatches.find(m => m.id === matchId)
    if (!completedMatch) return

    let bracketLog = []

    if (completedMatch.stage === 'group') {
      const groupMatches = allMatches.filter(m => m.stage === 'group' && m.group_letter === completedMatch.group_letter)
      const allGroupDone = groupMatches.every(m => m.is_completed)

      if (allGroupDone) {
        const standings = computeGroupStandings(groupMatches)
        const updates = await advanceGroupWinners(completedMatch.group_letter, standings)
        bracketLog = updates.map(u => {
          const parts = []
          if (u.home_team) parts.push(`Home → ${u.home_team}`)
          if (u.away_team) parts.push(`Away → ${u.away_team}`)
          return `Match #${u.match_id}: ${parts.join(', ')}`
        })

        // Check if ALL groups are done → advance 3rd-place teams
        const allGroupMatches = allMatches.filter(m => m.stage === 'group')
        const allDone = allGroupMatches.every(m => m.is_completed)
        if (allDone) {
          const t3Updates = await advanceThirdPlaceTeams(allGroupMatches)
          bracketLog.push(...t3Updates.map(u => `T3 slot ${u.slot} → ${u.team}`))
        }
      }
    } else {
      // Knockout match – advance winner (and loser for 3rd place) to next round
      const updates = await advanceKnockoutWinner(completedMatch)
      bracketLog = updates.map(u => {
        const parts = []
        if (u.home_team) parts.push(`Home → ${u.home_team}`)
        if (u.away_team) parts.push(`Away → ${u.away_team}`)
        return `Match #${u.matchId}: ${parts.join(', ')}`
      })
    }

    // Reload after bracket updates
    await loadMatches()

    const msg = bracketLog.length > 0
      ? `Saved! Bracket updated: ${bracketLog.join(' · ')}`
      : 'Result saved & points calculated.'
    showToast(msg)
  }

  if (loading) return <div className="text-center text-gray-500 py-20">Loading…</div>

  const groupMatches = matches.filter(m => m.stage === 'group')
  const knockoutMatches = matches.filter(m => m.stage !== 'group')

  const completedCount = matches.filter(m => m.is_completed).length
  const totalCount = matches.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-400">{completedCount} / {totalCount} results entered</div>
      </div>

      <div className="w-full bg-navy-700 rounded-full h-2">
        <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${(completedCount / totalCount) * 100}%` }} />
      </div>

      <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg px-4 py-3 text-sm text-amber-300">
        <strong>Bracket auto-advance:</strong> Saving a group result auto-updates R32 team names when the group is complete. Saving a knockout result auto-advances the winner (and 3rd-place loser). No manual bracket editing needed.
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['group', 'knockout'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === t ? 'tab-active' : 'tab-inactive'}`}>
            {t === 'group' ? 'Group Stage' : 'Knockout'}
          </button>
        ))}
      </div>

      {activeTab === 'group' && (
        <div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {GROUP_LETTERS.map(g => {
              const gm = groupMatches.filter(m => m.group_letter === g)
              const done = gm.every(m => m.is_completed)
              const started = gm.some(m => m.is_completed)
              return (
                <button key={g} onClick={() => setActiveGroup(g)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors relative ${activeGroup === g ? 'tab-active' : 'tab-inactive'}`}>
                  {g}
                  {done && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />}
                  {!done && started && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />}
                </button>
              )
            })}
          </div>
          <div className="card">
            <h2 className="font-semibold mb-3">Group {activeGroup}</h2>
            {groupMatches.filter(m => m.group_letter === activeGroup).map(m => (
              <MatchRow key={m.id} match={m} onEdit={handleOpenEdit} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'knockout' && (
        <div className="space-y-4">
          {KNOCKOUT_STAGES.map(stage => {
            const sm = knockoutMatches.filter(m => m.stage === stage)
            if (sm.length === 0) return null
            return (
              <div key={stage} className="card">
                <h2 className="font-semibold mb-3">{STAGE_NAMES[stage]}</h2>
                {sm.map(m => <MatchRow key={m.id} match={m} onEdit={handleOpenEdit} />)}
              </div>
            )
          })}
        </div>
      )}

      {editing && (
        <ResultModal
          match={editing}
          odds={editingOdds}
          onSave={handleSaveResult}
          onClose={() => { setEditing(null); setEditingOdds(null) }}
        />
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-xl text-sm max-w-sm text-center z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  )
}
