import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { GROUPS } from '../data/tournament'
import { STAGE_LABELS, STAGE_ORDER } from '../lib/scoring'
import MatchCard from '../components/MatchCard'

const GROUP_TABS = ['All', ...GROUPS]
const KNOCKOUT_STAGES = ['r32', 'r16', 'qf', 'sf', '3rd', 'final']

export default function Schedule() {
  const [matches, setMatches]   = useState([])
  const [tab, setTab]           = useState('group') // 'group' | 'knockout'
  const [groupFilter, setGroup] = useState('All')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase
      .from('matches')
      .select('*')
      .order('kickoff_time')
      .then(({ data }) => { setMatches(data ?? []); setLoading(false) })
  }, [])

  const groupMatches = matches
    .filter(m => m.stage === 'group')
    .filter(m => groupFilter === 'All' || m.group_name === groupFilter)

  const knockoutMatches = matches.filter(m => KNOCKOUT_STAGES.includes(m.stage))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Schedule</h1>

      {/* Stage tabs */}
      <div className="flex gap-2">
        {['group', 'knockout'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-gold-500 text-navy-900' : 'btn-secondary'
            }`}
          >
            {t === 'group' ? 'Group Stage' : 'Knockout'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-white/30 text-center py-12">Loading schedule…</div>
      ) : tab === 'group' ? (
        <GroupSchedule matches={groupMatches} groupFilter={groupFilter} setGroup={setGroup} />
      ) : (
        <KnockoutSchedule matches={knockoutMatches} />
      )}
    </div>
  )
}

function GroupSchedule({ matches, groupFilter, setGroup }) {
  return (
    <div className="space-y-4">
      {/* Group filter pills */}
      <div className="flex flex-wrap gap-2">
        {['All', ...GROUPS].map(g => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              groupFilter === g
                ? 'bg-gold-500 text-navy-900'
                : 'bg-navy-600 text-white/50 hover:text-white'
            }`}
          >
            {g === 'All' ? 'All Groups' : `Group ${g}`}
          </button>
        ))}
      </div>

      {/* Matches by group */}
      {(groupFilter === 'All' ? GROUPS : [groupFilter]).map(g => {
        const gMatches = matches.filter(m => m.group_name === g)
        if (!gMatches.length) return null
        return (
          <div key={g}>
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-2">
              Group {g}
            </h3>
            <div className="space-y-2">
              {gMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function KnockoutSchedule({ matches }) {
  return (
    <div className="space-y-6">
      {KNOCKOUT_STAGES.map(stage => {
        const stageMatches = matches.filter(m => m.stage === stage)
        if (!stageMatches.length) return null
        return (
          <div key={stage}>
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-2">
              {STAGE_LABELS[stage]}
            </h3>
            <div className="space-y-2">
              {stageMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
