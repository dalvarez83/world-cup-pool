import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function SetupProfile() {
  const { session, refreshProfile } = useAuth()
  const [name, setName]     = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    const { error: err } = await supabase
      .from('profiles')
      .update({ display_name: name.trim() })
      .eq('id', session.user.id)
    setSaving(false)
    if (err) { setError(err.message); return }
    await refreshProfile()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-navy-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-2xl font-bold">Welcome to the Pool!</h1>
          <p className="text-white/40 mt-2">Choose a display name to get started</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Your name</label>
              <input
                type="text"
                required
                maxLength={30}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alex, The Messi Fan, …"
                className="input"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={saving || !name.trim()} className="btn-primary w-full">
              {saving ? 'Saving…' : 'Join the Pool'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
