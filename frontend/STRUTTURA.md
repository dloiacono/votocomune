# Struttura Frontend Comunali

## Architettura

```
frontend/
├── package.json              # Dipendenze e scripts
├── vite.config.js            # Configurazione Vite + proxy API
├── tailwind.config.js        # Configurazione TailwindCSS
├── postcss.config.js         # Configurazione PostCSS
├── index.html                # HTML entry point
├── src/
│   ├── main.jsx              # ReactDOM.createRoot
│   ├── App.jsx               # Router principale
│   ├── index.css             # Stili globali Tailwind
│   ├── api/                  # Client API
│   │   ├── client.js         # Axios instance con JWT interceptor
│   │   ├── auth.js           # Login, getCurrentUser
│   │   ├── sezioni.js        # CRUD sezioni
│   │   ├── liste.js          # CRUD liste
│   │   ├── candidati.js      # CRUD sindaci e consiglieri
│   │   ├── voti.js           # API voti per sezione
│   │   ├── dashboard.js      # API riepilogo e grafici
│   │   └── utenti.js         # CRUD utenti (ADMIN)
│   ├── context/
│   │   └── AuthContext.jsx   # Context per autenticazione
│   ├── components/           # Componenti riutilizzabili
│   │   ├── PrivateRoute.jsx  # Route con autenticazione
│   │   ├── Layout.jsx        # Layout principale con sidebar
│   │   ├── Navbar.jsx        # Header con logout
│   │   ├── Modal.jsx         # Modale generica
│   │   ├── Badge.jsx         # Badge per stati/profili
│   │   ├── KpiCard.jsx       # Card per KPI
│   │   └── ConfirmDialog.jsx # Dialogo di conferma
│   └── pages/                # Pagine dell'app
│       ├── Login.jsx         # Autenticazione
│       ├── Dashboard.jsx     # Dashboard con KPI e grafici
│       ├── VotiEntry.jsx     # Inserimento voti (mobile-optimized)
│       ├── Sezioni.jsx       # CRUD sezioni
│       ├── Liste.jsx         # CRUD liste
│       ├── CandidatiSindaci.jsx      # CRUD sindaci
│       ├── CandidatiConsiglieri.jsx  # CRUD consiglieri
│       └── Utenti.jsx        # CRUD utenti
└── .gitignore                # Git ignore
```

## Flussi Principali

### Autenticazione
1. User digita username/password su `/login`
2. Client POST `/api/auth/login` con credenziali
3. Backend restituisce token JWT + dati utente
4. Token salvato in localStorage(`comunali_token`)
5. User reindirizzato a `/dashboard`
6. AuthContext fornisce `user`, `token`, `hasProfile()` a tutta l'app

### Interceptor JWT
- Axios automaticamente aggiunge `Authorization: Bearer {token}` a tutte le richieste
- Se backend restituisce 401, token viene rimosso e user reindirizzato a login

### Dashboard
1. Carica KPI (sezioni, votanti, schede bianche/nulle)
2. Carica grafici (sindaci, liste, consiglieri)
3. Mostra stato scrutinio sezioni
4. Auto-refresh ogni 30 secondi

### Inserimento Voti
1. User seleziona sezione da dropdown
2. Form carica i voti esistenti (se scrutinata)
3. Form si popola con liste e consiglieri
4. User inserisce dati
5. POST `/api/voti/sezione` per salvare

## Design Patterns

### Modal
Componente riutilizzabile per tutte le operazioni CRUD.
```jsx
<Modal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  title="Titolo"
  footer={<button>Salva</button>}
>
  {/* contenuto */}
</Modal>
```

### ConfirmDialog
Per conferma eliminazioni.
```jsx
<ConfirmDialog
  isOpen={true}
  title="Elimina?"
  message="Sei sicuro?"
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
```

### API Calls Pattern
```jsx
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  const load = async () => {
    try {
      const result = await apiModule.getData()
      setData(result)
    } catch (err) {
      setError('Errore')
    } finally {
      setLoading(false)
    }
  }
  load()
}, [])
```

## Autorizzazioni

Basate sui profili dell'utente in AuthContext:
- **ADMIN**: Tutte le pagine visibili
- **GESTORE_VOTI**: Vede /voti e /dashboard
- **GESTORE_CANDIDATI**: Vede /candidati/* e /dashboard
- **GESTORE_LISTE**: Vede /liste e /dashboard

Le pagine non autorizzate non appaiono nel menu ma sono comunque protected da PrivateRoute.

## Styling

100% TailwindCSS. Nessun CSS custom file.
- Responsive design mobile-first
- Classi utility Tailwind
- Colori custom per liste (usando `style={{backgroundColor}}`)

## Stato dell'Applicazione

- **Global**: AuthContext per user, token, permessi
- **Local**: useState in ogni pagina per form data, loading, error

Nessuna libreria di state management globale (non necessaria per questa app).

## Convenzioni

- Nomi file: snake_case.js/jsx
- Nomi componenti: PascalCase
- Nomi funzioni: camelCase
- Colori liste da backend: hex color codes

## Mobile First

Tutti i form sono ottimizzati per mobile:
- Pagina VotiEntry: campi grandi (py-3, px-4, text-lg)
- Input numeri: type="number" per tastiera numerica
- Select: width completo su mobile
- Tabelle: scroll orizzontale su mobile
- Sidebar: hamburger menu su mobile

## Note Importanti

1. **Token JWT**: Salvato in localStorage, non in cookie (CORS-friendly)
2. **Proxy Dev**: Vite proxy `/api` a `http://localhost:8080`
3. **CORS Produzione**: Assicurati stesso dominio o CORS configurato
4. **Caricamento**: Loading spinner su tutte le pagine data-heavy
5. **Errori**: Mostra sempre messaggi di errore leggibili all'utente
