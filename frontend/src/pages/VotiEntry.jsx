import { useEffect, useState, useCallback } from 'react'
import { AlertCircle, Check, Save } from 'lucide-react'
import Badge from '../components/Badge'
import * as sezioniApi from '../api/sezioni'
import * as listeApi from '../api/liste'
import * as candidatiApi from '../api/candidati'
import * as votiApi from '../api/voti'

export default function VotiEntry() {
  const [sezioni, setSezioni] = useState([])
  const [selectedSezione, setSelectedSezione] = useState(null)
  const [liste, setListe] = useState([])
  const [consiglieri, setConsiglieri] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const [votiData, setVotiData] = useState({
    sezioneId: null,
    votantiTotali: '',
    schedeBianche: '',
    schedeNulle: '',
    listeVoti: {},
    sindaciVoti: {},
    consiglieriPreferenze: {}
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [sezioniData, listeData] = await Promise.all([
        sezioniApi.getSezioni(),
        listeApi.getListe()
      ])
      setSezioni(sezioniData)
      setListe(listeData)
    } catch (err) {
      setError('Errore nel caricamento dei dati')
    } finally {
      setLoading(false)
    }
  }

  const handleSezioneChange = useCallback(async (sezioneId) => {
    if (!sezioneId) {
      setSelectedSezione(null)
      setConsiglieri([])
      return
    }

    const sezione = sezioni.find(s => String(s.id) === String(sezioneId))
    setSelectedSezione(sezione)

    try {
      const consiglieriData = await candidatiApi.getConsiglieri()
      setConsiglieri(consiglieriData)

      try {
        const votiEsistenti = await votiApi.getVotiSezione(sezioneId)
        setVotiData({
          sezioneId,
          votantiTotali: votiEsistenti.votantiTotali || '',
          schedeBianche: votiEsistenti.schedeBianche || '',
          schedeNulle: votiEsistenti.schedeNulle || '',
          listeVoti: votiEsistenti.listeVoti || {},
          sindaciVoti: votiEsistenti.sindaciVoti || {},
          consiglieriPreferenze: votiEsistenti.consiglieriPreferenze || {}
        })
      } catch (err) {
        setVotiData({
          sezioneId,
          votantiTotali: '',
          schedeBianche: '',
          schedeNulle: '',
          listeVoti: {},
          sindaciVoti: {},
          consiglieriPreferenze: {}
        })
      }
    } catch (err) {
      setError('Errore nel caricamento dei consiglieri')
    }
  }, [sezioni])

  const handleInputChange = (field, value) => {
    setVotiData(prev => ({
      ...prev,
      [field]: value || ''
    }))
  }

  const handleListaVotiChange = (listaId, field, value) => {
    setVotiData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [listaId]: parseInt(value) || 0
      }
    }))
  }

  const handleConsigliereChange = (consigliereId, value) => {
    setVotiData(prev => ({
      ...prev,
      consiglieriPreferenze: {
        ...prev.consiglieriPreferenze,
        [consigliereId]: parseInt(value) || 0
      }
    }))
  }

  const handleSaveVoti = async (e) => {
    e.preventDefault()

    if (!votiData.sezioneId) {
      setError('Seleziona una sezione')
      return
    }

    try {
      setSaving(true)
      setError(null)
      await votiApi.saveVotiSezione(votiData)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nel salvataggio')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento dati...</p>
        </div>
      </div>
    )
  }

  const consiglieriByLista = {}
  consiglieri.forEach(c => {
    if (!consiglieriByLista[c.lista.id]) {
      consiglieriByLista[c.lista.id] = []
    }
    consiglieriByLista[c.lista.id].push(c)
  })

  Object.keys(consiglieriByLista).forEach(listaId => {
    consiglieriByLista[listaId].sort((a, b) => a.ordineLista - b.ordineLista)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Inserimento Voti</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <Check className="text-green-600" size={20} />
          <p className="text-green-700 font-medium">Voti salvati con successo!</p>
        </div>
      )}

      <form onSubmit={handleSaveVoti} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <label htmlFor="sezione" className="block text-sm font-semibold text-gray-900 mb-3">
            Seleziona Sezione
          </label>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <select
                id="sezione"
                value={selectedSezione?.id || ''}
                onChange={(e) => handleSezioneChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              >
                <option value="">-- Seleziona sezione --</option>
                {sezioni.map(sezione => (
                  <option key={sezione.id} value={sezione.id}>
                    Sezione {sezione.numero} - {sezione.nome}
                  </option>
                ))}
              </select>
            </div>
            {selectedSezione?.scrutinata && (
              <Badge variant="success">Già scrutinata</Badge>
            )}
          </div>
        </div>

        {selectedSezione && (
          <>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dati Generali</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votanti Totali
                  </label>
                  <input
                    type="number"
                    value={votiData.votantiTotali}
                    onChange={(e) => handleInputChange('votantiTotali', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schede Bianche
                  </label>
                  <input
                    type="number"
                    value={votiData.schedeBianche}
                    onChange={(e) => handleInputChange('schedeBianche', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schede Nulle
                  </label>
                  <input
                    type="number"
                    value={votiData.schedeNulle}
                    onChange={(e) => handleInputChange('schedeNulle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Voti per Lista</h2>
              <div className="space-y-4">
                {liste.map(lista => (
                  <div
                    key={lista.id}
                    className="border rounded-lg p-4"
                    style={{ borderLeftColor: lista.colore, borderLeftWidth: '4px' }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Voti Lista {lista.nome}
                        </label>
                        <input
                          type="number"
                          value={votiData.listeVoti[lista.id] || ''}
                          onChange={(e) => handleListaVotiChange(lista.id, 'listeVoti', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Voti Sindaco
                        </label>
                        <input
                          type="number"
                          value={votiData.sindaciVoti[lista.id] || ''}
                          onChange={(e) => handleListaVotiChange(lista.id, 'sindaciVoti', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(consiglieriByLista).length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferenze Consiglieri</h2>
                <div className="space-y-6">
                  {liste.map(lista => {
                    const consListaItems = consiglieriByLista[lista.id] || []
                    if (consListaItems.length === 0) return null

                    return (
                      <div key={lista.id}>
                        <h3
                          className="font-semibold text-white px-4 py-2 rounded mb-3"
                          style={{ backgroundColor: lista.colore }}
                        >
                          {lista.nome}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {consListaItems.map(cons => (
                            <div key={cons.id}>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {cons.nome} {cons.cognome} ({cons.ordineLista})
                              </label>
                              <input
                                type="number"
                                value={votiData.consiglieriPreferenze[cons.id] || ''}
                                onChange={(e) => handleConsigliereChange(cons.id, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                                min="0"
                                placeholder="0"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-bold text-lg flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {saving ? 'Salvataggio...' : 'Salva Voti Sezione'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
