import { useState } from 'react'
import { X } from 'lucide-react'
import { teamFlag, teamName } from '../data/tournament'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function PredictionModal({ match, existing, onClose, onSaved }) {
  const { profile } = useAuth()
  const [home, setHome] = useState(existing?.home_score ?? 0)
  const [away, setAway] = useState(existing?.away_score ?? 0)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  const homeName = match.home_team ? teamName(match.home_team) : match.home_placeholder ?? 'TBD'
  const awayName = match.away_team ? teamName(match.away_team) : match.away_placeholder ?? 'TBD'
  const homeFlag = match.home_team ? teamFlag(match.home_team) : '🏳'
  const awayFlag = match.away_team ? teamFlag(match.away_team) : '🏳'

  async function handleSave() {
    setSaving(true)
    setError(null)
    const payload = {
      user_id:    profile.id,
      match_id:   match.id,
      home_score: Number(home),
      away_score: Number(away),
      updated_at: new Date().toISOString(),
    }
    const { error: err } = await supabase
      .from('predictions')
      .upsert(payload, { onConflict: 'user_id,match_id' })
    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved()
    onClose()
  }

  function clamp(val) {
    const n = parseInt(val, 10)
    return isNaN(n) ? 0 : Math.max(0, Math.min(n, 20))
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-sm p-6 relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white/80">
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold mb-1">Your Prediction</h2>
        <p className="text-white/40 text-sm mb-6">Pick the final score at 90 mins</p>

        {/* Teams & score inputs */}
        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-3xl">{homeFlag}</span>
            <span className="text-sm font-semibold text-center">{homeName}</span>
            <input
              type="number"
              min="0" max="20"
              value={home}
              onChange={e => setHome(clamp(e.target.value))}
              className="score-input"
            />
          </div>

          <span className="text-white/30 text-2xl font-light">–</span>

          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-3xl">{awayFlag}</span>
            <span className="text-sm font-semibold text-center">{awayName}</span>
            <input
              type="number"
              min="0" max="20"
              value={away}
              onChange={e => setAway(clamp(e.target.value))}
              className="score-input"
            />
          </div>
        </div>

        {/* Outcome badge */}
        <div className="text-center mb-6">
          <span className="text-sm px-3 py-1 rounded-full bg-navy-500 text-white/60">
            {home > away ? `${homeName} win` : home < away ? `${awayName} win` : 'Draw'}
          </span>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving…' : 'Save Pick'}
        </button>
      </div>
    </div>
  )
}
