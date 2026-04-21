import { useEffect, useState, useCallback } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AlertCircle, RefreshCw } from 'lucide-react'
import KpiCard from '../components/KpiCard'
import Badge from '../components/Badge'
import * as dashboardApi from '../api/dashboard'

export default function Dashboard() {
  const [riepilogo, setRiepilogo] = useState(null)
  const [sindaci, setSindaci] = useState([])
  const [liste, setListe] = useState([])
  const [sezioni, setSezioni] = useState([])
  const [consiglieri, setConsiglieri] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const [riepilogoData, sindaciData, listeData, sezioniData, consiglieriData] = await Promise.all([
        dashboardApi.getRiepilogo(),
        dashboardApi.getSindaciDashboard(),
        dashboardApi.getListeDashboard(),
        dashboardApi.getSezioniDashboard(),
        dashboardApi.getConsiglieridashboard()
      ])

      setRiepilogo(riepilogoData)
      setSindaci(sindaciData || [])
      setListe(listeData || [])
      setSezioni(sezioniData || [])
      setConsiglieri((consiglieriData || []).slice(0, 10))
    } catch (err) {
      setError('Errore nel caricamento dei dati')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-semibold text-red-900">Errore</h3>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={fetchData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    )
  }

  const completamento = riepilogo
    ? Math.round((riepilogo.sezioniScrutinate / riepilogo.sezioniTotali) * 100)
    : 0

  const sindaciChartData = sindaci.map(s => ({
    name: `${s.nome} ${s.cognome}`,
    voti: s.votiTotali || 0
  }))

  const listeChartData = liste.map(l => ({
    name: l.nome,
    value: l.votiTotali || 0,
    color: l.colore
  }))

  const consiglieriChartData = consiglieri.map(c => ({
    name: `${c.nome} ${c.cognome}`,
    voti: c.preferenzeTotali || 0
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Scrutinio</h1>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={20} />
          Aggiorna
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Sezioni Scrutinate"
          value={`${riepilogo?.sezioniScrutinate || 0}/${riepilogo?.sezioniTotali || 0}`}
          subtitle={`${completamento}% completato`}
          color="blue"
        />
        <KpiCard
          title="Votanti Totali"
          value={riepilogo?.votantiTotali || 0}
          subtitle={`su ${riepilogo?.aventiDirittoTotali || 0} aventi diritto`}
          color="green"
        />
        <KpiCard
          title="Schede Bianche/Nulle"
          value={`${(riepilogo?.schedeBiancheTotali || 0) + (riepilogo?.schedeNulleTotali || 0)}`}
          subtitle={`${riepilogo?.schedeBiancheTotali || 0} bianche, ${riepilogo?.schedeNulleTotali || 0} nulle`}
          color="orange"
        />
        <KpiCard
          title="Completamento"
          value={`${completamento}%`}
          subtitle="stato scrutinio"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Voti per Sindaco</h2>
          {sindaciChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sindaciChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="voti" fill="#0284c7" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Nessun dato disponibile</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Voti per Lista</h2>
          {listeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={listeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {listeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#0284c7'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Nessun dato disponibile</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Stato Sezioni</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Sezione</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Stato</th>
                  <th className="text-right py-2 px-4 font-semibold text-gray-700">Votanti</th>
                </tr>
              </thead>
              <tbody>
                {sezioni.slice(0, 5).map((sezione) => (
                  <tr key={sezione.sezioneId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{sezione.numero}</td>
                    <td className="py-3 px-4 text-gray-700">{sezione.nome}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={sezione.scrutinata ? 'success' : 'warning'}
                      >
                        {sezione.scrutinata ? 'Scrutinata' : 'In attesa'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">{sezione.votanti}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sezioni.length > 5 && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                Visualizzate 5 sezioni di {sezioni.length}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 10 Consiglieri per Preferenze</h2>
          {consiglieriChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consiglieriChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="voti" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Nessun dato disponibile</p>
          )}
        </div>
      </div>
    </div>
  )
}
