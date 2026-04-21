# Comunali Backend - Quarkus 3

Backend per l'applicazione di conteggio voti per elezioni comunali italiane, realizzato con **Quarkus 3**, **Hibernate ORM Panache**, **SmallRye JWT** e **PostgreSQL**.

## Requisiti

- Java 17 o superiore
- Maven 3.8.1+
- PostgreSQL 12+ (per il runtime)

## Stack Tecnico

- **Quarkus 3.8.2** - Framework Java ultrasonicamente veloce
- **Hibernate ORM with Panache** - Active Record pattern per persistenza
- **RESTEasy Reactive** - Implementazione JAX-RS reattiva
- **SmallRye JWT** - Autenticazione basata su token JWT
- **PostgreSQL** - Database relazionale
- **Jackson** - Serializzazione JSON

## Struttura del Progetto

```
backend/
├── pom.xml                              # Configurazione Maven
├── src/main/
│   ├── java/it/comunali/
│   │   ├── auth/
│   │   │   ├── AuthResource.java        # Endpoint login e autenticazione
│   │   │   ├── JwtUtils.java            # Utility per JWT
│   │   │   └── dto/
│   │   │       ├── LoginRequest.java
│   │   │       └── LoginResponse.java
│   │   ├── model/                       # Entity JPA/Panache
│   │   │   ├── Utente.java
│   │   │   ├── Sezione.java
│   │   │   ├── ListaElettorale.java
│   │   │   ├── CandidatoSindaco.java
│   │   │   ├── CandidatoConsigliere.java
│   │   │   ├── VotoSezione.java
│   │   │   └── PreferenzaConsigliere.java
│   │   ├── resource/                    # REST Endpoints
│   │   │   ├── AuthResource.java
│   │   │   ├── SezioneResource.java
│   │   │   ├── ListaResource.java
│   │   │   ├── SindacoResource.java
│   │   │   ├── ConsigliereResource.java
│   │   │   ├── VotiResource.java
│   │   │   ├── DashboardResource.java
│   │   │   └── UtenteResource.java
│   │   └── dto/                         # Data Transfer Objects
│   │       ├── VotiSezioneRequest.java
│   │       ├── VotiSezioneDTO.java
│   │       ├── CandidatoSindacoDTO.java
│   │       └── DashboardDTO.java
│   └── resources/
│       ├── application.properties       # Configurazione Quarkus
│       ├── import.sql                   # Dati iniziali
│       ├── privateKey.pem              # Chiave privata RSA per JWT
│       └── publicKey.pem               # Chiave pubblica RSA per JWT
└── README.md
```

## Setup e Configurazione

### 1. Clonare il repository

```bash
cd /sessions/dreamy-eloquent-wright/mnt/Comunali/backend
```

### 2. Configurare il database PostgreSQL

Creare un database locale:

```bash
createdb comunali
```

O modificare `src/main/resources/application.properties` con i tuoi dati di connessione:

```properties
quarkus.datasource.username=your_user
quarkus.datasource.password=your_password
quarkus.datasource.jdbc.url=jdbc:postgresql://your_host:5432/comunali
```

### 3. Compilare il progetto

```bash
mvn clean install
```

### 4. Eseguire in development mode

```bash
mvn quarkus:dev
```

Il server partirà su `http://localhost:8080`

### 5. Costruire per production

```bash
mvn clean package -Dquarkus.package.type=uber-jar
```

Eseguire il JAR:

```bash
java -jar target/comunali-backend-1.0.0-runner.jar
```

## Autenticazione

L'applicazione usa **JWT (JSON Web Token)** con chiavi RSA 2048-bit.

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Risposta:**
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

### Usare il token

Aggiungere l'header `Authorization: Bearer <token>` a tutte le richieste autenticate:

```bash
curl -X GET http://localhost:8080/api/sezioni \
  -H "Authorization: Bearer eyJhbGc..."
```

## Profili Utente (Ruoli)

- **ADMIN** - Accesso completo a tutte le risorse
- **GESTORE_LISTE** - Gestione liste elettorali
- **GESTORE_CANDIDATI** - Gestione candidati (sindaci e consiglieri)
- **GESTORE_VOTI** - Inserimento e modifica voti
- **VISUALIZZATORE** - Solo lettura dati

## API Endpoints

### Auth

- `POST /api/auth/login` - Effettua login (pubblico)
- `GET /api/auth/me` - Restituisce utente corrente (autenticato)

### Sezioni

- `GET /api/sezioni` - Lista tutte le sezioni
- `POST /api/sezioni` - Crea una sezione (ADMIN)
- `PUT /api/sezioni/{id}` - Modifica una sezione (ADMIN)
- `DELETE /api/sezioni/{id}` - Elimina una sezione (ADMIN)

### Liste Elettorali

- `GET /api/liste` - Lista tutte le liste
- `POST /api/liste` - Crea una lista (ADMIN, GESTORE_LISTE)
- `PUT /api/liste/{id}` - Modifica una lista (ADMIN, GESTORE_LISTE)
- `DELETE /api/liste/{id}` - Elimina una lista (ADMIN, GESTORE_LISTE)

### Candidati Sindaci

- `GET /api/sindaci` - Lista candidati sindaci
- `POST /api/sindaci` - Crea candidato sindaco (ADMIN, GESTORE_CANDIDATI)
- `PUT /api/sindaci/{id}` - Modifica candidato sindaco (ADMIN, GESTORE_CANDIDATI)
- `DELETE /api/sindaci/{id}` - Elimina candidato sindaco (ADMIN, GESTORE_CANDIDATI)

### Consiglieri

- `GET /api/consiglieri` - Lista tutti i consiglieri
- `GET /api/consiglieri?listaId={id}` - Consiglieri di una lista
- `POST /api/consiglieri` - Crea consigliere (ADMIN, GESTORE_CANDIDATI)
- `PUT /api/consiglieri/{id}` - Modifica consigliere (ADMIN, GESTORE_CANDIDATI)
- `DELETE /api/consiglieri/{id}` - Elimina consigliere (ADMIN, GESTORE_CANDIDATI)

### Voti

- `GET /api/voti/sezione/{sezioneId}` - Voti di una sezione
- `POST /api/voti/sezione` - Salva/aggiorna voti di una sezione (ADMIN, GESTORE_VOTI)
- `GET /api/voti/stato` - Stato scrutinio di tutte le sezioni

**Body esempio POST /api/voti/sezione:**
```json
{
  "sezioneId": 1,
  "votanti": 450,
  "schedeBianche": 10,
  "schedeNulle": 5,
  "votiListe": [
    {"listaId": 1, "votiLista": 200, "votiSindaco": 210},
    {"listaId": 2, "votiLista": 150, "votiSindaco": 140},
    {"listaId": 3, "votiLista": 85, "votiSindaco": 85}
  ],
  "preferenzeConsiglieri": [
    {"consigliereId": 1, "preferenze": 80},
    {"consigliereId": 5, "preferenze": 45},
    {"consigliereId": 11, "preferenze": 30}
  ]
}
```

### Dashboard

- `GET /api/dashboard/riepilogo` - Riepilogo votazione (totali, sezioni scrutinate, ecc.)
- `GET /api/dashboard/sindaci` - Risultati candidati sindaci
- `GET /api/dashboard/liste` - Risultati liste elettorali
- `GET /api/dashboard/sezioni` - Risultati per sezione
- `GET /api/dashboard/consiglieri` - Risultati preferenze consiglieri (ordinati DESC)

### Utenti

- `GET /api/utenti` - Lista utenti (ADMIN)
- `POST /api/utenti` - Crea utente (ADMIN)
- `PUT /api/utenti/{id}` - Modifica utente (ADMIN)
- `DELETE /api/utenti/{id}` - Elimina utente (ADMIN)

## Dati Iniziali

Al primo avvio, il file `import.sql` popola automaticamente il database con:

- **1 utente admin** - Username: `admin`, Password: `admin123`
- **20 sezioni** - Numerate da 1 a 20
- **3 liste elettorali** - Lista A, B, C con colori diversi
- **2 candidati sindaci** - Marco Rossi (supportato da Liste A+B) e Anna Bianchi (Lista C)
- **15 consiglieri** - 5 per lista

## OpenAPI/Swagger UI

La documentazione interattiva è disponibile a:

```
http://localhost:8080/q/swagger-ui
```

## Variabili d'Ambiente

Per configurare il database in runtime:

```bash
DB_USER=comunali
DB_PASSWORD=mypassword
DB_URL=jdbc:postgresql://db.example.com:5432/comunali
```

Oppure modificare direttamente `application.properties`.

## Deployment

### Su Render.com

1. Push il codice a GitHub
2. Crea un nuovo "Web Service" su Render
3. Connetti il repository GitHub
4. Configura le variabili d'ambiente (DB_USER, DB_PASSWORD, DB_URL)
5. Build Command: `mvn clean package -Dquarkus.package.type=uber-jar`
6. Start Command: `java -jar target/comunali-backend-1.0.0-runner.jar`

### Su Docker

Creare un `Dockerfile`:

```dockerfile
FROM quay.io/quarkus/quarkus-micro-image:2.0
COPY target/*-runner /app
EXPOSE 8080
CMD ["/app"]
```

Build e run:

```bash
mvn clean package -Dquarkus.package.type=uber-jar
docker build -t comunali-backend .
docker run -p 8080:8080 -e DB_URL=jdbc:postgresql://db:5432/comunali comunali-backend
```

## Troubleshooting

### Errore "Impossible to extract result from password in database" durante login

Verificare che il hash della password in `import.sql` sia valido. Rigenerare se necessario:

```bash
python3 -c "import bcrypt; print(bcrypt.hashpw(b'admin123', bcrypt.gensalt()).decode())"
```

### Chiavi JWT non trovate

Le chiavi RSA devono trovarsi in `src/main/resources/`:
- `privateKey.pem` - Chiave privata per firmare i token
- `publicKey.pem` - Chiave pubblica per verificare i token

Generarle con:

```bash
openssl genrsa -out src/main/resources/privateKey.pem 2048
openssl rsa -in src/main/resources/privateKey.pem -pubout -out src/main/resources/publicKey.pem
```

### Errore CORS

CORS è abilitato per tutte le origini in development. Per production, modificare `application.properties`:

```properties
quarkus.http.cors.origins=https://yourdomain.com
```

## Performance

Quarkus offre startup time estremamente veloce e basso consumo di memoria:

- **Build time** JVM: < 5 secondi
- **Startup time** JVM: < 1 secondo
- **Memory footprint** JVM: ~50MB

Per il modo native (GraalVM), aggiungere il profilo:

```bash
mvn clean package -Pnative
```

## Licenza

MIT

## Support

Per problemi e domande, contattare l'admin di sistema.
