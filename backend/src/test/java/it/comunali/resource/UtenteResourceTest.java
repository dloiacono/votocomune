package it.comunali.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
class UtenteResourceTest {

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void listUtenti() {
        given()
        .when()
            .get("/api/utenti")
        .then()
            .statusCode(200)
            .body("size()", greaterThanOrEqualTo(1))
            .body("[0].username", notNullValue());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getUtenteById() {
        given()
        .when()
            .get("/api/utenti/1")
        .then()
            .statusCode(200)
            .body("username", equalTo("admin"))
            .body("nome", notNullValue());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getUtenteNotFound() {
        given()
        .when()
            .get("/api/utenti/999")
        .then()
            .statusCode(404);
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createUtente() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {
                    "username": "testuser",
                    "password": "password123",
                    "nome": "Test",
                    "cognome": "User",
                    "email": "test@example.com",
                    "profili": ["GESTORE_VOTI"]
                }
                """)
        .when()
            .post("/api/utenti")
        .then()
            .statusCode(201)
            .body("username", equalTo("testuser"))
            .body("profili", hasItem("GESTORE_VOTI"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createUtenteWithMissingFields() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"username\": \"incomplete\"}")
        .when()
            .post("/api/utenti")
        .then()
            .statusCode(400)
            .body("error", equalTo("Campi obbligatori mancanti"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createUtenteDuplicateUsername() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {
                    "username": "admin",
                    "password": "pass",
                    "nome": "Dup",
                    "cognome": "User",
                    "email": "dup@example.com"
                }
                """)
        .when()
            .post("/api/utenti")
        .then()
            .statusCode(400)
            .body("error", equalTo("Username già in uso"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void updateUtente() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\": \"Admin Aggiornato\"}")
        .when()
            .put("/api/utenti/1")
        .then()
            .statusCode(200)
            .body("nome", equalTo("Admin Aggiornato"));
    }

    @Test
    @TestSecurity(user = "scrutatore", roles = {"GESTORE_VOTI"})
    void listUtentiWithWrongRole() {
        given()
        .when()
            .get("/api/utenti")
        .then()
            .statusCode(403);
    }

    @Test
    void listUtentiWithoutAuth() {
        given()
        .when()
            .get("/api/utenti")
        .then()
            .statusCode(401);
    }
}
