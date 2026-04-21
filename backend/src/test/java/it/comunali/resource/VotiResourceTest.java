package it.comunali.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class VotiResourceTest {

    @Test
    @Order(1)
    @TestSecurity(user = "admin", roles = {"ADMIN", "GESTORE_VOTI"})
    void saveVotiSezione() {
        String body = """
            {
                "sezioneId": 1,
                "votanti": 300,
                "schedeBianche": 5,
                "schedeNulle": 3,
                "votiListe": [
                    {"listaId": 1, "votiLista": 120, "votiSindaco": 130},
                    {"listaId": 2, "votiLista": 100, "votiSindaco": 95},
                    {"listaId": 3, "votiLista": 72, "votiSindaco": 75}
                ],
                "preferenzeConsiglieri": [
                    {"consigliereId": 1, "preferenze": 45},
                    {"consigliereId": 2, "preferenze": 30},
                    {"consigliereId": 6, "preferenze": 25}
                ]
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(body)
        .when()
            .post("/api/voti/sezione")
        .then()
            .statusCode(200)
            .body("message", equalTo("Voti salvati correttamente"));
    }

    @Test
    @Order(2)
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getVotiSezione() {
        given()
        .when()
            .get("/api/voti/sezione/1")
        .then()
            .statusCode(200)
            .body("sezioneId", equalTo(1))
            .body("votanti", equalTo(300))
            .body("schedeBianche", equalTo(5))
            .body("schedeNulle", equalTo(3))
            .body("votiListe.size()", equalTo(3))
            .body("preferenzeConsiglieri.size()", equalTo(3));
    }

    @Test
    @Order(3)
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getVotiSezioneNotFound() {
        given()
        .when()
            .get("/api/voti/sezione/999")
        .then()
            .statusCode(404)
            .body("error", equalTo("Sezione non trovata"));
    }

    @Test
    @Order(4)
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getStatoSezioni() {
        given()
        .when()
            .get("/api/voti/stato")
        .then()
            .statusCode(200)
            .body("size()", greaterThanOrEqualTo(20))
            .body("find { it.sezioneId == 1 }.scrutinata", equalTo(true))
            .body("find { it.sezioneId == 2 }.scrutinata", equalTo(false));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN", "GESTORE_VOTI"})
    void saveVotiWithMissingSezioneId() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"votanti\": 100}")
        .when()
            .post("/api/voti/sezione")
        .then()
            .statusCode(400)
            .body("error", equalTo("sezioneId è obbligatorio"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN", "GESTORE_VOTI"})
    void saveVotiWithNonExistentSezione() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"sezioneId\": 999, \"votanti\": 100}")
        .when()
            .post("/api/voti/sezione")
        .then()
            .statusCode(404)
            .body("error", equalTo("Sezione non trovata"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN", "GESTORE_VOTI"})
    void saveVotiWithNonExistentLista() {
        String body = """
            {
                "sezioneId": 2,
                "votanti": 100,
                "votiListe": [
                    {"listaId": 999, "votiLista": 50, "votiSindaco": 50}
                ]
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(body)
        .when()
            .post("/api/voti/sezione")
        .then()
            .statusCode(400)
            .body("error", containsString("Lista con ID 999 non trovata"));
    }

    @Test
    @TestSecurity(user = "scrutatore", roles = {"GESTORE_VOTI"})
    void saveVotiWithGestoreVotiRole() {
        String body = """
            {
                "sezioneId": 3,
                "votanti": 200,
                "schedeBianche": 2,
                "schedeNulle": 1,
                "votiListe": [
                    {"listaId": 1, "votiLista": 100, "votiSindaco": 110}
                ]
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(body)
        .when()
            .post("/api/voti/sezione")
        .then()
            .statusCode(200);
    }

    @Test
    @TestSecurity(user = "user", roles = {"GESTORE_LISTE"})
    void saveVotiWithWrongRole() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"sezioneId\": 4, \"votanti\": 100}")
        .when()
            .post("/api/voti/sezione")
        .then()
            .statusCode(403);
    }

    @Test
    void getVotiWithoutAuth() {
        given()
        .when()
            .get("/api/voti/sezione/1")
        .then()
            .statusCode(401);
    }
}
