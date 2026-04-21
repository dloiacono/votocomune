# Frontend Comunali - Scrutinio Voti

Sistema di frontend React 18 + Vite per l'applicazione di conteggio voti per elezioni comunali italiane.

## Configurazione Tecnica

- **React 18** - UI framework
- **Vite 5** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Recharts** - Grafici
- **TailwindCSS** - Styling
- **Lucide React** - Icone

## Installazione

```bash
cd frontend
npm install
```

## Sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

### Proxy API

Durante lo sviluppo, Vite fa il proxy delle richieste a `/api` verso `http://localhost:8080/api` (backend Quarkus).

## Build per Produzione

```bash
npm run build
```

I file build saranno nella cartella `dist/`.

## Struttura del Progetto

```
src/
├── api/              # Client API
├── components/       # Componenti riutilizzabili
├── context/          # React Context (Auth)
├── pages/            # Pagine dell'app
├── App.jsx           # Router principale
├── main.jsx          # Entry point
└── index.css         # Stili globali
```

## Pagine Disponibili

- **Login** (`/login`) - Autenticazione
- **Dashboard** (`/dashboard`) - Dashboard principale con KPI e grafici
- **Inserimento Voti** (`/voti`) - Form per l'inserimento voti per sezione
- **Sezioni** (`/sezioni`) - Gestione sezioni (ADMIN)
- **Liste** (`/liste`) - Gestione liste elettorali (ADMIN, GESTORE_LISTE)
- **Candidati Sindaci** (`/candidati/sindaci`) - Gestione candidati sindaco (ADMIN, GESTORE_CANDIDATI)
- **Candidati Consiglieri** (`/candidati/consiglieri`) - Gestione candidati consiglieri (ADMIN, GESTORE_CANDIDATI)
- **Utenti** (`/utenti`) - Gestione utenti (ADMIN)

## Autenticazione

Il token JWT viene salvato in `localStorage` con chiave `comunali_token`. Il client Axios aggiunge automaticamente il token header `Authorization: Bearer {token}` a tutte le richieste.

Se il backend restituisce un 401, l'utente viene automaticamente reindirizzato al login.

## Profili Utente

- **ADMIN** - Accesso totale
- **GESTORE_CANDIDATI** - Gestisce candidati sindaco e consiglieri
- **GESTORE_LISTE** - Gestisce liste elettorali
- **GESTORE_VOTI** - Inserisce voti per sezione

Un utente può avere più profili contemporaneamente.

## Design Responsivo

L'applicazione è completamente responsiva:
- Desktop: sidebar fisso, full layout
- Tablet: sidebar/hamburger, layout ottimizzato
- Mobile: hamburger menu, single column layout

La pagina di inserimento voti è ottimizzata per l'uso su smartphone durante lo scrutinio, con campi grandi e chiari.

## Credenziali Demo

Usa le credenziali fornite dal backend per accedere.

## Variabili d'Ambiente

Nessuna configurazione di ambiente necessaria per lo sviluppo (il proxy Vite gestisce le API).

Per la produzione, assicurati che il frontend sia servito dallo stesso dominio del backend o che CORS sia configurato correttamente.
