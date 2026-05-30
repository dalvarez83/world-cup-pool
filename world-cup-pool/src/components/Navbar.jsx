import { NavLink, useNavigate } from 'react-router-dom'
import { Trophy, Calendar, Target, BarChart3, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const links = [
  { to: '/',           label: 'Home',       icon: Trophy    },
  { to: '/schedule',   label: 'Schedule',   icon: Calendar  },
  { to: '/picks',      label: 'My Picks',   icon: Target    },
  { to: '/leaderboard',label: 'Standings',  icon: BarChart3 },
]

export default function Navbar() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/auth')
  }

  return (
    <nav className="bg-navy-900 border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 flex items-center h-14 gap-1">
        {/* Logo */}
        <span className="text-gold-500 font-bold text-lg mr-4 whitespace-nowrap">
          ⚽ WC 2026
        </span>

        {/* Main nav */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
          {profile?.is_admin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Settings size={14} />
              Admin
            </NavLink>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2 ml-2 shrink-0">
          <span className="text-white/50 text-sm hidden sm:block">{profile?.display_name}</span>
          <button
            onClick={handleSignOut}
            className="text-white/40 hover:text-white/80 transition-colors p-1.5 rounded-lg hover:bg-white/5"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  )
}
