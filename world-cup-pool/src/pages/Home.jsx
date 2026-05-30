import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Target, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const WC_START = new Date('2026-06-11T21:00:00Z')

function useCountdown() {
  const [diff, setDiff] = useState(WC_START - new Date())
  useEffect(() => {
    const id = setInterval(() => setDiff(WC_START - new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  if (diff <= 0) return null
  const days    = Math.floor(diff / 86400000)
  const hours   = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

export default function Home() {
  const { profile } = useAuth()
  const countdown = useCountdown()
  const [top5, setTop5]         = useState([])
  const [myStats, setMyStats]   = useState(null)
  const [totalMatches, setTotal] = useState(0)
  const [myPicks, setMyPicks]   = useState(0)

  useEffect(() => {
    loadLeaderboard()
    loadMyStats()
    loadMatchCounts()
  }, [])

  async function loadLeaderboard() {
    const { data } = await supabase
      .from('predictions')
      .select('user_id, points, profiles(display_name)')
    if (!data) return
    const totals = {}
    data.forEach(p => {
      if (!totals[p.user_id]) totals[p.user_id] = { name: p.profiles?.display_name, pts: 0 }
      totals[p.user_id].pts += p.points
    })
    const sorted = Object.entries(totals)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.pts - a.pts)
      .slice(0, 5)
    setTop5(sorted)
  }

  async function loadMyStats() {
    if (!profile) return
    const { data } = await supabase
      .from('predictions')
      .select('points')
      .eq('user_id', profile.id)
    if (!data) return
    setMyStats(data.reduce((s, p) => s + p.points, 0))
    setMyPicks(data.length)
  }

  async function loadMatchCounts() {
    const { count } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('stage', 'group')
    setTotal(count ?? 72)
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="card p-8 text-center bg-gradient-to-br from-navy-600 to-navy-700 border-gold-500/10">
        <div className="text-5xl mb-3">🏆</div>
        <h1 className="text-2xl font-bold mb-1">FIFA World Cup 2026</h1>
        <p className="text-white/40 mb-6">USA · Canada · Mexico</p>

        {countdown ? (
          <div>
            <p className="text-white/50 text-sm mb-3">Tournament kicks off in</p>
            <div className="flex items-center justify-center gap-4">
              {[
                { v: countdown.days,    l: 'days'    },
                { v: countdown.hours,   l: 'hours'   },
                { v: countdown.minutes, l: 'min'     },
                { v: countdown.seconds, l: 'sec'     },
              ].map(({ v, l }) => (
                <div key={l} className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-gold-400 font-mono w-14 text-center">
                    {String(v).padStart(2, '0')}
                  </span>
                  <span className="text-white/30 text-xs mt-1">{l}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gold-400 font-semibold text-lg">The tournament has started! 🎉</p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <Trophy size={20} className="text-gold-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{myStats ?? 0}</div>
          <div className="text-white/40 text-xs mt-1">My Points</div>
        </div>
        <div className="card p-4 text-center">
          <Target size={20} className="text-gold-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{myPicks}</div>
          <div className="text-white/40 text-xs mt-1">Picks Made</div>
        </div>
        <div className="card p-4 text-center">
          <Clock size={20} className="text-gold-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{totalMatches - myPicks}</div>
          <div className="text-white/40 text-xs mt-1">Remaining</div>
        </div>
      </div>

      {/* Quick leaderboard */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm text-white/70 uppercase tracking-wider">Top 5</h2>
          <Link to="/leaderboard" className="text-gold-500 text-xs hover:underline">View all →</Link>
        </div>
        {top5.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-4">No picks yet — be the first!</p>
        ) : (
          <div className="space-y-2">
            {top5.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3 py-1.5">
                <span className={`w-6 text-center font-bold text-sm ${i === 0 ? 'text-gold-400' : 'text-white/30'}`}>
                  {i + 1}
                </span>
                <span className="flex-1 font-medium text-sm">{u.name}</span>
                <span className="font-bold text-gold-400">{u.pts} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      {myPicks < totalMatches && (
        <div className="text-center">
          <Link to="/picks" className="btn-primary inline-block px-8 py-3 text-base">
            Make Your Picks →
          </Link>
        </div>
      )}
    </div>
  )
}
