import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Auth() {
  const { user, profile, updateDisplayName } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [nameSaving, setNameSaving] = useState(false)

  // If already logged in with a display name, redirect home
  useEffect(() => {
    if (user && profile?.display_name && profile.display_name !== email.split('@')[0]) {
      navigate('/', { replace: true })
    }
  }, [user, profile])

  async function handleMagicLink(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  async function handleSetName(e) {
    e.preventDefault()
    if (!displayName.trim()) return
    setNameSaving(true)
    const err = await updateDisplayName(displayName.trim())
    if (!err) navigate('/', { replace: true })
    setNameSaving(false)
  }

  // First-time user: needs to set display name
  if (user && profile && (profile.display_name === user.email?.split('@')[0] || !profile.display_name)) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
        <div className="card w-full max-w-sm text-center space-y-4">
          <h2 className="text-xl font-bold">Welcome! Set your name</h2>
          <p className="text-gray-400 text-sm">This is the name other players will see on the leaderboard.</p>
          <form onSubmit={handleSetName} className="space-y-3">
            <input
              className="input text-center"
              placeholder="Your display name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              maxLength={30}
              required
            />
            <button type="submit" disabled={nameSaving} className="btn-primary w-full">
              {nameSaving ? 'Saving…' : 'Continue →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
      <div className="card w-full max-w-sm text-center space-y-5">
        <div>
          <div className="text-5xl mb-3">⚽</div>
          <h1 className="text-2xl font-bold">WC 2026 Pool</h1>
          <p className="text-gray-400 text-sm mt-1">Predict every match. Top the leaderboard.</p>
        </div>

        {!sent ? (
          <form onSubmit={handleMagicLink} className="space-y-3">
            <input
              type="email"
              className="input text-center"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📧</div>
            <p className="font-semibold">Check your email!</p>
            <p className="text-gray-400 text-sm">We sent a magic link to <span className="text-white">{email}</span>. Click it to sign in.</p>
          </div>
        )}

        <p className="text-xs text-gray-600">Invite-only · No password required</p>
      </div>
    </div>
  )
}
