import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { formatPoints, calculatePoints } from '../lib/scoring'

export default function Leaderboard() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { data: preds },
        { data: matches },
        { data: profiles },
      ] = await Promise.all([
        supabase.from('predictions').select('user_id, home_score, away_score, match_id'),
        supabase.from('matches').select('id, home_score, away_score, stage, is_completed, home_prob, away_prob').eq('is_completed', true),
        supabase.from('profiles').select('id, display_name'),
      ])

      if (!preds || !profiles || !matches) { setLoading(false); return }

      const matchMap = {}
      matches.forEach(m => { matchMap[m.id] = m })

      const profileMap = {}
      profiles.forEach(p => { profileMap[p.id] = p.display_name })

      const stats = {}
      preds.forEach(p => {
        if (!stats[p.user_id]) stats[p.user_id] = { userId: p.user_id, total: 0, correct: 0, made: 0 }
        const match = matchMap[p.match_id]
        const pts = match ? calculatePoints(p, match) : 0
        stats[p.user_id].total += pts
        stats[p.user_id].made++
        if (pts > 0) stats[p.user_id].correct++
      })

      const sorted = Object.values(stats)
        .sort((a, b) => b.total - a.total)
        .map((s, i) => ({ ...s, rank: i + 1, name: profileMap[s.userId] ?? 'Unknown' }))

      setRows(sorted)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-center text-gray-500 py-20">Loading leaderboard…</div>

  const myRank = rows.find(r => r.userId === user?.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Leaderboard</h1>

      {myRank && (
        <div className="card bg-amber-500/10 border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Your rank</div>
              <div className="text-2xl font-bold">#{myRank.rank}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Total points</div>
              <div className="text-2xl font-bold text-amber-400">{formatPoints(myRank.total)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Predictions</div>
              <div className="text-2xl font-bold">{myRank.made}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-700 text-gray-500 text-sm">
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Player</th>
              <th className="text-right px-4 py-3">Points</th>
              <th className="text-right px-4 py-3 hidden sm:table-cell">Scored</th>
              <th className="text-right px-4 py-3 hidden sm:table-cell">Picks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isMe = row.userId === user?.id
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
              return (
                <tr
                  key={row.userId}
                  className={`border-b border-navy-700/50 transition-colors ${isMe ? 'bg-amber-500/10' : 'hover:bg-navy-700/30'}`}
                >
                  <td className="px-4 py-3 text-gray-500 w-10">
                    {medal ?? <span className="text-sm">{row.rank}</span>}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {row.name}
                    {isMe && <span className="ml-2 text-xs text-amber-500 font-normal">you</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-amber-400">{formatPoints(row.total)}</td>
                  <td className="px-4 py-3 text-right text-gray-400 hidden sm:table-cell">{row.correct}</td>
                  <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">{row.made}</td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-gray-600">No predictions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
