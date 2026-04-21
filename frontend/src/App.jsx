import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import VotiEntry from './pages/VotiEntry'
import Sezioni from './pages/Sezioni'
import Liste from './pages/Liste'
import CandidatiSindaci from './pages/CandidatiSindaci'
import CandidatiConsiglieri from './pages/CandidatiConsiglieri'
import Utenti from './pages/Utenti'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/voti" element={<VotiEntry />} />
            <Route path="/sezioni" element={<Sezioni />} />
            <Route path="/liste" element={<Liste />} />
            <Route path="/candidati/sindaci" element={<CandidatiSindaci />} />
            <Route path="/candidati/consiglieri" element={<CandidatiConsiglieri />} />
            <Route path="/utenti" element={<Utenti />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
