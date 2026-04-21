# Note di Implementazione - Frontend Comunali

## Scelte Architetturali

### 1. AuthContext vs Redux
Scelto AuthContext perché l'app non ha uno state globale complesso. AuthContext è sufficiente per:
- Memorizzare user e token
- Gestire login/logout
- Fornire helper per i profili (hasProfile, hasAnyProfile)

### 2. Nessuna libreria di state management
State locale in ogni pagina con useState è sufficiente per:
- Form data
- Loading states
- Error messages
- Data fetched

Riduce complessità e bundle size.

### 3. API client Axios
Axios è leggero e perfetto per:
- Interceptor JWT automatico
- Gestione errori 401
- Request/response transformation

### 4. Recharts per i grafici
Recharts è:
- Responsivo
- Leggero
- Facile da integrare con React
- Perfetto per i grafici semplici richiesti

### 5. TailwindCSS per styling
100% Tailwind per:
- Consistenza visiva
- Mobile-first design
- Nessun CSS custom file
- Facile da mantenere

### 6. Layout sidebar + main
Scelta di sidebar fisso su desktop e hamburger su mobile per:
- UX coerente
- Navigazione sempre disponibile
- Layout responsivo

## Dettagli Implementativi

### Autenticazione
- Token JWT salvato in localStorage (non cookie) per CORS-friendly
- Axios interceptor aggiunge header automaticamente
- 401 response reindirizza a login
- AuthContext fornisce isAuthenticated flag per PrivateRoute

### Componenti Modali
Modale generica `Modal.jsx` usata per CRUD su:
- Sezioni
- Liste (con color picker integrato)
- Sindaci (con multiselect liste)
- Consiglieri (con select lista e ordine)
- Utenti (con checkbox profili)

Pattern: `setModalOpen(true)`, `setEditingId(id)` per distinguere create/update.

### Pagina VotiEntry (Critica)
Design ottimizzato per scrutinio stressante:
- Selettore sezione prominente
- Campi grandi (py-3, px-4, text-lg)
- Input numeri per tastiera numerica mobile
- Colori delle liste inline nel form
- Sezione dati generali separata
- Sezione liste con card colorate
- Sezione consiglieri raggruppata per lista
- Bottone salva grande e ben visibile

### Dashboard
Auto-refresh ogni 30 secondi con useEffect:
```javascript
useEffect(() => {
  fetchData()
  const interval = setInterval(fetchData, 30000)
  return () => clearInterval(interval)
}, [fetchData])
```

Grafici con Recharts:
- Bar chart orizzontale per sindaci
- Pie chart per liste
- Bar chart verticale per consiglieri

### CRUD Pattern
Tutte le pagine CRUD seguono lo stesso pattern:
1. Carica dati con useEffect
2. Mostra tabella/card
3. Pulsante "Nuovo" apre modal
4. Click edit popola form e apre modal
5. Form submit POST (create) o PUT (update)
6. Reload dati
7. Chiudi modal
8. Click delete mostra ConfirmDialog
9. Conferma DELETE e reload

### Badge Component
Badge generico con supporto per:
- Variant predefiniti (default, success, warning, error, admin, voti, candidati, liste)
- Colore custom (per liste) con style inline

### Error Handling
- Try/catch su tutti gli async/await
- Messaggi d'errore leggibili all'utente
- Loading states per feedback visivo
- Success notifications
- Empty states quando dati vuoti

### Mobile Design
- Sidebar -> Hamburger menu su mobile
- Tabelle con scroll orizzontale
- Form full width su mobile
- Input grandi per facilità di tap
- Flexbox per responsive grid
- Breakpoint md per tablet, lg per desktop

## Performance

### Bundle Size
- React 18: ~42kb (gzipped)
- Recharts: ~95kb (gzipped)
- TailwindCSS: utility classes purged in build
- Lucide React: tree-shaking automatico

### Lazy Loading
Non implementato (app è piccola) ma disponibile con React.lazy se necessario.

### Memoization
useCallback usato su:
- fetchData in Dashboard (dependencies: fetchData)
- handleSezioneChange in VotiEntry (dependencies: sezioni)

useMemo potrebbe essere aggiunto per dati grafici se performance issue.

### Re-renders
Minimal re-renders grazie a:
- State locale per form data
- Prop drilling evitato con Context
- Funzioni definite fuori componenti quando possibile

## Sicurezza

### JWT Security
- Token in localStorage (CORS-friendly)
- Header Authorization automatico
- 401 logout automatico
- Token non presente in URL parameters

### XSS Prevention
- React escapa automaticamente il contenuto
- Nessun dangerouslySetInnerHTML
- Nessun inline script

### CSRF Prevention
- Same-origin: backend CORS dovrebbe limitare a localhost in dev
- In produzione: same-domain o SameSite cookies

## Testing Considerations

Per aggiungere test:
1. Vitest per unit tests
2. React Testing Library per component tests
3. Cypress/Playwright per e2e

Struttura per component test:
```javascript
import { render, screen } from '@testing-library/react'
import Badge from './Badge'

test('renders badge with text', () => {
  render(<Badge>Test</Badge>)
  expect(screen.getByText('Test')).toBeInTheDocument()
})
```

## Deployment

### Build Production
```bash
npm run build
```

Output: `dist/` folder pronto per servire.

### Environment
In produzione, il proxy Vite non è disponibile. Soluzioni:
1. **Same domain**: Servire frontend e backend dallo stesso dominio
2. **CORS**: Configurare CORS nel backend per il dominio frontend
3. **Reverse proxy**: Usare nginx per fare proxy `/api` al backend

### Docker (opzionale)
```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package.json .
RUN npm install
COPY src . 
RUN npm run build

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## Next Steps Possibili

1. **Testing**: Aggiungere Vitest + React Testing Library
2. **Storybook**: Per documentazione componenti
3. **Analytics**: Trackare user actions
4. **PWA**: Service workers per offline
5. **i18n**: Internazionalizzazione (multi-lingua)
6. **Logging**: Client-side error logging
7. **State Persistence**: Salvare form draft in localStorage

## Troubleshooting

### "Port 5173 già in uso"
```bash
npm run dev -- --port 5174
```

### "Cannot find module"
```bash
rm node_modules
npm install
```

### "CORS error in development"
Verificare che proxy Vite sia configurato in vite.config.js

### "Token not sent in request"
Verificare che localStorage abbia chiave `comunali_token` e che axios interceptor sia attivo.

## Contatti e Supporto

Per domande sul frontend, riferirsi a:
- Documentazione React: https://react.dev
- Documentazione Vite: https://vitejs.dev
- TailwindCSS: https://tailwindcss.com
- Recharts: https://recharts.org
