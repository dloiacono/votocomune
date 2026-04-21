package it.comunali.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
class SindacoResourceTest {

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void listSindaci() {
        given()
        .when()
            .get("/api/sindaci")
        .then()
            .statusCode(200)
            .body("size()", equalTo(2))
            .body("[0].nome", notNullValue())
            .body("[0].liste", notNullValue());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getSindacoById() {
        given()
        .when()
            .get("/api/sindaci/1")
        .then()
            .statusCode(200)
            .body("nome", equalTo("Marco"))
            .body("cognome", equalTo("Rossi"))
            .body("liste.size()", greaterThanOrEqualTo(1));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createSindaco() {
        given()
            .contentType(ContentType.JSON)
            .body("""
                {
                    "nome": "Luigi",
                    "cognome": "Verdi",
                    "listeIds": [1]
                }
                """)
        .when()
            .post("/api/sindaci")
        .then()
            .statusCode(201)
            .body("nome", equalTo("Luigi"))
            .body("liste.size()", equalTo(1));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createSindacoWithMissingFields() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\": \"Solo Nome\"}")
        .when()
            .post("/api/sindaci")
        .then()
            .statusCode(400)
            .body("error", equalTo("Nome e cognome sono obbligatori"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void createSindacoWithInvalidLista() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\": \"Test\", \"cognome\": \"Test\", \"listeIds\": [999]}")
        .when()
            .post("/api/sindaci")
        .then()
            .statusCode(400)
            .body("error", containsString("Lista con ID 999 non trovata"));
    }

    @Test
    @TestSecurity(user = "gestore", roles = {"GESTORE_CANDIDATI"})
    void createSindacoWithGestoreCandidatiRole() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\": \"Gestore\", \"cognome\": \"Test\"}")
        .when()
            .post("/api/sindaci")
        .then()
            .statusCode(201);
    }

    @Test
    @TestSecurity(user = "scrutatore", roles = {"GESTORE_VOTI"})
    void createSindacoWithWrongRole() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"nome\": \"No\", \"cognome\": \"Access\"}")
        .when()
            .post("/api/sindaci")
        .then()
            .statusCode(403);
    }
}
