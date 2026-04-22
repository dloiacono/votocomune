'use client'
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react'
import Modal from '@/components/Modal'
import ConfirmDialog from '@/components/ConfirmDialog'
import * as listeApi from '@/api/liste'

export default function Liste() {
  const [liste, setListe] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    numero: '',
    nome: '',
    simbolo: '',
    colore: '#3B82F6'
  })

  useEffect(() => {
    loadListe()
  }, [])

  const loadListe = async () => {
    try {
      setLoading(true)
      const data = await listeApi.getListe()
      setListe(data)
      setError(null)
    } catch (err) {
      setError('Errore nel caricamento delle liste')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ numero: '', nome: '', simbolo: '', colore: '#3B82F6' })
    setEditingId(null)
  }

  const openEditModal = (lista) => {
    setFormData({
      numero: lista.numero,
      nome: lista.nome,
      simbolo: lista.simbolo || '',
      colore: lista.colore || '#3B82F6'
    })
    setEditingId(lista.id)
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingId) {
        await listeApi.updateLista(editingId, formData)
      } else {
        await listeApi.createLista(formData)
      }
      await loadListe()
      setModalOpen(false)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nell\'operazione')
    }
  }

  const handleDelete = async (id) => {
    try {
      await listeApi.deleteLista(id)
      await loadListe()
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
        <h1 className="text-3xl font-bold text-gray-900">Gestione Liste Elettorali</h1>
        <button
          onClick={() => {
            resetForm()
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nuova Lista
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liste.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
            <p>Nessuna lista presente. Crea una nuova lista per iniziare.</p>
          </div>
        ) : (
          liste.map(lista => (
            <div key={lista.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Lista {lista.numero}</p>
                  <h3 className="text-lg font-semibold text-gray-900">{lista.nome}</h3>
                </div>
                <div
                  className="w-10 h-10 rounded-lg shadow-sm"
                  style={{ backgroundColor: lista.colore || '#3B82F6' }}
                  title={`Colore: ${lista.colore}`}
                ></div>
              </div>

              {lista.simbolo && (
                <p className="text-sm text-gray-600 mb-3">Simbolo: {lista.simbolo}</p>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => openEditModal(lista)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                >
                  <Edit2 size={16} />
                  Modifica
                </button>
                <button
                  onClick={() => setDeleteConfirm(lista)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  <Trash2 size={16} />
                  Elimina
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          resetForm()
        }}
        title={editingId ? 'Modifica Lista' : 'Nuova Lista'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Numero Lista</label>
            <input
              type="text"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Lista</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Simbolo</label>
            <input
              type="text"
              value={formData.simbolo}
              onChange={(e) => setFormData({ ...formData, simbolo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Es: simbolo della lista"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colore</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={formData.colore}
                onChange={(e) => setFormData({ ...formData, colore: e.target.value })}
                className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
              />
              <div
                className="h-10 w-32 rounded-lg border border-gray-300 shadow-sm"
                style={{ backgroundColor: formData.colore }}
              ></div>
              <input
                type="text"
                value={formData.colore}
                onChange={(e) => setFormData({ ...formData, colore: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
        </form>
      </Modal>

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Elimina Lista"
          message={`Sei sicuro di voler eliminare la lista "${deleteConfirm.nome}"? Questa azione non può essere annullata.`}
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
