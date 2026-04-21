# Quick Start - Frontend Comunali

## 30 Secondi per Iniziare

```bash
cd frontend
npm install
npm run dev
```

Apri http://localhost:5173

---

## Backend Requirements

Il backend deve essere in esecuzione su http://localhost:8080/api

Vite farà il proxy automaticamente delle richieste `/api`.

---

## Login Demo

Usa le credenziali dal backend per accedere.

---

## File Principali

- `/src/pages/` - 8 pagine completamente funzionanti
- `/src/api/` - 8 moduli API pronti
- `/src/components/` - 7 componenti riutilizzabili
- `/src/context/AuthContext.jsx` - Autenticazione globale

---

## Workflow Sviluppo

1. **Frontend aggiornamenti** - Modifica file in `/src`
2. **API calls** - Modifica file in `/src/api`
3. **Componenti** - Aggiungi/modifica in `/src/components`
4. **Pagine** - Aggiungi/modifica in `/src/pages`

Vite fa auto-reload su salvataggio.

---

## Comandi Principali

```bash
# Sviluppo
npm run dev

# Build produzione
npm run build

# Preview build locale
npm run preview

# Lint (se ESLint configurato)
npm run lint
```

---

## Struttura Branch

Vedi `/src/App.jsx` per routing:
- `/login` - Pubblico
- `/dashboard` - Protetto
- `/voti` - Solo GESTORE_VOTI
- `/sezioni` - Solo ADMIN
- `/liste` - Solo ADMIN, GESTORE_LISTE
- `/candidati/*` - Solo ADMIN, GESTORE_CANDIDATI
- `/utenti` - Solo ADMIN

---

## JWT Token

Token salvato in localStorage con chiave: `comunali_token`

Axios aggiunge automaticamente header: `Authorization: Bearer {token}`

Logout automatico su 401.

---

## Mobile Testing

```bash
# Vite di default è accessibile da IP locale
# Trova l'IP con: ipconfig (Windows) o ifconfig (Mac/Linux)

# Poi visita: http://{TUO_IP}:5173
```

Tutte le pagine sono responsive (mobile/tablet/desktop).

---

## Troubleshooting

| Problema | Soluzione |
|----------|-----------|
| "Cannot find module" | `rm node_modules && npm install` |
| Port 5173 occupato | `npm run dev -- --port 5174` |
| CORS error | Verifica proxy Vite in `vite.config.js` |
| Token non inviato | Controlla localStorage chiave `comunali_token` |
| Componente non carica | Check React DevTools per error boundary |

---

## Documentazione Completa

- **README.md** - Setup e overview
- **STRUTTURA.md** - Architettura dettagliata
- **CHECKLIST.md** - Feature checklist
- **NOTE_IMPLEMENTAZIONE.md** - Dettagli tecnici
- **DELIVERABLES.md** - Riepilogo consegna

---

**Pronto per iniziare! npm install && npm run dev**
