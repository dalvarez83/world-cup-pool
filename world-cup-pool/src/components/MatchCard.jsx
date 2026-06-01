import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { formatPoints, getOutcome } from '../lib/scoring'
import { fetchAllOdds, getMatchOdds } from '../lib/odds'

function OddsBar({ odds }) {
  if (!odds) return null
  return (
    <div className="mt-3 pt-2 border-t border-navy-700">
      <div className="flex justify-between text-xs font-medium mb-1">
        <span className="text-blue-400">{odds.home}%</span>
        <span className="text-gray-500">{odds.draw}% draw</span>
        <span className="text-red-400">{odds.away}%</span>
      </div>
      <div className="flex rounded-full overflow-hidden h-2 gap-px">
        <div className="bg-blue-500 transition-all duration-500" style={{ width: `${odds.home}%` }} />
        <div className="bg-gray-600 transition-all duration-500" style={{ width: `${odds.draw}%` }} />
        <div className="bg-red-500 transition-all duration-500" style={{ width: `${odds.away}%` }} />
      </div>
      <div className="text-center text-xs text-gray-600 mt-1">
        Win probability · {odds.bookmakers} bookmaker{odds.bookmakers !== 1 ? 's' : ''} · 2× if underdog wins
      </div>
    </div>
  )
}

function ScoreDisplay({ home, away }) {
  return (
    <span className="text-2xl font-bold text-amber-400 tabular-nums">
      {home ?? '?'} – {away ?? '?'}
    </span>
  )
}

export default function MatchCard({ match, prediction: initialPrediction, onSaved }) {
  const { user } = useAuth()
  const [homeScore, setHomeScore] = useState('')
  const [awayScore, setAwayScore] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [prediction, setPrediction] = useState(initialPrediction)
  const [matchOdds, setMatchOdds] = useState(null)

  useEffect(() => {
    setPrediction(initialPrediction)
    if (initialPrediction) {
      setHomeScore(String(initialPrediction.home_score))
      setAwayScore(String(initialPrediction.away_score))
    }
  }, [initialPrediction])

  // Fetch odds for upcoming matches only
  useEffect(() => {
    const upcoming = !match.is_completed && (!match.match_date || new Date(match.match_date) > new Date())
    if (!upcoming) return
    fetchAllOdds().then(events => {
      if (events) setMatchOdds(getMatchOdds(match.home_team, match.away_team, events))
    })
  }, [match.id, match.home_team, match.away_team, match.is_completed])

  const isLocked = match.match_date && new Date(match.match_date) <= new Date()
  const isCompleted = match.is_completed
  const pts = prediction?.points ?? 0

  function resultLabel() {
    if (!isCompleted || !prediction) return null
    const actual = getOutcome(match.home_score, match.away_score)
    const predicted = getOutcome(prediction.home_score, prediction.away_score)
    const exact = prediction.home_score === match.home_score && prediction.away_score === match.away_score
    const upsetBonus =
      actual !== 'draw' &&
      match.home_prob != null && match.away_prob != null &&
      ((actual === 'home' && match.home_prob < match.away_prob) ||
       (actual === 'away' && match.away_prob < match.home_prob))
    const bonus = upsetBonus ? ' · 2× upset' : ''
    if (exact) return { text: `Exact! +${formatPoints(pts)} pts${bonus}`, color: 'text-emerald-400' }
    if (actual === predicted) return { text: `Correct outcome +${formatPoints(pts)} pts${bonus}`, color: 'text-blue-400' }
    return { text: 'No points', color: 'text-gray-600' }
  }

  async function handleSave() {
    const h = parseInt(homeScore)
    const a = parseInt(awayScore)
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return
    setSaving(true)
    const { data, error } = await supabase
      .from('predictions')
      .upsert({ user_id: user.id, match_id: match.id, home_score: h, away_score: a }, { onConflict: 'user_id,match_id' })
      .select()
      .single()
    if (!error) {
      setPrediction(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      onSaved?.()
    }
    setSaving(false)
  }

  const label = resultLabel()
  const matchDate = match.match_date
    ? new Date(match.match_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
    : 'TBD'

  return (
    <div className={`card flex flex-col gap-3 ${
      isCompleted ? 'border-navy-700' :
      isLocked ? 'border-navy-700 opacity-80' :
      'border-amber-500/20 hover:border-amber-500/50 transition-colors'
    }`}>
      <div className="flex justify-between items-start">
        <div className="text-xs text-gray-500">{matchDate}</div>
        {isLocked && !isCompleted && <span className="text-xs text-amber-600 bg-amber-900/30 px-2 py-0.5 rounded">Locked</span>}
        {isCompleted && <span className="text-xs text-gray-500 bg-navy-900/50 px-2 py-0.5 rounded">Final</span>}
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-sm flex-1 text-right truncate">{match.home_team}</span>
        <div className="flex flex-col items-center">
          {isCompleted
            ? <ScoreDisplay home={match.home_score} away={match.away_score} />
            : <span className="text-gray-600 text-lg">vs</span>
          }
        </div>
        <span className="font-semibold text-sm flex-1 text-left truncate">{match.away_team}</span>
      </div>

      {!isLocked && !isCompleted && (
        <div className="flex items-center gap-2 justify-center pt-1">
          <span className="text-xs text-gray-500">Your pick:</span>
          <input
            type="number" min="0" max="20"
            value={homeScore}
            onChange={e => setHomeScore(e.target.value)}
            className="score-input"
            placeholder="0"
          />
          <span className="text-gray-500">–</span>
          <input
            type="number" min="0" max="20"
            value={awayScore}
            onChange={e => setAwayScore(e.target.value)}
            className="score-input"
            placeholder="0"
          />
          <button
            onClick={handleSave}
            disabled={saving || homeScore === '' || awayScore === ''}
            className="btn-primary text-sm px-3 py-1"
          >
            {saved ? '✓' : saving ? '…' : 'Save'}
          </button>
        </div>
      )}

      {isLocked && prediction && !isCompleted && (
        <div className="text-center text-sm text-gray-400">
          Your pick: <span className="font-bold text-white">{prediction.home_score} – {prediction.away_score}</span>
        </div>
      )}

      {isCompleted && (
        <div className="flex items-center justify-between text-sm border-t border-navy-700 pt-2">
          <span className="text-gray-500">
            {prediction
              ? <>Your pick: <span className="font-bold text-white">{prediction.home_score}–{prediction.away_score}</span></>
              : <span className="text-gray-600">No prediction</span>
            }
          </span>
          {label && <span className={`font-semibold ${label.color}`}>{label.text}</span>}
        </div>
      )}

      {!isCompleted && <OddsBar odds={matchOdds} />}
    </div>
  )
}
