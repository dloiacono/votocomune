'use client'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '../context/AuthContext'
import { LogOut, Menu } from 'lucide-react'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useContext(AuthContext)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        <div className="flex-1"></div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-medium text-gray-900">
              {user?.nome} {user?.cognome}
            </p>
            <p className="text-xs text-gray-500">
              {user?.profili?.join(', ')}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Esci</span>
          </button>
        </div>
      </div>
    </header>
  )
}
