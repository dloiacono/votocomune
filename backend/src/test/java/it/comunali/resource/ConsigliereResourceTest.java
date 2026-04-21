package it.comunali.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
class ConsigliereResourceTest {

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void listConsiglieri() {
        given()
        .when()
            .get("/api/consiglieri")
        .then()
            .statusCode(200)
            .body("size()", greaterThanOrEqualTo(15));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void listConsiglieriByLista() {
        given()
            .queryParam("listaId", 1)
        .when()
            .get("/api/consiglieri")
        .then()
            .statusCode(200)
            .body("size()", equalTo(5));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void listConsiglieriByInvalidLista() {
        given()
            .queryParam("listaId", 999)
        .when()
            .get("/api/consiglieri")
        .then()
            .statusCode(404)
            .body("error", equalTo("Lista non trovata"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getConsigliereById() {
        given()
        .when()
            .get("/api/consiglieri/1")
        .then()
            .statusCode(200)
            .body("nome", equalTo("Paolo"))
            .body("cognome", equalTo("Ferrari"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createConsigliere() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {
                    "nome": "Nuovo",
                    "cognome": "Consigliere",
                    "listaId": 1,
                    "ordineLista": 6
                }
                """)
        .when()
            .post("/api/consiglieri")
        .then()
            .statusCode(201)
            .body("nome", equalTo("Nuovo"))
            .body("ordineLista", equalTo(6));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createConsigliereWithMissingFields() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\": \"Solo\"}")
        .when()
            .post("/api/consiglieri")
        .then()
            .statusCode(400)
            .body("error", equalTo("Campi obbligatori mancanti"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createConsigliereWithInvalidLista() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\": \"T\", \"cognome\": \"T\", \"listaId\": 999, \"ordineLista\": 1}")
        .when()
            .post("/api/consiglieri")
        .then()
            .statusCode(400)
            .body("error", equalTo("Lista non trovata"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void updateConsigliere() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\": \"Aggiornato\"}")
        .when()
            .put("/api/consiglieri/1")
        .then()
            .statusCode(200)
            .body("nome", equalTo("Aggiornato"));
    }

    @Test
    @TestSecurity(user = "gestore", roles = {"GESTORE_CANDIDATI"})
    void createConsigliereWithGestoreCandidatiRole() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\": \"G\", \"cognome\": \"C\", \"listaId\": 2, \"ordineLista\": 6}")
        .when()
            .post("/api/consiglieri")
        .then()
            .statusCode(201);
    }
}
