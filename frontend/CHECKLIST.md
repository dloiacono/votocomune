# Checklist Frontend Comunali

## Stack Tecnico
- [x] React 18
- [x] Vite 5
- [x] React Router v6
- [x] Axios per HTTP
- [x] Recharts per grafici
- [x] TailwindCSS per stili
- [x] Lucide React per icone

## Struttura File
- [x] package.json con tutte le dipendenze
- [x] vite.config.js con proxy API
- [x] tailwind.config.js
- [x] postcss.config.js
- [x] index.html
- [x] .gitignore
- [x] src/main.jsx
- [x] src/App.jsx con routing completo
- [x] src/index.css

## API Client
- [x] src/api/client.js - Axios instance con JWT interceptor
- [x] src/api/auth.js - Login e getCurrentUser
- [x] src/api/sezioni.js - CRUD sezioni
- [x] src/api/liste.js - CRUD liste
- [x] src/api/candidati.js - CRUD sindaci e consiglieri
- [x] src/api/voti.js - API voti
- [x] src/api/dashboard.js - API dashboard
- [x] src/api/utenti.js - CRUD utenti

## Autenticazione
- [x] src/context/AuthContext.jsx - Context per auth
  - [x] login(username, password)
  - [x] logout()
  - [x] hasProfile(name)
  - [x] hasAnyProfile(names)
  - [x] user, token, isAuthenticated, loading, error
- [x] Token JWT salvato in localStorage
- [x] Auto-refresh user al caricamento

## Componenti Riutilizzabili
- [x] src/components/PrivateRoute.jsx - Route con autenticazione
- [x] src/components/Layout.jsx - Layout con sidebar + main
- [x] src/components/Navbar.jsx - Header con user info e logout
- [x] src/components/Modal.jsx - Modale generica
- [x] src/components/Badge.jsx - Badge con colore custom
- [x] src/components/KpiCard.jsx - Card KPI
- [x] src/components/ConfirmDialog.jsx - Dialogo di conferma

## Pagine
- [x] src/pages/Login.jsx
  - [x] Form username/password
  - [x] Logo/titolo app
  - [x] Gestione errori
  - [x] Redirect a dashboard on success
- [x] src/pages/Dashboard.jsx
  - [x] 4 KPI card (sezioni, votanti, schede, percentuale)
  - [x] Grafico bar sindaci
  - [x] Grafico pie liste
  - [x] Tabella stato sezioni
  - [x] Grafico bar top 10 consiglieri
  - [x] Auto-refresh 30 secondi
- [x] src/pages/VotiEntry.jsx
  - [x] Selettore sezione
  - [x] Campo votanti totali
  - [x] Campo schede bianche/nulle
  - [x] Card liste con voti lista e sindaco
  - [x] Campi preferenze consiglieri per lista
  - [x] Bottone salva ben visibile
  - [x] Mobile-first design (py-3, px-4)
  - [x] Caricamento dati esistenti se scrutinata
- [x] src/pages/Sezioni.jsx
  - [x] Tabella sezioni
  - [x] Form modale aggiunta/modifica
  - [x] Pulsante elimina con conferma
- [x] src/pages/Liste.jsx
  - [x] Card liste con colore
  - [x] Form modale con color picker
  - [x] Preview colore
  - [x] Modifica/elimina
- [x] src/pages/CandidatiSindaci.jsx
  - [x] Tabella sindaci
  - [x] Mostra liste di supporto (badge colorati)
  - [x] Form modale con multiselect liste
  - [x] Modifica/elimina
- [x] src/pages/CandidatiConsiglieri.jsx
  - [x] Tabella consiglieri
  - [x] Filtro per lista
  - [x] Form modale con lista select e ordine
  - [x] Modifica/elimina
- [x] src/pages/Utenti.jsx
  - [x] Tabella utenti
  - [x] Form modale con checkbox profili
  - [x] Password opzionale per modifica
  - [x] Modifica/elimina

## Funzionalità
- [x] Routing con React Router v6
- [x] Route protection con PrivateRoute
- [x] Sidebar con menu dinamico in base ai profili
- [x] Hamburger menu su mobile
- [x] Loading states su tutte le pagine
- [x] Error handling con messaggi leggibili
- [x] CRUD operations su tutte le anagrafiche
- [x] Modal generica riutilizzabile
- [x] Confirm dialog per eliminazioni
- [x] Tabelle responsives
- [x] Form validation
- [x] Color picker per liste
- [x] Multiselect con checkbox
- [x] Checkbox singoli per profili
- [x] Grafici Recharts (bar, pie)
- [x] Badge con colori custom
- [x] KPI card
- [x] Auto-refresh dashboard
- [x] Search/filter consiglieri per lista

## Design & UX
- [x] Mobile-first responsive
- [x] 100% TailwindCSS
- [x] Sidebar sticky
- [x] Hamburger menu su mobile
- [x] Input grandi su pagina voti (mobile-optimized)
- [x] Colori coerenti (blue primary)
- [x] Icone Lucide React
- [x] State badge (success, warning, danger)
- [x] Colori liste da backend
- [x] Loading spinners
- [x] Empty states
- [x] Hover effects
- [x] Smooth transitions
- [x] Clear error messages
- [x] Success notifications

## API Integration
- [x] POST /auth/login
- [x] GET /auth/me
- [x] GET /sezioni
- [x] POST /sezioni
- [x] PUT /sezioni/{id}
- [x] DELETE /sezioni/{id}
- [x] GET /liste
- [x] POST /liste
- [x] PUT /liste/{id}
- [x] DELETE /liste/{id}
- [x] GET /sindaci
- [x] POST /sindaci
- [x] PUT /sindaci/{id}
- [x] DELETE /sindaci/{id}
- [x] GET /consiglieri
- [x] GET /consiglieri?listaId={id}
- [x] POST /consiglieri
- [x] PUT /consiglieri/{id}
- [x] DELETE /consiglieri/{id}
- [x] GET /voti/sezione/{sezioneId}
- [x] POST /voti/sezione
- [x] GET /dashboard/riepilogo
- [x] GET /dashboard/sindaci
- [x] GET /dashboard/liste
- [x] GET /dashboard/sezioni
- [x] GET /dashboard/consiglieri
- [x] GET /utenti
- [x] POST /utenti
- [x] PUT /utenti/{id}
- [x] DELETE /utenti/{id}

## Profili & Autorizzazioni
- [x] ADMIN - Accesso totale a tutte le pagine
- [x] GESTORE_VOTI - Accesso a /voti
- [x] GESTORE_CANDIDATI - Accesso a /candidati/*
- [x] GESTORE_LISTE - Accesso a /liste
- [x] Tutti vedono /dashboard
- [x] Menu dinamico in base ai profili
- [x] hasProfile() e hasAnyProfile() in AuthContext

## Documentazione
- [x] README.md con setup e istruzioni
- [x] STRUTTURA.md con architettura
- [x] CHECKLIST.md (questo file)
- [x] Commenti nel codice dove necessario

## Stato Finale
Tutto completo! Frontend React 18 + Vite pronto per lo sviluppo e il deployment.

### Per avviare:
```bash
cd frontend
npm install
npm run dev
```

### Per buildare:
```bash
npm run build
```

Backend deve essere in esecuzione su http://localhost:8080/api
