import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="text-center text-white/20 text-xs py-4">
        WC 2026 Pool · Built with ⚽
      </footer>
    </div>
  )
}
