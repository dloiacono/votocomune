'use client'
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react'
import Modal from '@/components/Modal'
import ConfirmDialog from '@/components/ConfirmDialog'
import Badge from '@/components/Badge'
import * as candidatiApi from '@/api/candidati'
import * as listeApi from '@/api/liste'

export default function CandidatiConsiglieri() {
  const [consiglieri, setConsiglieri] = useState([])
  const [liste, setListe] = useState([])
  const [filtroLista, setFiltroLista] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    listaId: '',
    ordineLista: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (filtroLista) {
      loadConsiglieri(filtroLista)
    } else {
      loadConsiglieri()
    }
  }, [filtroLista])

  const loadData = async () => {
    try {
      setLoading(true)
      const listeData = await listeApi.getListe()
      setListe(listeData)
      await loadConsiglieri()
      setError(null)
    } catch (err) {
      setError('Errore nel caricamento dei dati')
    } finally {
      setLoading(false)
    }
  }

  const loadConsiglieri = async (listaId = null) => {
    try {
      const data = await candidatiApi.getConsiglieri(listaId)
      setConsiglieri(data)
    } catch (err) {
      setError('Errore nel caricamento dei consiglieri')
    }
  }

  const resetForm = () => {
    setFormData({ nome: '', cognome: '', listaId: '', ordineLista: '' })
    setEditingId(null)
  }

  const openEditModal = (consigliere) => {
    setFormData({
      nome: consigliere.nome,
      cognome: consigliere.cognome,
      listaId: consigliere.lista.id,
      ordineLista: consigliere.ordineLista
    })
    setEditingId(consigliere.id)
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        nome: formData.nome,
        cognome: formData.cognome,
        listaId: formData.listaId,
        ordineLista: parseInt(formData.ordineLista)
      }

      if (editingId) {
        await candidatiApi.updateConsigliere(editingId, payload)
      } else {
        await candidatiApi.createConsigliere(payload)
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
      await candidatiApi.deleteConsigliere(id)
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
        <h1 className="text-3xl font-bold text-gray-900">Candidati Consiglieri</h1>
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

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filtra per Lista</label>
        <select
          value={filtroLista}
          onChange={(e) => setFiltroLista(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Tutte le liste --</option>
          {liste.map(lista => (
            <option key={lista.id} value={lista.id}>
              {lista.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {consiglieri.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nessun candidato consigliere presente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cognome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Lista</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ordine</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {consiglieri.map(consigliere => (
                  <tr key={consigliere.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{consigliere.nome}</td>
                    <td className="py-3 px-4 text-gray-700">{consigliere.cognome}</td>
                    <td className="py-3 px-4">
                      <Badge color={consigliere.lista.colore}>
                        {consigliere.lista.nome}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 font-medium">
                      {consigliere.ordineLista}
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(consigliere)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifica"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(consigliere)}
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
        title={editingId ? 'Modifica Consigliere' : 'Nuovo Candidato Consigliere'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Lista</label>
            <select
              value={formData.listaId}
              onChange={(e) => setFormData({ ...formData, listaId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Seleziona lista --</option>
              {liste.map(lista => (
                <option key={lista.id} value={lista.id}>
                  {lista.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordine in Lista</label>
            <input
              type="number"
              value={formData.ordineLista}
              onChange={(e) => setFormData({ ...formData, ordineLista: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
        </form>
      </Modal>

      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Elimina Consigliere"
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
