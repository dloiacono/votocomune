import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Badge from '../components/Badge'
import * as utentiApi from '../api/utenti'

const PROFILI_DISPONIBILI = ['ADMIN', 'GESTORE_CANDIDATI', 'GESTORE_LISTE', 'GESTORE_VOTI']

export default function Utenti() {
  const [utenti, setUtenti] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    nome: '',
    cognome: '',
    email: '',
    password: '',
    profili: []
  })

  useEffect(() => {
    loadUtenti()
  }, [])

  const loadUtenti = async () => {
    try {
      setLoading(true)
      const data = await utentiApi.getUtenti()
      setUtenti(data)
      setError(null)
    } catch (err) {
      setError('Errore nel caricamento degli utenti')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      username: '',
      nome: '',
      cognome: '',
      email: '',
      password: '',
      profili: []
    })
    setEditingId(null)
  }

  const openEditModal = (utente) => {
    setFormData({
      username: utente.username,
      nome: utente.nome,
      cognome: utente.cognome,
      email: utente.email || '',
      password: '',
      profili: utente.profili || []
    })
    setEditingId(utente.id)
    setModalOpen(true)
  }

  const handleProfiloToggle = (profilo) => {
    setFormData(prev => ({
      ...prev,
      profili: prev.profili.includes(profilo)
        ? prev.profili.filter(p => p !== profilo)
        : [...prev.profili, profilo]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        username: formData.username,
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        profili: formData.profili
      }

      if (editingId) {
        if (formData.password) {
          payload.password = formData.password
        }
        await utentiApi.updateUtente(editingId, payload)
      } else {
        if (!formData.password) {
          setError('La password è obbligatoria per i nuovi utenti')
          return
        }
        payload.password = formData.password
        await utentiApi.createUtente(payload)
      }
      await loadUtenti()
      setModalOpen(false)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nell\'operazione')
    }
  }

  const handleDelete = async (id) => {
    try {
      await utentiApi.deleteUtente(id)
      await loadUtenti()
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nell\'eliminazione')
    }
    setDeleteConfirm(null)
  }

  const profiloVariant = {
    ADMIN: 'admin',
    GESTORE_CANDIDATI: 'candidati',
    GESTORE_LISTE: 'liste',
    GESTORE_VOTI: 'voti'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestione Utenti</h1>
        <button
          onClick={() => {
            resetForm()
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nuovo Utente
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {utenti.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nessun utente presente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Username</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cognome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Profili</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {utenti.map(utente => (
                  <tr key={utente.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{utente.username}</td>
                    <td className="py-3 px-4 text-gray-700">{utente.nome}</td>
                    <td className="py-3 px-4 text-gray-700">{utente.cognome}</td>
                    <td className="py-3 px-4 text-gray-700 text-sm">{utente.email || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        {utente.profili && utente.profili.length > 0 ? (
                          utente.profili.map(profilo => (
                            <Badge key={profilo} variant={profiloVariant[profilo] || 'default'}>
                              {profilo.replace(/_/g, ' ')}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(utente)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifica"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(utente)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Elimina"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          resetForm()
        }}
        title={editingId ? 'Modifica Utente' : 'Nuovo Utente'}
        size="md"
        footer={
          <>
            <button
              onClick={() => {
                setModalOpen(false)
                resetForm()
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salva
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={editingId}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
            <input
              type="text"
              value={formData.cognome}
              onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {editingId && '(lasciare vuoto per non cambiare)'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!editingId}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Profili</label>
            <div className="space-y-2 border border-gray-300 rounded-lg p-3 bg-gray-50">
              {PROFILI_DISPONIBILI.map(profilo => (
                <label key={profilo} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.profili.includes(profilo)}
                    onChange={() => handleProfiloToggle(profilo)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                  <span className="text-gray-700">{profilo.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Elimina Utente"
          message={`Sei sicuro di voler eliminare l'utente ${deleteConfirm.username}? Questa azione non può essere annullata.`}
          confirmText="Elimina"
          cancelText="Annulla"
          onConfirm={() => handleDelete(deleteConfirm.id)}
          onCancel={() => setDeleteConfirm(null)}
          variant="danger"
        />
      )}
    </div>
  )
}
