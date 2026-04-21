# Comunali Backend - Esempi API

Questo documento contiene esempi pratici di richieste HTTP per tutti gli endpoint dell'API.

## Setup Iniziale

```bash
# Start PostgreSQL (con docker-compose)
docker-compose up -d

# Start Quarkus dev mode
mvn quarkus:dev

# L'API è disponibile a http://localhost:8080
# Swagger UI: http://localhost:8080/q/swagger-ui
```

## Autenticazione

### 1. Login (Ottieni JWT Token)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Risposta (200 OK):**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "utente": {
    "id": 1,
    "username": "admin",
    "nome": "Amministratore",
    "cognome": "Sistema",
    "profili": ["ADMIN", "GESTORE_CANDIDATI", "GESTORE_LISTE", "GESTORE_VOTI"]
  }
}
```

**Salva il token per le prossime richieste:**
```bash
export TOKEN="<token_dalla_risposta>"
```

### 2. Verifica Token - Ottieni Utente Corrente

```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
{
  "id": 1,
  "username": "admin",
  "nome": "Amministratore",
  "cognome": "Sistema",
  "profili": ["ADMIN", "GESTORE_CANDIDATI", "GESTORE_LISTE", "GESTORE_VOTI"]
}
```

---

## Gestione Sezioni

### 1. Elenca Tutte le Sezioni

```bash
curl -X GET http://localhost:8080/api/sezioni \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
[
  {
    "id": 1,
    "numero": 1,
    "nome": "Scuola Media Mazzini",
    "aventiDiritto": 450,
    "scrutinata": false
  },
  {
    "id": 2,
    "numero": 2,
    "nome": "Scuola Primaria Garibaldi",
    "aventiDiritto": 480,
    "scrutinata": false
  }
]
```

### 2. Ottieni una Sezione per ID

```bash
curl -X GET http://localhost:8080/api/sezioni/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Crea una Nuova Sezione

```bash
curl -X POST http://localhost:8080/api/sezioni \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numero": 21,
    "nome": "Sala Polivalente Nuova",
    "aventiDiritto": 500,
    "scrutinata": false
  }'
```

**Risposta (201 Created):**
```json
{
  "id": 21,
  "numero": 21,
  "nome": "Sala Polivalente Nuova",
  "aventiDiritto": 500,
  "scrutinata": false
}
```

### 4. Modifica una Sezione

```bash
curl -X PUT http://localhost:8080/api/sezioni/21 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numero": 21,
    "nome": "Sala Polivalente Municipale",
    "aventiDiritto": 520
  }'
```

### 5. Elimina una Sezione

```bash
curl -X DELETE http://localhost:8080/api/sezioni/21 \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (204 No Content)** - Nessun body

---

## Gestione Liste Elettorali

### 1. Elenca Tutte le Liste

```bash
curl -X GET http://localhost:8080/api/liste \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
[
  {
    "id": 1,
    "numero": 1,
    "nome": "Lista A - Centro Sinistra",
    "simbolo": "Rosa",
    "colore": "#FF69B4"
  },
  {
    "id": 2,
    "numero": 2,
    "nome": "Lista B - Centro Destra",
    "simbolo": "Sole",
    "colore": "#FFD700"
  },
  {
    "id": 3,
    "numero": 3,
    "nome": "Lista C - Sinistra",
    "simbolo": "Stella",
    "colore": "#FF0000"
  }
]
```

### 2. Crea una Nuova Lista

```bash
curl -X POST http://localhost:8080/api/liste \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numero": 4,
    "nome": "Lista D - Civica",
    "simbolo": "Scudo",
    "colore": "#0000FF"
  }'
```

### 3. Modifica una Lista

```bash
curl -X PUT http://localhost:8080/api/liste/4 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Lista D - Movimento Civico"
  }'
```

### 4. Elimina una Lista

```bash
curl -X DELETE http://localhost:8080/api/liste/4 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Gestione Candidati Sindaci

### 1. Elenca Tutti i Candidati Sindaci

```bash
curl -X GET http://localhost:8080/api/sindaci \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Marco",
    "cognome": "Rossi",
    "foto": null,
    "liste": [
      {
        "id": 1,
        "numero": 1,
        "nome": "Lista A - Centro Sinistra",
        "colore": "#FF69B4"
      },
      {
        "id": 2,
        "numero": 2,
        "nome": "Lista B - Centro Destra",
        "colore": "#FFD700"
      }
    ]
  },
  {
    "id": 2,
    "nome": "Anna",
    "cognome": "Bianchi",
    "foto": null,
    "liste": [
      {
        "id": 3,
        "numero": 3,
        "nome": "Lista C - Sinistra",
        "colore": "#FF0000"
      }
    ]
  }
]
```

### 2. Crea un Nuovo Candidato Sindaco

```bash
curl -X POST http://localhost:8080/api/sindaci \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Giorgio",
    "cognome": "Verdi",
    "foto": "https://example.com/giorgio.jpg",
    "listeIds": [4]
  }'
```

**Risposta (201 Created):**
```json
{
  "id": 3,
  "nome": "Giorgio",
  "cognome": "Verdi",
  "foto": "https://example.com/giorgio.jpg",
  "liste": [
    {
      "id": 4,
      "numero": 4,
      "nome": "Lista D - Civica",
      "colore": "#0000FF"
    }
  ]
}
```

### 3. Modifica un Candidato Sindaco (Aggiungi Liste di Supporto)

```bash
curl -X PUT http://localhost:8080/api/sindaci/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Marco",
    "cognome": "Rossi",
    "listeIds": [1, 2, 4]
  }'
```

### 4. Elimina un Candidato Sindaco

```bash
curl -X DELETE http://localhost:8080/api/sindaci/3 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Gestione Consiglieri

### 1. Elenca Tutti i Consiglieri

```bash
curl -X GET http://localhost:8080/api/consiglieri \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Elenca Consiglieri di una Lista Specifica

```bash
curl -X GET "http://localhost:8080/api/consiglieri?listaId=1" \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Paolo",
    "cognome": "Ferrari",
    "lista": {
      "id": 1,
      "numero": 1,
      "nome": "Lista A - Centro Sinistra",
      "colore": "#FF69B4"
    },
    "ordineLista": 1
  },
  {
    "id": 2,
    "nome": "Laura",
    "cognome": "Rossi",
    "lista": {
      "id": 1,
      "numero": 1,
      "nome": "Lista A - Centro Sinistra",
      "colore": "#FF69B4"
    },
    "ordineLista": 2
  }
]
```

### 3. Crea un Nuovo Consigliere

```bash
curl -X POST http://localhost:8080/api/consiglieri \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Francesca",
    "cognome": "Neri",
    "listaId": 1,
    "ordineLista": 6
  }'
```

### 4. Modifica un Consigliere

```bash
curl -X PUT http://localhost:8080/api/consiglieri/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ordineLista": 2
  }'
```

### 5. Elimina un Consigliere

```bash
curl -X DELETE http://localhost:8080/api/consiglieri/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Inserimento Voti

### 1. Ottieni Voti di una Sezione

```bash
curl -X GET http://localhost:8080/api/voti/sezione/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
{
  "sezioneId": 1,
  "numero": 1,
  "votanti": 0,
  "schedeBianche": 0,
  "schedeNulle": 0,
  "votiListe": [],
  "preferenzeConsiglieri": []
}
```

### 2. Salva/Aggiorna Voti di una Sezione

```bash
curl -X POST http://localhost:8080/api/voti/sezione \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sezioneId": 1,
    "votanti": 425,
    "schedeBianche": 8,
    "schedeNulle": 17,
    "votiListe": [
      {
        "listaId": 1,
        "votiLista": 185,
        "votiSindaco": 195
      },
      {
        "listaId": 2,
        "votiLista": 145,
        "votiSindaco": 135
      },
      {
        "listaId": 3,
        "votiLista": 90,
        "votiSindaco": 95
      }
    ],
    "preferenzeConsiglieri": [
      {
        "consigliereId": 1,
        "preferenze": 75
      },
      {
        "consigliereId": 2,
        "preferenze": 45
      },
      {
        "consigliereId": 5,
        "preferenze": 40
      },
      {
        "consigliereId": 6,
        "preferenze": 85
      },
      {
        "consigliereId": 11,
        "preferenze": 50
      }
    ]
  }'
```

**Risposta (200 OK):**
```json
{
  "message": "Voti salvati correttamente"
}
```

### 3. Ottieni Stato Scrutinio Tutte le Sezioni

```bash
curl -X GET http://localhost:8080/api/voti/stato \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
[
  {
    "sezioneId": 1,
    "numero": 1,
    "nome": "Scuola Media Mazzini",
    "scrutinata": true
  },
  {
    "sezioneId": 2,
    "numero": 2,
    "nome": "Scuola Primaria Garibaldi",
    "scrutinata": false
  }
]
```

---

## Dashboard e Risultati

### 1. Riepilogo Votazione

```bash
curl -X GET http://localhost:8080/api/dashboard/riepilogo \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
{
  "sezioniTotali": 20,
  "sezioniScrutinate": 5,
  "votantiTotali": 2125,
  "aventiDirittoTotali": 9380,
  "schedeBiancheTotali": 40,
  "schedeNulleTotali": 85
}
```

### 2. Risultati Candidati Sindaci

```bash
curl -X GET http://localhost:8080/api/dashboard/sindaci \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
[
  {
    "sindacoId": 1,
    "nome": "Marco",
    "cognome": "Rossi",
    "votiTotali": 1250,
    "percentuale": 62.5,
    "liste": [
      {
        "listaId": 1,
        "nome": "Lista A - Centro Sinistra",
        "votiLista": 650
      },
      {
        "listaId": 2,
        "nome": "Lista B - Centro Destra",
        "votiLista": 600
      }
    ]
  },
  {
    "sindacoId": 2,
    "nome": "Anna",
    "cognome": "Bianchi",
    "votiTotali": 750,
    "percentuale": 37.5,
    "liste": [
      {
        "listaId": 3,
        "nome": "Lista C - Sinistra",
        "votiLista": 750
      }
    ]
  }
]
```

### 3. Risultati Liste Elettorali

```bash
curl -X GET http://localhost:8080/api/dashboard/liste \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
[
  {
    "listaId": 1,
    "numero": 1,
    "nome": "Lista A - Centro Sinistra",
    "colore": "#FF69B4",
    "votiTotali": 650,
    "percentuale": 32.5
  },
  {
    "listaId": 2,
    "numero": 2,
    "nome": "Lista B - Centro Destra",
    "colore": "#FFD700",
    "votiTotali": 600,
    "percentuale": 30.0
  },
  {
    "listaId": 3,
    "numero": 3,
    "nome": "Lista C - Sinistra",
    "colore": "#FF0000",
    "votiTotali": 750,
    "percentuale": 37.5
  }
]
```

### 4. Risultati per Sezione

```bash
curl -X GET http://localhost:8080/api/dashboard/sezioni \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
[
  {
    "sezioneId": 1,
    "numero": 1,
    "nome": "Scuola Media Mazzini",
    "scrutinata": true,
    "votanti": 425,
    "aventiDiritto": 450
  },
  {
    "sezioneId": 2,
    "numero": 2,
    "nome": "Scuola Primaria Garibaldi",
    "scrutinata": false,
    "votanti": 0,
    "aventiDiritto": 480
  }
]
```

### 5. Risultati Consiglieri (per Preferenze)

```bash
curl -X GET http://localhost:8080/api/dashboard/consiglieri \
  -H "Authorization: Bearer $TOKEN"
```

**Risposta (200 OK):**
```json
[
  {
    "consigliereId": 6,
    "nome": "Francesca",
    "cognome": "Giallo",
    "lista": {
      "id": 2,
      "nome": "Lista B - Centro Destra",
      "colore": "#FFD700"
    },
    "preferenzeTotali": 425
  },
  {
    "consigliereId": 1,
    "nome": "Paolo",
    "cognome": "Ferrari",
    "lista": {
      "id": 1,
      "nome": "Lista A - Centro Sinistra",
      "colore": "#FF69B4"
    },
    "preferenzeTotali": 375
  },
  {
    "consigliereId": 11,
    "nome": "Davide",
    "cognome": "Cremisi",
    "lista": {
      "id": 3,
      "nome": "Lista C - Sinistra",
      "colore": "#FF0000"
    },
    "preferenzeTotali": 250
  }
]
```

---

## Gestione Utenti (Admin Only)

### 1. Elenca Tutti gli Utenti

```bash
curl -X GET http://localhost:8080/api/utenti \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Crea un Nuovo Utente

```bash
curl -X POST http://localhost:8080/api/utenti \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "scrutatore1",
    "password": "password123",
    "nome": "Giovanni",
    "cognome": "Scrutatore",
    "email": "scrutatore@esempio.com",
    "profili": ["GESTORE_VOTI"]
  }'
```

### 3. Modifica un Utente

```bash
curl -X PUT http://localhost:8080/api/utenti/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profili": ["GESTORE_VOTI", "GESTORE_CANDIDATI"]
  }'
```

### 4. Elimina un Utente

```bash
curl -X DELETE http://localhost:8080/api/utenti/2 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Handling

Tutti gli errori restituiscono un body JSON con descrizione:

**Errore 400 - Bad Request:**
```json
{
  "error": "Campi obbligatori mancanti"
}
```

**Errore 401 - Unauthorized:**
```json
{
  "error": "Credenziali non valide"
}
```

**Errore 403 - Forbidden:**
```json
{
  "error": "Accesso negato"
}
```

**Errore 404 - Not Found:**
```json
{
  "error": "Risorsa non trovata"
}
```

---

## Tips Utili

### Salvare Token in Variabile d'Ambiente

```bash
# Login e salva token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')

# Verifica
echo $TOKEN
```

### Usare jq per Parsing JSON

```bash
# Estrarre solo i nomi dei consiglieri
curl -s http://localhost:8080/api/consiglieri \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | "\(.nome) \(.cognome)"'

# Contare sezioni scrutinate
curl -s http://localhost:8080/api/voti/stato \
  -H "Authorization: Bearer $TOKEN" | jq '[.[] | select(.scrutinata==true)] | length'
```

### Testare con Postman

1. Importare la collezione: Creare una richiesta POST a `/api/auth/login`
2. Nel tab "Tests", aggiungere:
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```
3. Usare `{{token}}` in Authorization header per le altre richieste

