## Build Stage
FROM maven:3.9-eclipse-temurin-17 as builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests -Dquarkus.package.type=uber-jar

## Runtime Stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/*-runner.jar ./app.jar

EXPOSE 8080

# Default prod — Render può sovrascrivere con QUARKUS_PROFILE env var
# Quarkus legge QUARKUS_PROFILE automaticamente e attiva application-prod.properties
ENV QUARKUS_PROFILE=prod

ENTRYPOINT ["java", "-jar", "app.jar"]
