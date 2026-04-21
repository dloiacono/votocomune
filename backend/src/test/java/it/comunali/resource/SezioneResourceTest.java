package it.comunali.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
class SezioneResourceTest {

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void listSezioni() {
        given()
        .when()
            .get("/api/sezioni")
        .then()
            .statusCode(200)
            .body("size()", equalTo(20))
            .body("[0].numero", notNullValue())
            .body("[0].nome", notNullValue());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getSezioneById() {
        given()
        .when()
            .get("/api/sezioni/1")
        .then()
            .statusCode(200)
            .body("numero", equalTo(1))
            .body("nome", equalTo("Scuola Media Mazzini"))
            .body("aventiDiritto", equalTo(450))
            .body("scrutinata", equalTo(false));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getSezioneNotFound() {
        given()
        .when()
            .get("/api/sezioni/999")
        .then()
            .statusCode(404)
            .body("error", equalTo("Sezione non trovata"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createSezione() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"numero\":99,\"nome\":\"Test Sezione\",\"aventiDiritto\":100}")
        .when()
            .post("/api/sezioni")
        .then()
            .statusCode(201)
            .body("numero", equalTo(99))
            .body("nome", equalTo("Test Sezione"))
            .body("scrutinata", equalTo(false));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createSezioneWithMissingFields() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"numero\":100}")
        .when()
            .post("/api/sezioni")
        .then()
            .statusCode(400)
            .body("error", equalTo("Campi obbligatori mancanti"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createSezioneDuplicateNumero() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"numero\":1,\"nome\":\"Duplicata\",\"aventiDiritto\":100}")
        .when()
            .post("/api/sezioni")
        .then()
            .statusCode(400)
            .body("error", equalTo("Una sezione con questo numero esiste già"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void updateSezione() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\":\"Nome Aggiornato\"}")
        .when()
            .put("/api/sezioni/1")
        .then()
            .statusCode(200)
            .body("nome", equalTo("Nome Aggiornato"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void updateSezioneNotFound() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\":\"Test\"}")
        .when()
            .put("/api/sezioni/999")
        .then()
            .statusCode(404);
    }

    @Test
    void listSezioniWithoutAuth() {
        given()
        .when()
            .get("/api/sezioni")
        .then()
            .statusCode(401);
    }

    @Test
    @TestSecurity(user = "scrutatore", roles = {"GESTORE_VOTI"})
    void createSezioneWithWrongRole() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"numero\":101,\"nome\":\"Test\",\"aventiDiritto\":100}")
        .when()
            .post("/api/sezioni")
        .then()
            .statusCode(403);
    }
}
