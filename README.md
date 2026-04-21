# 🗳️ Comunali - App Scrutinio Elezioni Comunali

Web app per il conteggio e la visualizzazione in tempo reale dei voti durante le elezioni comunali italiane.

## Stack

| Livello     | Tecnologia                              |
|-------------|----------------------------------------|
| Backend     | Quarkus 3 + Java 17 + Panache + JWT    |
| Frontend    | React 18 + Vite + TailwindCSS + Recharts |
| Database    | PostgreSQL 15                          |
| Auth        | JWT (RSA 2048-bit, 8h)                 |
| Deploy BE   | Render.com (free tier)                 |
| Deploy FE   | Vercel (free tier)                     |
| DB Cloud    | Neon.tech (free PostgreSQL)            |

## Avvio Rapido (sviluppo locale)

### Prerequisiti
- Java 17+, Maven 3.9+
- Node.js 20+, npm
- Docker & Docker Compose

### 1. Database locale
```bash
docker-compose up postgres -d
```

### 2. Backend
```bash
cd backend
mvn quarkus:dev
# → http://localhost:8080
# → Swagger UI: http://localhost:8080/q/swagger-ui
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Credenziali default
| Username | Password | Profili |
|----------|----------|---------|
| admin    | admin123 | ADMIN (tutti i permessi) |
| scrutatore1 | voti123 | GESTORE_VOTI |

## Struttura Progetto

```
comunali/
├── backend/                  # Quarkus backend
│   ├── src/main/java/it/comunali/
│   │   ├── auth/             # JWT auth
│   │   ├── model/            # Entity JPA Panache
│   │   ├── resource/         # REST endpoints
│   │   └── dto/              # Data transfer objects
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── import.sql        # Dati iniziali
│   │   ├── privateKey.pem    # Chiave JWT privata
│   │   └── publicKey.pem     # Chiave JWT pubblica
│   └── pom.xml
├── frontend/                 # React + Vite
│   └── src/
│       ├── api/              # Axios client + chiamate API
│       ├── components/       # Componenti riutilizzabili
│       ├── context/          # AuthContext (JWT)
│       └── pages/            # Pagine applicazione
├── .github/workflows/        # CI/CD GitHub Actions
├── docker-compose.yml        # Dev environment
└── nginx.conf                # Config Nginx per prod
```

## Profili Utente

| Profilo             | Permessi                                    |
|---------------------|---------------------------------------------|
| `ADMIN`             | Tutto (gestisce sezioni, liste, candidati, utenti, voti) |
| `GESTORE_CANDIDATI` | Gestisce candidati sindaco e consiglieri     |
| `GESTORE_LISTE`     | Gestisce le liste elettorali                |
| `GESTORE_VOTI`      | Inserisce voti per sezione                  |
| *tutti*             | Visualizzano le dashboard                   |

## API Principali

```
POST   /api/auth/login           Login → token JWT
GET    /api/dashboard/riepilogo  Totali aggregati
GET    /api/dashboard/sindaci    Voti per candidato sindaco
GET    /api/dashboard/liste      Voti per lista elettorale
GET    /api/dashboard/consiglieri Preferenze nominali
POST   /api/voti/sezione         Inserisce voti di una sezione
GET    /api/voti/stato           Stato scrutinio per sezione
```

Documentazione completa: `http://localhost:8080/q/swagger-ui`

## Deploy su Hosting Gratuito

### Database: Neon.tech
1. Registrati su [neon.tech](https://neon.tech)
2. Crea un progetto PostgreSQL
3. Copia la connection string

### Backend: Render.com
1. Registrati su [render.com](https://render.com)
2. Crea un **Web Service** dal repo GitHub
3. Configura:
   - **Build Command**: `cd backend && mvn -B package -DskipTests -Dquarkus.package.type=uber-jar`
   - **Start Command**: `java -jar backend/target/*-runner.jar`
   - **Environment Variables**:
     - `DB_URL` = connection string Neon
     - `DB_USER` = username Neon
     - `DB_PASSWORD` = password Neon

### Frontend: Vercel
1. Registrati su [vercel.com](https://vercel.com)
2. Importa il repo GitHub
3. Configura:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variable**: `VITE_API_BASE_URL` = URL del backend Render

### GitHub Actions (CI/CD automatico)
Aggiungi questi secrets nel repo GitHub (`Settings → Secrets`):
- `RENDER_DEPLOY_HOOK_URL` - deploy hook da Render
- `VERCEL_TOKEN` - API token Vercel
- `VERCEL_ORG_ID` - ID organizzazione Vercel
- `VERCEL_PROJECT_ID` - ID progetto Vercel

## Modello Dati

```
Sezione (1..N)
  └── VotoSezione (1 per lista per sezione)
       └── ListaElettorale
            ├── CandidatoSindaco (via ManyToMany - coalizioni)
            └── CandidatoConsigliere (1..N per lista)
                 └── PreferenzaConsigliere (1 per sezione per consigliere)
```

## Come funziona durante lo scrutinio

1. Il **rappresentante di lista** si collega dall'app (smartphone/tablet)
2. Seleziona la sezione che sta scrutinando
3. Inserisce: votanti totali, schede bianche, schede nulle
4. Per ogni lista: voti lista, voti sindaco (disgiunto)
5. Per ogni consigliere: preferenze nominali
6. Salva → la sezione è marcata come "scrutinata"
7. La **dashboard** si aggiorna automaticamente ogni 30 secondi per tutti

## Licenza

MIT - Dominio pubblico, uso libero
