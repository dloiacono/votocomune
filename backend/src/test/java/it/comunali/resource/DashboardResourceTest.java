package it.comunali.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
class DashboardResourceTest {

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getRiepilogo() {
        given()
        .when()
            .get("/api/dashboard/riepilogo")
        .then()
            .statusCode(200)
            .body("sezioniTotali", equalTo(20))
            .body("aventiDirittoTotali", greaterThan(0));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getSindaci() {
        given()
        .when()
            .get("/api/dashboard/sindaci")
        .then()
            .statusCode(200)
            .body("size()", equalTo(2))
            .body("[0].nome", notNullValue())
            .body("[0].cognome", notNullValue());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getListe() {
        given()
        .when()
            .get("/api/dashboard/liste")
        .then()
            .statusCode(200)
            .body("size()", equalTo(3))
            .body("[0].nome", notNullValue())
            .body("[0].colore", notNullValue());
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getSezioni() {
        given()
        .when()
            .get("/api/dashboard/sezioni")
        .then()
            .statusCode(200)
            .body("size()", equalTo(20))
            .body("[0].numero", equalTo(1));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    void getConsiglieri() {
        given()
        .when()
            .get("/api/dashboard/consiglieri")
        .then()
            .statusCode(200)
            .body("size()", greaterThanOrEqualTo(15))
            .body("[0].nome", notNullValue())
            .body("[0].lista", notNullValue());
    }

    @Test
    @TestSecurity(user = "scrutatore", roles = {"GESTORE_VOTI"})
    void dashboardAccessibleToAllRoles() {
        given()
        .when()
            .get("/api/dashboard/riepilogo")
        .then()
            .statusCode(200);
    }

    @Test
    void dashboardRequiresAuth() {
        given()
        .when()
            .get("/api/dashboard/riepilogo")
        .then()
            .statusCode(401);
    }
}
