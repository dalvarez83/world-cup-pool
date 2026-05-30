import { useEffect, useState } from 'react'
import { Trophy, Medal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Leaderboard() {
  const { profile } = useAuth()
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('predictions')
      .select('user_id, points, home_score, away_score, matches(home_score, away_score), profiles(display_name)')
      .then(({ data }) => {
        if (!data) { setLoading(false); return }
        const totals = {}
        data.forEach(p => {
          if (!totals[p.user_id]) {
            totals[p.user_id] = {
              id:     p.user_id,
              name:   p.profiles?.display_name ?? 'Unknown',
              pts:    0,
              exact:  0,
              correct: 0,
              picks:  0,
            }
          }
          const t = totals[p.user_id]
          t.picks++
          t.pts += p.points
          if (p.points > 0) {
            const mRes = p.matches
            if (mRes?.home_score !== null && mRes?.home_score !== undefined) {
              if (p.home_score === mRes.home_score && p.away_score === mRes.away_score) {
                t.exact++
              } else if (p.points > 0) {
                t.correct++
              }
            }
          }
        })
        const sorted = Object.values(totals).sort((a, b) => b.pts - a.pts || b.exact - a.exact)
        setRows(sorted)
        setLoading(false)
      })
  }, [])

  const medalColors = ['text-gold-400', 'text-gray-300', 'text-amber-600']

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Standings</h1>

      {loading ? (
        <div className="text-white/30 text-center py-12">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="card p-12 text-center text-white/30">
          No picks have been submitted yet.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left w-10">#</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-right">Pts</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Exact</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Outcome</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Picks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const isMe = r.id === profile?.id
                return (
                  <tr
                    key={r.id}
                    className={`border-b border-white/5 last:border-0 transition-colors ${
                      isMe ? 'bg-gold-500/5' : 'hover:bg-white/3'
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      {i < 3 ? (
                        <Medal size={16} className={medalColors[i]} />
                      ) : (
                        <span className="text-white/30 font-mono">{i + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${isMe ? 'text-gold-400' : ''}`}>
                        {r.name}
                        {isMe && <span className="ml-2 text-xs text-white/30">(you)</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gold-400">{r.pts}</td>
                    <td className="px-4 py-3 text-right text-white/60 hidden sm:table-cell">{r.exact}</td>
                    <td className="px-4 py-3 text-right text-white/60 hidden sm:table-cell">{r.correct}</td>
                    <td className="px-4 py-3 text-right text-white/40 hidden md:table-cell">{r.picks}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="card p-4 text-xs text-white/40 space-y-1">
        <p><span className="text-gold-400 font-semibold">Exact score</span> — 3 pts · 4 pts R32 · 6 pts R16 · 9 pts QF · 12 pts SF · 15 pts Final</p>
        <p><span className="text-white/60 font-semibold">Correct outcome</span> — 1 pt · 2 pts R32 · 2 pts R16 · 3 pts QF · 4 pts SF · 5 pts Final</p>
      </div>
    </div>
  )
}
