'use client'
import { useContext, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthContext } from '../context/AuthContext'
import { Menu, BarChart3, Users, FileText, User } from 'lucide-react'
import Navbar from './Navbar'

export default function Layout({ children }) {
  const { user, hasProfile } = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isAdmin = hasProfile('ADMIN')
  const isGestoreVoti = hasProfile('GESTORE_VOTI')
  const isGestoreCandidati = hasProfile('GESTORE_CANDIDATI')
  const isGestoreListe = hasProfile('GESTORE_LISTE')

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3, show: true },
    { label: 'Inserimento Voti', path: '/voti', icon: FileText, show: isGestoreVoti || isAdmin },
    { label: 'Sezioni', path: '/sezioni', icon: Users, show: isAdmin },
    { label: 'Liste', path: '/liste', icon: FileText, show: isAdmin || isGestoreListe },
    { label: 'Candidati Sindaci', path: '/candidati/sindaci', icon: User, show: isAdmin || isGestoreCandidati },
    { label: 'Candidati Consiglieri', path: '/candidati/consiglieri', icon: Users, show: isAdmin || isGestoreCandidati },
    { label: 'Utenti', path: '/utenti', icon: Users, show: isAdmin },
  ]

  const visibleItems = menuItems.filter(item => item.show)

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`fixed md:relative w-64 h-full bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">Comunali</h1>
          <p className="text-xs text-gray-500 mt-1">Scrutinio Voti</p>
        </div>

        <nav className="p-4 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}
