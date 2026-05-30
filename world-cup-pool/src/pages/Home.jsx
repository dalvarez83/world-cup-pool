import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import MatchCard from '../components/MatchCard'
import { GROUPS, KNOCKOUT_STAGES, STAGE_NAMES, GROUP_LETTERS } from '../data/tournament'

function GroupStandings({ groupMatches }) {
  const teams = {}
  GROUPS[groupMatches[0]?.group_letter]?.forEach(t => {
    teams[t] = { team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 }
  })

  groupMatches.filter(m => m.is_completed).forEach(m => {
    const h = teams[m.home_team]; const a = teams[m.away_team]
    if (!h || !a) return
    h.played++; a.played++
    h.gf += m.home_score; h.ga += m.away_score
    a.gf += m.away_score; a.ga += m.home_score
    h.gd = h.gf - h.ga; a.gd = a.gf - a.ga
    if (m.home_score > m.away_score) { h.won++; h.points += 3; a.lost++ }
    else if (m.away_score > m.home_score) { a.won++; a.points += 3; h.lost++ }
    else { h.drawn++; a.drawn++; h.points++; a.points++ }
  })

  const sorted = Object.values(teams).sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)

  return (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 border-b border-navy-700">
            <th className="text-left pb-1 pr-2">#</th>
            <th className="text-left pb-1">Team</th>
            <th className="pb-1 px-2">P</th><th className="pb-1 px-2">W</th>
            <th className="pb-1 px-2">D</th><th className="pb-1 px-2">L</th>
            <th className="pb-1 px-2">GD</th><th className="pb-1 px-2">Pts</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => (
            <tr key={t.team} className={`border-b border-navy-700/50 ${i < 2 ? 'text-white' : 'text-gray-400'}`}>
              <td className="py-1 pr-2 text-gray-500">{i + 1}</td>
              <td className="py-1 font-medium">{t.team}</td>
              <td className="py-1 px-2 text-center">{t.played}</td>
              <td className="py-1 px-2 text-center">{t.won}</td>
              <td className="py-1 px-2 text-center">{t.drawn}</td>
              <td className="py-1 px-2 text-center">{t.lost}</td>
              <td className="py-1 px-2 text-center">{t.gd > 0 ? '+' : ''}{t.gd}</td>
              <td className="py-1 px-2 text-center font-bold">{t.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [predictions, setPredictions] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('group')
  const [activeGroup, setActiveGroup] = useState('A')

  const loadData = useCallback(async () => {
    const [{ data: matchData }, { data: predData }] = await Promise.all([
      supabase.from('matches').select('*').order('id'),
      supabase.from('predictions').select('*').eq('user_id', user.id),
    ])
    setMatches(matchData ?? [])
    const predMap = {}
    predData?.forEach(p => { predMap[p.match_id] = p })
    setPredictions(predMap)
    setLoading(false)
  }, [user.id])

  useEffect(() => { loadData() }, [loadData])

  if (loading) return <div className="text-center text-gray-500 py-20">Loading matches…</div>

  const groupMatches = matches.filter(m => m.stage === 'group')
  const knockoutMatches = matches.filter(m => m.stage !== 'group')
  const currentGroupMatches = groupMatches.filter(m => m.group_letter === activeGroup)

  const totalPts = Object.values(predictions).reduce((s, p) => s + (p.points ?? 0), 0)
  const predCount = Object.keys(predictions).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Predictions</h1>
        <div className="text-right text-sm">
          <div className="font-bold text-amber-400 text-lg">{totalPts % 1 === 0 ? totalPts : totalPts.toFixed(1)} pts</div>
          <div className="text-gray-500">{predCount} predictions</div>
        </div>
      </div>

      {/* Stage tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('group')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'group' ? 'tab-active' : 'tab-inactive'}`}>
          Group Stage
        </button>
        <button onClick={() => setActiveTab('knockout')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'knockout' ? 'tab-active' : 'tab-inactive'}`}>
          Knockout
        </button>
      </div>

      {activeTab === 'group' && (
        <div>
          {/* Group letter tabs */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {GROUP_LETTERS.map(g => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${activeGroup === g ? 'tab-active' : 'tab-inactive'}`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="mb-2 text-sm font-semibold text-gray-400">Group {activeGroup}</div>

          {currentGroupMatches.some(m => m.is_completed) && (
            <GroupStandings groupMatches={currentGroupMatches} />
          )}

          <div className="grid gap-3">
            {currentGroupMatches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                prediction={predictions[match.id]}
                onSaved={loadData}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'knockout' && (
        <div className="space-y-6">
          {KNOCKOUT_STAGES.map(stage => {
            const stageMatches = knockoutMatches.filter(m => m.stage === stage)
            if (stageMatches.length === 0) return null
            return (
              <div key={stage}>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{STAGE_NAMES[stage]}</h2>
                <div className={`grid gap-3 ${stage === 'r32' ? 'md:grid-cols-2' : stage === 'r16' ? 'md:grid-cols-2' : ''}`}>
                  {stageMatches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      prediction={predictions[match.id]}
                      onSaved={loadData}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
