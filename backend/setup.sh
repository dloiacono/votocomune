#!/bin/bash

# Setup script per Comunali Backend
# Questo script aiuta a configurare il backend Quarkus per elezioni comunali

set -e

echo "================================"
echo "Comunali Backend - Setup Script"
echo "================================"
echo ""

# Check Java
if ! command -v java &> /dev/null; then
    echo "ERRORE: Java non trovato. Assicurati di avere Java 17+ installato."
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | grep version | awk '{print $3}' | tr -d '"')
echo "✓ Java trovato: $JAVA_VERSION"

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo "ERRORE: Maven non trovato. Assicurati di avere Maven 3.8.1+ installato."
    exit 1
fi

MVN_VERSION=$(mvn -v | grep Apache | awk '{print $3}')
echo "✓ Maven trovato: $MVN_VERSION"

# Check PostgreSQL (optional)
if command -v psql &> /dev/null; then
    echo "✓ PostgreSQL CLI trovato"
else
    echo "⚠ PostgreSQL CLI non trovato (opzionale, puoi comunque usare un database remoto)"
fi

echo ""
echo "================================"
echo "Configurazione Database"
echo "================================"
echo ""

# Chiedere se creare il database locale
read -p "Creare un database PostgreSQL locale? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    read -p "Username PostgreSQL (default: postgres): " DB_USER
    DB_USER=${DB_USER:-postgres}

    read -sp "Password PostgreSQL: " DB_PASS
    echo

    read -p "Host database (default: localhost): " DB_HOST
    DB_HOST=${DB_HOST:-localhost}

    read -p "Nome database (default: comunali): " DB_NAME
    DB_NAME=${DB_NAME:-comunali}

    echo ""
    echo "Tentativo di creazione database..."
    PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || PGPASSWORD=$DB_PASS createdb -h $DB_HOST -U $DB_USER $DB_NAME

    if [ $? -eq 0 ]; then
        echo "✓ Database creato/verificato"

        # Aggiornare application.properties
        sed -i.bak "s|DB_USER:.*|DB_USER:$DB_USER|" src/main/resources/application.properties
        sed -i.bak "s|DB_PASSWORD:.*|DB_PASSWORD:$DB_PASS|" src/main/resources/application.properties
        sed -i.bak "s|DB_URL:.*|DB_URL:jdbc:postgresql://$DB_HOST:5432/$DB_NAME|" src/main/resources/application.properties

        echo "✓ application.properties aggiornato"
    else
        echo "⚠ Impossibile creare il database. Procedi manualmente o usa un database remoto."
    fi
else
    echo "Configura manualmente il database in src/main/resources/application.properties"
fi

echo ""
echo "================================"
echo "Build del Progetto"
echo "================================"
echo ""

read -p "Eseguire 'mvn clean install'? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    mvn clean install
    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ Build completato con successo!"
    else
        echo ""
        echo "✗ Build fallito. Verifica gli errori sopra."
        exit 1
    fi
fi

echo ""
echo "================================"
echo "Setup Completato!"
echo "================================"
echo ""
echo "Prossimi passi:"
echo ""
echo "1. Per eseguire in development mode:"
echo "   mvn quarkus:dev"
echo ""
echo "2. Per creare una build production:"
echo "   mvn clean package -Dquarkus.package.type=uber-jar"
echo ""
echo "3. Accedere a Swagger UI:"
echo "   http://localhost:8080/q/swagger-ui"
echo ""
echo "4. Login con:"
echo "   username: admin"
echo "   password: admin123"
echo ""
echo "5. Documentazione API disponibile a:"
echo "   http://localhost:8080/q/swagger-ui"
echo ""
