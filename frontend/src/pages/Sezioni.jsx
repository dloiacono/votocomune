import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Badge from '../components/Badge'
import * as sezioniApi from '../api/sezioni'

export default function Sezioni() {
  const [sezioni, setSezioni] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    numero: '',
    nome: '',
    aventiDiritto: ''
  })

  useEffect(() => {
    loadSezioni()
  }, [])

  const loadSezioni = async () => {
    try {
      setLoading(true)
      const data = await sezioniApi.getSezioni()
      setSezioni(data)
      setError(null)
    } catch (err) {
      setError('Errore nel caricamento delle sezioni')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ numero: '', nome: '', aventiDiritto: '' })
    setEditingId(null)
  }

  const openEditModal = (sezione) => {
    setFormData({
      numero: sezione.numero,
      nome: sezione.nome,
      aventiDiritto: sezione.aventiDiritto
    })
    setEditingId(sezione.id)
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingId) {
        await sezioniApi.updateSezione(editingId, formData)
      } else {
        await sezioniApi.createSezione(formData)
      }
      await loadSezioni()
      setModalOpen(false)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nell\'operazione')
    }
  }

  const handleDelete = async (id) => {
    try {
      await sezioniApi.deleteSezione(id)
      await loadSezioni()
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nell\'eliminazione')
    }
    setDeleteConfirm(null)
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
        <h1 className="text-3xl font-bold text-gray-900">Gestione Sezioni</h1>
        <button
          onClick={() => {
            resetForm()
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nuova Sezione
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {sezioni.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nessuna sezione presente. Crea una nuova sezione per iniziare.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Numero</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Aventi Diritto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Stato</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {sezioni.map(sezione => (
                  <tr key={sezione.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{sezione.numero}</td>
                    <td className="py-3 px-4 text-gray-700">{sezione.nome}</td>
                    <td className="py-3 px-4 text-gray-700">{sezione.aventiDiritto}</td>
                    <td className="py-3 px-4">
                      <Badge variant={sezione.scrutinata ? 'success' : 'warning'}>
                        {sezione.scrutinata ? 'Scrutinata' : 'In attesa'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(sezione)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifica"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(sezione)}
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
        title={editingId ? 'Modifica Sezione' : 'Nuova Sezione'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Numero Sezione</label>
            <input
              type="text"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Sezione</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aventi Diritto</label>
            <input
              type="number"
              value={formData.aventiDiritto}
              onChange={(e) => setFormData({ ...formData, aventiDiritto: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>
        </form>
      </Modal>

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Elimina Sezione"
          message={`Sei sicuro di voler eliminare la sezione ${deleteConfirm.numero} - ${deleteConfirm.nome}? Questa azione non può essere annullata.`}
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
