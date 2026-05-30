import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { profile, signOut } = useAuth()
  const { pathname } = useLocation()

  const link = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        pathname === to ? 'bg-amber-500 text-black' : 'text-gray-300 hover:text-white hover:bg-navy-700'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-navy-800 border-b border-navy-700 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-amber-500 font-bold text-lg mr-4">⚽ WC 2026</span>
          {link('/', 'Predictions')}
          {link('/leaderboard', 'Leaderboard')}
          {profile?.is_admin && link('/admin', 'Admin')}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{profile?.display_name}</span>
          <button onClick={signOut} className="text-xs text-gray-500 hover:text-white transition-colors">Sign out</button>
        </div>
      </div>
    </nav>
  )
}
