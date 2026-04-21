package it.comunali.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
class ListaResourceTest {

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void listListe() {
        given()
        .when()
            .get("/api/liste")
        .then()
            .statusCode(200)
            .body("size()", equalTo(3))
            .body("[0].nome", notNullValue())
            .body("[0].colore", notNullValue());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getListaById() {
        given()
        .when()
            .get("/api/liste/1")
        .then()
            .statusCode(200)
            .body("numero", equalTo(1))
            .body("nome", equalTo("Lista A - Centro Sinistra"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getListaNotFound() {
        given()
        .when()
            .get("/api/liste/999")
        .then()
            .statusCode(404);
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createLista() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"numero\":99,\"nome\":\"Lista Test\",\"simbolo\":\"Cuore\",\"colore\":\"#00FF00\"}")
        .when()
            .post("/api/liste")
        .then()
            .statusCode(201)
            .body("nome", equalTo("Lista Test"))
            .body("colore", equalTo("#00FF00"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createListaWithMissingFields() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"numero\":100}")
        .when()
            .post("/api/liste")
        .then()
            .statusCode(400)
            .body("error", equalTo("Campi obbligatori mancanti"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createListaDuplicateNumero() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"numero\":1,\"nome\":\"Dup\",\"simbolo\":\"X\",\"colore\":\"#000\"}")
        .when()
            .post("/api/liste")
        .then()
            .statusCode(400)
            .body("error", equalTo("Una lista con questo numero esiste già"));
    }

    @Test
    @TestSecurity(user = "gestore", roles = {"GESTORE_LISTE"})
    void createListaWithGestoreRole() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"numero\":98,\"nome\":\"Lista Gestore\",\"simbolo\":\"G\",\"colore\":\"#111\"}")
        .when()
            .post("/api/liste")
        .then()
            .statusCode(201);
    }

    @Test
    @TestSecurity(user = "scrutatore", roles = {"GESTORE_VOTI"})
    void createListaWithWrongRole() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"numero\":97,\"nome\":\"No\",\"simbolo\":\"N\",\"colore\":\"#222\"}")
        .when()
            .post("/api/liste")
        .then()
            .statusCode(403);
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void updateLista() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\":\"Aggiornata\"}")
        .when()
            .put("/api/liste/1")
        .then()
            .statusCode(200)
            .body("nome", equalTo("Aggiornata"));
    }
}
