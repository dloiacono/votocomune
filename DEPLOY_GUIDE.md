# Guida al Deploy — Comunali App

Stack: **Quarkus 3 + Java 17** (backend) · **React 18 + Vite** (frontend) · **PostgreSQL 15** (DB)
Hosting gratuito: **Neon.tech** (DB) · **Render.com** (backend) · **Vercel** (frontend)

---

## Prerequisiti

- Account [GitHub](https://github.com)
- Account [Neon.tech](https://neon.tech)
- Account [Render.com](https://render.com)
- Account [Vercel](https://vercel.com)
- `git` installato in locale

---

## STEP 1 — Creare il repo su GitHub e fare il push

> Il primo commit è già stato eseguito in locale. Eseguire questi comandi nella cartella del progetto.

```bash
# 1. Crea il repo su GitHub (senza README, senza .gitignore)
#    → https://github.com/new  → nome: comunali  → visibilità: private

# 2. Collega il remote e fai push
git remote add origin https://github.com/TUO_USERNAME/comunali.git
git branch -M main
git push -u origin main
```

Sostituire `TUO_USERNAME` con il proprio username GitHub.

---

## STEP 2 — Database: Neon.tech (PostgreSQL gratuito)

1. Accedi su [neon.tech](https://neon.tech) → **New Project**
2. Nome progetto: `comunali` · Regione: `eu-central-1` (Francoforte)
3. Copia la **Connection string** nel formato:
   ```
   postgresql://USER:PASSWORD@HOST/comunali?sslmode=require
   ```
4. Tieni questo valore a portata di mano — servirà nei passi successivi.

### Schema iniziale

Quarkus esegue automaticamente `backend/src/main/resources/import.sql` al primo avvio (profilo `prod` con `quarkus.hibernate-orm.database.generation=drop-and-create`).
Se vuoi `update` invece di `drop-and-create` (dopo la prima run), modifica `application-prod.properties`:
```properties
quarkus.hibernate-orm.database.generation=update
```

---

## STEP 3 — Generare le chiavi JWT RSA per la produzione

Le chiavi nel repository di sviluppo **non devono essere usate in produzione**. Genera una nuova coppia:

```bash
# Genera chiave privata RSA 2048-bit
openssl genrsa -out privateKey.pem 2048

# Estrai la chiave pubblica
openssl rsa -in privateKey.pem -pubout -out publicKey.pem

# Visualizza i contenuti (li copierai come env vars su Render)
cat privateKey.pem
cat publicKey.pem
```

---

## STEP 4 — Backend: Render.com

### 4a — Crea il Web Service

1. Accedi su [render.com](https://render.com) → **New → Web Service**
2. Connetti il tuo repo GitHub `comunali`
3. Configura:
   | Campo | Valore |
   |---|---|
   | **Name** | `comunali-backend` |
   | **Branch** | `main` |
   | **Root Directory** | *(lascia vuoto)* |
   | **Build Command** | `cd backend && mvn -B package -DskipTests -Dquarkus.package.type=uber-jar` |
   | **Start Command** | `java -jar backend/target/comunali-1.0.0-SNAPSHOT-runner.jar` |
   | **Instance Type** | Free |

### 4b — Variabili d'ambiente su Render

In **Environment → Add Environment Variable**, aggiungere:

| Chiave | Valore |
|---|---|
| `QUARKUS_PROFILE` | `prod` |
| `DB_URL` | `jdbc:postgresql://HOST/comunali?sslmode=require` |
| `DB_USER` | username Neon |
| `DB_PASSWORD` | password Neon |
| `MP_JWT_VERIFY_PRIVATEKEY_LOCATION` | *(non serve — passiamo inline)* |
| `SMALLRYE_JWT_SIGN_KEY` | contenuto completo di `privateKey.pem` (incluse le righe `-----BEGIN...-----`) |
| `MP_JWT_VERIFY_PUBLICKEY` | contenuto completo di `publicKey.pem` (incluse le righe `-----BEGIN...-----`) |

> **Nota**: Render free tier ha cold start ~30s dopo 15 minuti di inattività. Normale per demo/presentazioni.

### 4c — Ottieni il Deploy Hook

In **Settings → Deploy Hooks** → crea un hook e copia l'URL.
Lo userai come secret GitHub `RENDER_DEPLOY_HOOK_URL`.

### 4d — Annota l'URL del backend

Render assegnerà un URL del tipo:
```
https://comunali-backend.onrender.com
```
Servirà per configurare il frontend.

---

## STEP 5 — Frontend: Vercel

### 5a — Importa il progetto

1. Accedi su [vercel.com](https://vercel.com) → **Add New → Project**
2. Importa il repo GitHub `comunali`
3. Configura:
   | Campo | Valore |
   |---|---|
   | **Framework Preset** | Vite |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

### 5b — Variabile d'ambiente su Vercel

In **Settings → Environment Variables**:

| Chiave | Valore |
|---|---|
| `VITE_API_BASE_URL` | `https://comunali-backend.onrender.com` |

### 5c — Ottieni i valori per GitHub Actions

Da **Settings → General** copia:
- **Project ID** → sarà `VERCEL_PROJECT_ID`
- **Team/Org ID** → sarà `VERCEL_ORG_ID`

Da **Account Settings → Tokens** → crea un token → sarà `VERCEL_TOKEN`.

---

## STEP 6 — GitHub Actions Secrets

Nel repo GitHub → **Settings → Secrets and variables → Actions → New repository secret**, aggiungere:

| Secret | Dove si trova |
|---|---|
| `RENDER_DEPLOY_HOOK_URL` | Render → Settings → Deploy Hooks |
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel → Settings → General |
| `VERCEL_PROJECT_ID` | Vercel → Settings → General |
| `VITE_API_BASE_URL` | URL del backend Render (es. `https://comunali-backend.onrender.com`) |

Dopo questa configurazione, ogni `git push` su `main` trigghera automaticamente build e deploy di backend e frontend.

---

## STEP 7 — Primo deploy

```bash
# Nella cartella del progetto (dopo aver impostato tutti i secrets)
git push origin main
```

Osserva il workflow su **GitHub → Actions**. Il deploy completo richiede ~5-8 minuti.

---

## Verifica finale

| Componente | URL di test |
|---|---|
| Backend health | `https://comunali-backend.onrender.com/q/health` |
| Swagger UI | `https://comunali-backend.onrender.com/q/swagger-ui` |
| Frontend | `https://comunali-XXXX.vercel.app` |
| Login | username `admin` / password `admin123` |

---

## Configurazione CORS (se necessario)

Se il frontend non riesce a raggiungere il backend, verificare in `application-prod.properties`:

```properties
quarkus.http.cors=true
quarkus.http.cors.origins=https://comunali-XXXX.vercel.app
quarkus.http.cors.methods=GET,POST,PUT,DELETE,OPTIONS
quarkus.http.cors.headers=accept,authorization,content-type
```

Sostituire con l'URL effettivo del frontend Vercel.

---

## Troubleshooting rapido

**Build Quarkus fallisce su Render**
→ Verificare che il Build Command includa `cd backend &&` all'inizio.

**Frontend non vede il backend**
→ Controllare che `VITE_API_BASE_URL` non abbia slash finale e che il CORS sia configurato.

**Cold start lento (Render free)**
→ Normale. Considerare un ping periodico via cron esterno o upgrade a paid tier.

**Chiavi JWT non valide**
→ Le chiavi nei file `.pem` devono essere passate come stringa completa nelle env vars, incluse le righe `-----BEGIN...-----` e `-----END...-----`.
