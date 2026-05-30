import { Lock } from 'lucide-react'
import { teamFlag, teamName } from '../data/tournament'
import { pointsDescription } from '../lib/scoring'

function isLocked(kickoffTime) {
  return new Date(kickoffTime) <= new Date()
}

export default function MatchCard({ match, prediction, onPredict }) {
  const locked = isLocked(match.kickoff_time)
  const finished = match.status === 'finished'
  const hasResult = match.home_score !== null && match.away_score !== null

  const kickoff = new Date(match.kickoff_time)
  const dateStr  = kickoff.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const timeStr  = kickoff.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const homeCode = match.home_team
  const awayCode = match.away_team
  const homeName = homeCode ? teamName(homeCode) : match.home_placeholder ?? 'TBD'
  const awayName = awayCode ? teamName(awayCode) : match.away_placeholder ?? 'TBD'
  const homeFlag = homeCode ? teamFlag(homeCode) : '🏳'
  const awayFlag = awayCode ? teamFlag(awayCode) : '🏳'

  function resultClass(predH, predA, actH, actA) {
    if (predH === actH && predA === actA) return 'text-green-400'
    const pOut = Math.sign(predH - predA)
    const aOut = Math.sign(actH - actA)
    if (pOut === aOut) return 'text-gold-400'
    return 'text-red-400'
  }

  return (
    <div className={`card p-4 ${locked ? 'opacity-90' : 'hover:border-gold-500/20 transition-colors'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-xs text-white/40">
        <span>{dateStr} · {timeStr}</span>
        <span className="hidden sm:block">{match.city}</span>
        {locked && <Lock size={11} className="text-white/30" />}
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-2xl">{homeFlag}</span>
          <span className="font-semibold text-sm sm:text-base truncate">{homeName}</span>
        </div>

        {/* Score / result */}
        <div className="flex items-center gap-2 shrink-0">
          {hasResult ? (
            <div className="flex items-center gap-1 font-bold text-xl">
              <span className="text-white/90">{match.home_score}</span>
              <span className="text-white/30 text-sm">–</span>
              <span className="text-white/90">{match.away_score}</span>
            </div>
          ) : (
            <span className="text-white/30 text-sm font-medium">vs</span>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <span className="font-semibold text-sm sm:text-base truncate text-right">{awayName}</span>
          <span className="text-2xl">{awayFlag}</span>
        </div>
      </div>

      {/* Prediction row */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="text-xs text-white/30">{pointsDescription(match.stage)}</div>
        <div className="flex items-center gap-3">
          {prediction ? (
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-mono font-semibold ${hasResult
                ? resultClass(prediction.home_score, prediction.away_score, match.home_score, match.away_score)
                : 'text-white/70'}`}>
                {prediction.home_score}–{prediction.away_score}
              </span>
              {hasResult && (
                <span className="text-xs font-bold text-gold-400">
                  {prediction.points > 0 ? `+${prediction.points}` : '0'} pts
                </span>
              )}
            </div>
          ) : (
            !locked && <span className="text-xs text-white/30 italic">no pick yet</span>
          )}
          {!locked && onPredict && (
            <button onClick={() => onPredict(match)} className="btn-primary text-xs px-3 py-1">
              {prediction ? 'Edit' : 'Pick'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
