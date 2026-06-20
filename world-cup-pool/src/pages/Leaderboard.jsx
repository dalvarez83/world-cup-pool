import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { formatPoints } from '../lib/scoring'

export default function Leaderboard() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.rpc('get_leaderboard')
    if (error) {
      console.error('leaderboard rpc error:', error)
      setLoading(false)
      return
    }
    const ranked = (data ?? []).map((r, i) => ({ ...r, rank: i + 1 }))
    setRows(ranked)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="text-center text-gray-500 py-20">Loading leaderboard…</div>

  const myRank = rows.find(r => r.user_id === user?.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <button onClick={load} className="btn-secondary text-sm px-3 py-1.5">Refresh</button>
      </div>

      {myRank && (
        <div className="card bg-amber-500/10 border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Your rank</div>
              <div className="text-2xl font-bold">#{myRank.rank}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Total points</div>
              <div className="text-2xl font-bold text-amber-400">{formatPoints(myRank.total_pts)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Predictions</div>
              <div className="text-2xl font-bold">{myRank.total_picks}</div>
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
              const isMe = row.user_id === user?.id
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
              return (
                <tr
                  key={row.user_id}
                  className={`border-b border-navy-700/50 transition-colors ${isMe ? 'bg-amber-500/10' : 'hover:bg-navy-700/30'}`}
                >
                  <td className="px-4 py-3 text-gray-500 w-10">
                    {medal ?? <span className="text-sm">{row.rank}</span>}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {row.display_name}
                    {isMe && <span className="ml-2 text-xs text-amber-500 font-normal">you</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-amber-400">{formatPoints(row.total_pts)}</td>
                  <td className="px-4 py-3 text-right text-gray-400 hidden sm:table-cell">{row.correct_picks}</td>
                  <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">{row.total_picks}</td>
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
