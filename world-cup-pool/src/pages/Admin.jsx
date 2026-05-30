import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { calculatePoints } from '../lib/scoring'
import { STAGE_LABELS, STAGE_ORDER } from '../lib/scoring'
import { teamFlag, teamName } from '../data/tournament'

// ─── Bracket advancement ────────────────────────────────────────────────────
//
// After group stage is complete, compute standings for each group, then
// assign the correct home/away teams to the R32 slots defined in seed.sql.
//
// Slot IDs (match numbers 73-88) use the placeholder strings in seed.sql,
// e.g. "1A" = 1st place in Group A, "2B" = 2nd place in Group B.
// "3D/E/F" = best 3rd-place team from groups D, E, or F (simplified here as
// a first-come/best-record rule).
//
// This function returns an array of { matchNumber, homeTeam, awayTeam }
// updates to apply to the `matches` table.
//
async function computeBracketUpdates() {
  // 1. Pull all finished group stage matches
  const { data: groupMatches } = await supabase
    .from('matches')
    .select('*')
    .eq('stage', 'group')
    .eq('status', 'finished')

  if (!groupMatches?.length) return []

  // 2. Build group standings
  const standings = {} // { group: { teamCode: { pts, gd, gf, code } } }

  for (const m of groupMatches) {
    if (m.home_score === null) continue
    const g = m.group_name
    if (!standings[g]) standings[g] = {}
    const init = code => standings[g][code] = standings[g][code] ?? { pts:0, gd:0, gf:0, code }
    init(m.home_team)
    init(m.away_team)

    const hg = m.home_score, ag = m.away_score
    standings[g][m.home_team].gf += hg
    standings[g][m.home_team].gd += hg - ag
    standings[g][m.away_team].gf += ag
    standings[g][m.away_team].gd += ag - hg

    if (hg > ag) {
      standings[g][m.home_team].pts += 3
    } else if (hg === ag) {
      standings[g][m.home_team].pts += 1
      standings[g][m.away_team].pts += 1
    } else {
      standings[g][m.away_team].pts += 3
    }
  }

  // 3. Sort each group: pts desc, gd desc, gf desc
  const sorted = {}
  for (const [g, teams] of Object.entries(standings)) {
    sorted[g] = Object.values(teams).sort(
      (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf
    )
  }

  // 4. Collect all 3rd-place teams (one per group), ranked the same way
  const thirds = Object.entries(sorted)
    .filter(([, t]) => t.length >= 3)
    .map(([g, t]) => ({ group: g, ...t[2] }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)

  // 5. Helpers to resolve slot strings to team codes
  function get(groupLetter, rank) {
    return sorted[groupLetter]?.[rank - 1]?.code ?? null
  }
  function getBest3rd(groupLetters) {
    // e.g. "D/E/F" → pick best 3rd-place team from those groups
    const letters = groupLetters.split('/')
    const candidates = thirds.filter(t => letters.includes(t.group))
    return candidates[0]?.code ?? null
  }

  // 6. Resolve placeholder strings to team codes
  function resolvePlaceholder(ph) {
    if (!ph) return null
    ph = ph.trim()
    // "1A" → 1st in A
    const rankGroup = ph.match(/^([1-4])([A-L])$/)
    if (rankGroup) return get(rankGroup[2], Number(rankGroup[1]))
    // "3D/E/F" → best 3rd from D/E/F
    const third3 = ph.match(/^3([A-L](?:\/[A-L])+)$/)
    if (third3) return getBest3rd(third3[1])
    // "3A/B/C" same pattern
    return null
  }

  // 7. Load the R32 placeholder matches
  const { data: r32 } = await supabase
    .from('matches')
    .select('match_number, home_team, away_team, home_placeholder, away_placeholder')
    .eq('stage', 'r32')

  const updates = []
  for (const m of (r32 ?? [])) {
    const homeTeam = m.home_team ?? resolvePlaceholder(m.home_placeholder)
    const awayTeam = m.away_team ?? resolvePlaceholder(m.away_placeholder)
    if ((homeTeam && homeTeam !== m.home_team) || (awayTeam && awayTeam !== m.away_team)) {
      updates.push({ matchNumber: m.match_number, homeTeam, awayTeam })
    }
  }

  return updates
}

// ─── Main Admin component ────────────────────────────────────────────────────

export default function Admin() {
  const [matches, setMatches]     = useState([])
  const [stageFilter, setStage]   = useState('group')
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(null)
  const [notice, setNotice]       = useState(null)
  const [bracket, setBracket]     = useState(false)

  useEffect(() => { loadMatches() }, [])

  async function loadMatches() {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .order('kickoff_time')
    setMatches(data ?? [])
    setLoading(false)
  }

  async function handleSaveResult(match, homeScore, awayScore) {
    setSaving(match.id)
    setNotice(null)

    // 1. Update match
    const { error: mErr } = await supabase
      .from('matches')
      .update({ home_score: homeScore, away_score: awayScore, status: 'finished', updated_at: new Date().toISOString() })
      .eq('id', match.id)

    if (mErr) { setSaving(null); setNotice({ type: 'error', msg: mErr.message }); return }

    // 2. Recalculate points for all predictions on this match
    const { data: preds } = await supabase
      .from('predictions')
      .select('id, home_score, away_score')
      .eq('match_id', match.id)

    if (preds?.length) {
      const updates = preds.map(p => ({
        id: p.id,
        points: calculatePoints(p.home_score, p.away_score, homeScore, awayScore, match.stage),
        updated_at: new Date().toISOString(),
      }))
      await supabase.from('predictions').upsert(updates)
    }

    // 3. Auto-advance bracket after every group stage result
    if (match.stage === 'group') {
      try {
        const bracketUpdates = await computeBracketUpdates()
        for (const u of bracketUpdates) {
          await supabase
            .from('matches')
            .update({ home_team: u.homeTeam, away_team: u.awayTeam })
            .eq('match_number', u.matchNumber)
        }
        if (bracketUpdates.length) {
          setNotice({ type: 'success', msg: `Result saved · ${bracketUpdates.length} bracket slot(s) updated automatically.` })
        } else {
          setNotice({ type: 'success', msg: `Result saved: ${homeScore}–${awayScore}` })
        }
      } catch {
        setNotice({ type: 'success', msg: `Result saved: ${homeScore}–${awayScore}` })
      }
    } else {
      setNotice({ type: 'success', msg: `Result saved: ${homeScore}–${awayScore}` })
    }

    setSaving(null)
    await loadMatches()
  }

  async function handleAdvanceBracket() {
    setBracket(true)
    setNotice(null)
    try {
      const updates = await computeBracketUpdates()
      if (!updates.length) {
        setNotice({ type: 'info', msg: 'No bracket slots ready to advance yet.' })
        setBracket(false)
        return
      }
      for (const u of updates) {
        await supabase
          .from('matches')
          .update({ home_team: u.homeTeam, away_team: u.awayTeam })
          .eq('match_number', u.matchNumber)
      }
      setNotice({ type: 'success', msg: `Advanced ${updates.length} bracket slot(s).` })
      await loadMatches()
    } catch (e) {
      setNotice({ type: 'error', msg: e.message })
    }
    setBracket(false)
  }

  const stages = [...new Set(matches.map(m => m.stage))]
    .sort((a, b) => STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b))

  const visible = matches.filter(m => m.stage === stageFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleAdvanceBracket}
          disabled={bracket}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <RefreshCw size={14} className={bracket ? 'animate-spin' : ''} />
          Advance Bracket
        </button>
      </div>

      {notice && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
          notice.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          notice.type === 'error'   ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>
          {notice.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {notice.msg}
        </div>
      )}

      <p className="text-white/40 text-sm">
        Enter the final score at 90 mins. Points are recalculated instantly.
        After all group stage matches are done, click <strong>Advance Bracket</strong> to
        auto-assign teams to the Round of 32 slots.
      </p>

      {/* Stage tabs */}
      <div className="flex flex-wrap gap-2">
        {stages.map(s => {
          const cnt = matches.filter(m => m.stage === s && m.status === 'finished').length
          const tot = matches.filter(m => m.stage === s).length
          return (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                stageFilter === s ? 'bg-gold-500 text-navy-900' : 'btn-secondary'
              }`}
            >
              {STAGE_LABELS[s]}
              <span className="ml-1.5 opacity-60">{cnt}/{tot}</span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="text-white/30 text-center py-12">Loading…</div>
      ) : (
        <div className="space-y-3">
          {visible.map(m => (
            <AdminMatchRow
              key={m.id}
              match={m}
              saving={saving === m.id}
              onSave={handleSaveResult}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Single match row with inline result input ───────────────────────────────

function AdminMatchRow({ match, saving, onSave }) {
  const [homeScore, setHome] = useState(match.home_score ?? '')
  const [awayScore, setAway] = useState(match.away_score ?? '')

  const homeName = match.home_team ? `${teamFlag(match.home_team)} ${teamName(match.home_team)}` : match.home_placeholder ?? 'TBD'
  const awayName = match.away_team ? `${teamFlag(match.away_team)} ${teamName(match.away_team)}` : match.away_placeholder ?? 'TBD'

  const kickoff = new Date(match.kickoff_time)
  const dateStr = kickoff.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

  const dirty = homeScore !== (match.home_score ?? '') || awayScore !== (match.away_score ?? '')

  function handleSave() {
    const h = parseInt(homeScore, 10)
    const a = parseInt(awayScore, 10)
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return
    onSave(match, h, a)
  }

  return (
    <div className={`card p-4 ${match.status === 'finished' ? 'border-green-500/10' : ''}`}>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Status badge */}
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
          match.status === 'finished' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'
        }`}>
          {match.status === 'finished' ? 'Finished' : 'Upcoming'}
        </span>

        {/* Match info */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{homeName} vs {awayName}</div>
          <div className="text-white/30 text-xs">{dateStr} · {match.city}</div>
        </div>

        {/* Score inputs */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="number"
            min="0" max="20"
            value={homeScore}
            onChange={e => setHome(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))}
            placeholder="–"
            className="score-input !w-12 !py-1.5 !text-base"
          />
          <span className="text-white/30">–</span>
          <input
            type="number"
            min="0" max="20"
            value={awayScore}
            onChange={e => setAway(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))}
            placeholder="–"
            className="score-input !w-12 !py-1.5 !text-base"
          />
          <button
            onClick={handleSave}
            disabled={saving || !dirty || homeScore === '' || awayScore === ''}
            className="btn-primary text-xs px-3 py-1.5 min-w-[60px]"
          >
            {saving ? '…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
