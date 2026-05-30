import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import SetupProfile from './pages/SetupProfile'
import Home from './pages/Home'
import Schedule from './pages/Schedule'
import MyPicks from './pages/MyPicks'
import Leaderboard from './pages/Leaderboard'
import Admin from './pages/Admin'

function ProtectedRoute({ children, adminOnly = false }) {
  const { session, profile } = useAuth()
  if (session === undefined) return <div className="flex items-center justify-center h-screen bg-navy-800"><div className="text-gold-500 text-lg">Loading…</div></div>
  if (!session) return <Navigate to="/auth" replace />
  if (!profile?.display_name) return <Navigate to="/setup" replace />
  if (adminOnly && !profile?.is_admin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { session, profile } = useAuth()

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-navy-800">
        <div className="text-gold-500 text-lg">Loading…</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/auth" element={
        session ? <Navigate to="/" replace /> : <AuthPage />
      } />
      <Route path="/setup" element={
        !session ? <Navigate to="/auth" replace /> : <SetupProfile />
      } />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="picks" element={<MyPicks />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="admin" element={
          <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
