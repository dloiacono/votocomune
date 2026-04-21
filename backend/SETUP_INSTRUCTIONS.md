# Setup Istruzioni - Comunali Backend Quarkus 3

Questa guida ti aiuterà a configurare e avviare il backend dell'applicazione di conteggio voti per elezioni comunali.

## Prerequisiti

### Obbligatori
- **Java 17 o superiore** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.8.1+** - [Download](https://maven.apache.org/download.cgi)
- **Git** - [Download](https://git-scm.com/)

### Opzionali (ma consigliati)
- **Docker & Docker Compose** - Per sviluppo con database containerizzato
- **PostgreSQL CLI** - Per connessioni dirette al database
- **curl o Postman** - Per testare gli endpoint API

## Verifica Prerequisiti

```bash
# Verifica Java
java -version
# Output desiderato: Java 17 o superiore

# Verifica Maven
mvn -version
# Output desiderato: Maven 3.8.1 o superiore

# Verifica Git
git --version
```

---

## Setup Rapido (5 minuti)

### Opzione 1: Con Docker Compose (Consigliato)

```bash
# 1. Clona il progetto
cd /sessions/dreamy-eloquent-wright/mnt/Comunali/backend

# 2. Avvia PostgreSQL e backend con Docker Compose
docker-compose up -d

# 3. Aspetta che il backend si avvi (~10 secondi)
sleep 10

# 4. Test di connessione
curl -X GET http://localhost:8080/api/sezioni \
  -H "Content-Type: application/json"

# Se ottieni un errore 401, è normale (autenticazione richiesta)
```

**Per fermare tutto:**
```bash
docker-compose down
```

### Opzione 2: Setup Manuale

#### Passo 1: Installa PostgreSQL

**Su macOS (con Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Su Linux (Debian/Ubuntu):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Su Windows:**
Scarica da [postgresql.org](https://www.postgresql.org/download/windows/)

#### Passo 2: Crea il Database

```bash
# Connettiti a PostgreSQL (default user: postgres)
psql -U postgres

# Crea database e utente
CREATE DATABASE comunali;
CREATE USER comunali WITH PASSWORD 'comunali';
ALTER ROLE comunali WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE comunali TO comunali;
\q
```

#### Passo 3: Compila il Progetto

```bash
cd /sessions/dreamy-eloquent-wright/mnt/Comunali/backend

# Installa dipendenze e compila
mvn clean install

# Output atteso: "BUILD SUCCESS"
```

#### Passo 4: Avvia in Development Mode

```bash
mvn quarkus:dev
```

**Output atteso:**
```
__  ____  __  _____   ___  __ ____  ______
 --/ __ \/ / / / _ | / _ \/ // __ \/ __/ /
 -/ /_/ / /_/ / __ |/ ____/ // /_/ / /_/ /
--\___\_\____/_/ |_/_/   /_/ \____/\__/_/

2024-04-21 12:00:00,000 INFO  [io.quarkus] (main) Quarkus ... started in 1.234s
2024-04-21 12:00:00,100 INFO  [io.quarkus] (main) Profile prod activated.
2024-04-21 12:00:00,200 INFO  [io.quarkus] (main) Installed features: [...]
```

#### Passo 5: Test Iniziale

```bash
# In un altro terminale, testa un endpoint
curl -X GET http://localhost:8080/q/swagger-ui
```

Se vedi l'interfaccia Swagger UI, il server è attivo!

---

## Configurazione Manuale del Database

Se preferisci configurare il database manualmente:

### Edita `application.properties`

```bash
nano src/main/resources/application.properties
```

Modifica:
```properties
quarkus.datasource.username=your_user
quarkus.datasource.password=your_password
quarkus.datasource.jdbc.url=jdbc:postgresql://your_host:5432/comunali
```

### Oppure usa Variabili d'Ambiente

```bash
export DB_USER=comunali
export DB_PASSWORD=comunali
export DB_URL=jdbc:postgresql://localhost:5432/comunali

mvn quarkus:dev
```

---

## Test Login

Una volta avviato il server:

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Risposta attesa:**
```json
{
  "token": "eyJhbGc...",
  "utente": {
    "id": 1,
    "username": "admin",
    "nome": "Amministratore",
    "cognome": "Sistema",
    "profili": ["ADMIN", "GESTORE_CANDIDATI", "GESTORE_LISTE", "GESTORE_VOTI"]
  }
}
```

---

## Accedi a Swagger UI

```
http://localhost:8080/q/swagger-ui
```

Swagger UI permette di:
- Visualizzare tutte le API
- Testare endpoint direttamente dal browser
- Leggere la documentazione

---

## Profili di Configurazione

Il progetto supporta diversi profili:

### Development Profile (Default)
```bash
mvn quarkus:dev
# oppure
mvn quarkus:dev -Dquarkus.profile=dev
```

Caratteristiche:
- Logging dettagliato (DEBUG level)
- SQL logging abilitato
- CORS permissivo (*.)
- Hot reload del codice

### Production Profile
```bash
mvn quarkus:dev -Dquarkus.profile=prod
# Per build:
mvn clean package -Dquarkus.package.type=uber-jar -Dquarkus.profile=prod
```

Caratteristiche:
- Logging INFO level
- Nessun SQL logging
- CORS specifico per dominio
- Ottimizzazioni di performance
- Security headers

---

## Build per Production

### Build Standard (JAR eseguibile)

```bash
mvn clean package -Dquarkus.package.type=uber-jar
```

Il JAR è in `target/comunali-backend-1.0.0-runner.jar`

```bash
# Esegui il JAR
java -jar target/comunali-backend-1.0.0-runner.jar
```

### Build Nativo (Richiede GraalVM)

Se hai GraalVM installato:

```bash
mvn clean package -Pnative
```

Risultato: eseguibile nativo ultrasonoro in `target/comunali-backend-1.0.0-runner`

```bash
# Esegui il nativo
./target/comunali-backend-1.0.0-runner
```

---

## Deployment con Docker

### Build Immagine

```bash
docker build -t comunali-backend:1.0.0 .
```

### Esegui Container

```bash
docker run -p 8080:8080 \
  -e DB_USER=comunali \
  -e DB_PASSWORD=comunali \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/comunali \
  comunali-backend:1.0.0
```

### Con Docker Compose

```bash
docker-compose up -d
```

---

## Troubleshooting

### Errore: "Unable to acquire a connection"

**Causa:** Impossibile connettere al database

**Soluzione:**
1. Verifica che PostgreSQL sia in esecuzione
2. Verifica credenziali in `application.properties`
3. Verifica che il database `comunali` esista

```bash
# Controlla PostgreSQL
psql -U postgres -d comunali

# Se errore, ricrea il database
psql -U postgres
CREATE DATABASE comunali;
\q
```

### Errore: "Port 8080 already in use"

**Causa:** Porta 8080 già in uso

**Soluzione:**
```bash
# Opzione 1: Cambia porta
mvn quarkus:dev -Dquarkus.http.port=8081

# Opzione 2: Uccidi processo sulla porta
# Linux/Mac:
lsof -ti:8080 | xargs kill -9
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Errore: "Impossible to extract result from password"

**Causa:** Hash della password non valido nel database

**Soluzione:**
1. Elimina e ricrea il database
2. O genera un nuovo hash BCrypt:

```bash
python3 << 'EOF'
import bcrypt
password = b'admin123'
print(bcrypt.hashpw(password, bcrypt.gensalt()).decode())
EOF
```

Poi aggiorna `import.sql` con il nuovo hash.

### Errore: "Quarkus cannot find privateKey.pem"

**Causa:** Chiavi RSA mancanti

**Soluzione:**
```bash
cd src/main/resources

# Genera chiavi RSA
openssl genrsa -out privateKey.pem 2048
openssl rsa -in privateKey.pem -pubout -out publicKey.pem

# Verifica
ls -la *.pem
```

### Swagger UI non carica gli endpoint

**Causa:** Endpoint non documentati

**Soluzione:**
Aggiungi @Tag sui Resource:

```java
@Tag(name = "Sezioni", description = "Gestione sezioni di voto")
@Path("/api/sezioni")
public class SezioneResource { ... }
```

---

## IDE Configuration

### IntelliJ IDEA

1. Apri progetto: File → Open → seleziona `pom.xml`
2. Maven auto-importerà il progetto
3. Installa plugin Quarkus (opzionale): Settings → Plugins → "Quarkus Tools"
4. Per avviare: Run → Run...  → Select "quarkus:dev"

### Visual Studio Code

1. Installa estensione "Extension Pack for Java"
2. Apri cartella del progetto
3. VS Code configurerà Maven automaticamente
4. Apri terminale e esegui: `mvn quarkus:dev`

### Eclipse

1. File → Import → Existing Maven Projects
2. Seleziona cartella del backend
3. Click Finish
4. Run as → Maven build → Goals: "quarkus:dev"

---

## Dati di Test

All'avvio, il database viene popola automaticamente con:

| Risorsa | Quantità | Dettagli |
|---------|----------|----------|
| Sezioni | 20 | Numerate 1-20 con nomi di edifici pubblici |
| Liste | 3 | Lista A (rosa), Lista B (giallo), Lista C (rossa) |
| Sindaci | 2 | Marco Rossi (Liste A+B), Anna Bianchi (Lista C) |
| Consiglieri | 15 | 5 per lista |
| Utenti | 1 | admin (password: admin123) |

### Credenziali Accesso

```
Username: admin
Password: admin123
```

---

## Prossimi Passi

1. **Leggi la documentazione API:** `API_EXAMPLES.md`
2. **Consulta il README:** `README.md`
3. **Accedi a Swagger UI:** http://localhost:8080/q/swagger-ui
4. **Crea nuovi utenti:** POST /api/utenti (role ADMIN)
5. **Importa dati:** Usa gli endpoint POST per inserire dati
6. **Testa il frontend:** Una volta disponibile

---

## Comandi Utili

```bash
# Development
mvn quarkus:dev

# Test
mvn test

# Build per produzione
mvn clean package -Dquarkus.package.type=uber-jar

# Build nativo
mvn clean package -Pnative

# Pulisci build
mvn clean

# Reinstalla dipendenze
mvn clean install -U

# Format codice
mvn spotless:apply

# Controlla dipendenze vulnerabili
mvn dependency-check:check
```

---

## Supporto e Contatti

Per problemi:
1. Controlla [FAQ](#faq) sotto
2. Consulta logs: `target/quarkus.log`
3. Apri issue nel repository

---

## FAQ

**D: Come cambio la porta del server?**
R: Aggiungi `-Dquarkus.http.port=PORT` o modifica `application.properties`

**D: Come accedo al database direttamente?**
R: `psql -U comunali -d comunali` (password: comunali)

**D: Come resetto i dati?**
R: 
```bash
psql -U postgres
DROP DATABASE comunali;
CREATE DATABASE comunali;
\q
```
Poi riavvia il server.

**D: Come genero un nuovo token JWT?**
R: POST /api/auth/login con credenziali valide

**D: Che profilo/ruolo serve per fare X?**
R: Consulta la sezione "Profili Utente" in README.md

**D: Come configuro CORS per la mia app frontend?**
R: Modifica `application.properties`:
```properties
quarkus.http.cors.origins=https://myapp.com
```

**D: Come abilito il logging SQL?**
R: Aggiungi in `application.properties`:
```properties
quarkus.hibernate-orm.log.sql=true
```

