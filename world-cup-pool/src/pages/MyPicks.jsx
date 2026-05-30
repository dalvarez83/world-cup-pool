import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { GROUPS } from '../data/tournament'
import { STAGE_LABELS, STAGE_ORDER } from '../lib/scoring'
import MatchCard from '../components/MatchCard'
import PredictionModal from '../components/PredictionModal'

export default function MyPicks() {
  const { profile } = useAuth()
  const [matches, setMatches]         = useState([])
  const [predictions, setPredictions] = useState({})
  const [activeMatch, setActiveMatch] = useState(null)
  const [stageFilter, setStageFilter] = useState('group')
  const [loading, setLoading]         = useState(true)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [{ data: ms }, { data: ps }] = await Promise.all([
      supabase.from('matches').select('*').order('kickoff_time'),
      supabase.from('predictions').select('*').eq('user_id', profile.id),
    ])
    setMatches(ms ?? [])
    const map = {}
    ;(ps ?? []).forEach(p => { map[p.match_id] = p })
    setPredictions(map)
    setLoading(false)
  }

  const stages = [...new Set(matches.map(m => m.stage))]
    .sort((a, b) => STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b))

  const visibleMatches = matches.filter(m => m.stage === stageFilter)

  const totalPoints = Object.values(predictions).reduce((s, p) => s + p.points, 0)
  const picksCount  = Object.keys(predictions).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Picks</h1>
        <div className="text-right">
          <div className="text-xl font-bold text-gold-400">{totalPoints} pts</div>
          <div className="text-white/40 text-xs">{picksCount} picks made</div>
        </div>
      </div>

      {/* Stage tabs */}
      <div className="flex flex-wrap gap-2">
        {stages.map(s => {
          const stageMatches = matches.filter(m => m.stage === s)
          const stagePicks   = stageMatches.filter(m => predictions[m.id]).length
          return (
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                stageFilter === s ? 'bg-gold-500 text-navy-900' : 'btn-secondary'
              }`}
            >
              {STAGE_LABELS[s]}
              <span className="ml-1.5 opacity-60">{stagePicks}/{stageMatches.length}</span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="text-white/30 text-center py-12">Loading…</div>
      ) : (
        <div className="space-y-2">
          {visibleMatches.length === 0 ? (
            <p className="text-white/30 text-center py-8">No matches in this stage yet.</p>
          ) : (
            visibleMatches.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                prediction={predictions[m.id]}
                onPredict={setActiveMatch}
              />
            ))
          )}
        </div>
      )}

      {activeMatch && (
        <PredictionModal
          match={activeMatch}
          existing={predictions[activeMatch.id]}
          onClose={() => setActiveMatch(null)}
          onSaved={loadAll}
        />
      )}
    </div>
  )
}
