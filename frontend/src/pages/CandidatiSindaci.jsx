import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Badge from '../components/Badge'
import * as candidatiApi from '../api/candidati'
import * as listeApi from '../api/liste'

export default function CandidatiSindaci() {
  const [sindaci, setSindaci] = useState([])
  const [liste, setListe] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    listeSelezionate: []
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [sindaciData, listeData] = await Promise.all([
        candidatiApi.getSindaci(),
        listeApi.getListe()
      ])
      setSindaci(sindaciData)
      setListe(listeData)
      setError(null)
    } catch (err) {
      setError('Errore nel caricamento dei dati')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ nome: '', cognome: '', listeSelezionate: [] })
    setEditingId(null)
  }

  const openEditModal = (sindaco) => {
    setFormData({
      nome: sindaco.nome,
      cognome: sindaco.cognome,
      listeSelezionate: sindaco.liste?.map(l => l.id) || []
    })
    setEditingId(sindaco.id)
    setModalOpen(true)
  }

  const handleListToggle = (listaId) => {
    setFormData(prev => ({
      ...prev,
      listeSelezionate: prev.listeSelezionate.includes(listaId)
        ? prev.listeSelezionate.filter(id => id !== listaId)
        : [...prev.listeSelezionate, listaId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        nome: formData.nome,
        cognome: formData.cognome,
        liste: formData.listeSelezionate
      }

      if (editingId) {
        await candidatiApi.updateSindaco(editingId, payload)
      } else {
        await candidatiApi.createSindaco(payload)
      }
      await loadData()
      setModalOpen(false)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nell\'operazione')
    }
  }

  const handleDelete = async (id) => {
    try {
      await candidatiApi.deleteSindaco(id)
      await loadData()
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
        <h1 className="text-3xl font-bold text-gray-900">Candidati Sindaci</h1>
        <button
          onClick={() => {
            resetForm()
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nuovo Candidato
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {sindaci.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nessun candidato sindaco presente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cognome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Liste di Supporto</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {sindaci.map(sindaco => (
                  <tr key={sindaco.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{sindaco.nome}</td>
                    <td className="py-3 px-4 text-gray-700">{sindaco.cognome}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        {sindaco.liste && sindaco.liste.length > 0 ? (
                          sindaco.liste.map(lista => (
                            <Badge key={lista.id} color={lista.colore}>
                              {lista.nome}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(sindaco)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifica"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(sindaco)}
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
        title={editingId ? 'Modifica Candidato' : 'Nuovo Candidato Sindaco'}
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
            <label className="block text-sm font-medium text-gray-700 mb-3">Liste di Supporto</label>
            <div className="space-y-2 border border-gray-300 rounded-lg p-3 bg-gray-50">
              {liste.map(lista => (
                <label key={lista.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.listeSelezionate.includes(lista.id)}
                    onChange={() => handleListToggle(lista.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: lista.colore }}
                  ></div>
                  <span className="text-gray-700">{lista.nome}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Elimina Candidato"
          message={`Sei sicuro di voler eliminare ${deleteConfirm.nome} ${deleteConfirm.cognome}? Questa azione non può essere annullata.`}
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
