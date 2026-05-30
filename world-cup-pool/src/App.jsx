import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Leaderboard from './pages/Leaderboard'
import Admin from './pages/Admin'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><span className="text-gray-400">Loading…</span></div>
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function AdminRoute({ children }) {
  const { profile, loading } = useAuth()
  if (loading) return null
  if (!profile?.is_admin) return <Navigate to="/" replace />
  return children
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Home /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Layout><Leaderboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminRoute>
                <Layout><Admin /></Layout>
              </AdminRoute>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
