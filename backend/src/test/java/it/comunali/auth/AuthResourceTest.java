package it.comunali.auth;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.quarkus.test.security.jwt.Claim;
import io.quarkus.test.security.jwt.JwtSecurity;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
class AuthResourceTest {

    @Test
    void loginWithValidCredentials() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"username\":\"admin\",\"password\":\"admin123\"}")
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(200)
            .body("token", notNullValue())
            .body("utente.username", equalTo("admin"))
            .body("utente.profili", hasItem("ADMIN"));
    }

    @Test
    void loginWithInvalidPassword() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"username\":\"admin\",\"password\":\"wrong\"}")
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(401)
            .body("error", equalTo("Credenziali non valide"));
    }

    @Test
    void loginWithNonExistentUser() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"username\":\"nonexistent\",\"password\":\"password\"}")
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(401)
            .body("error", equalTo("Credenziali non valide"));
    }

    @Test
    void loginWithMissingFields() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"username\":\"admin\"}")
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(400)
            .body("error", equalTo("Username e password sono obbligatori"));
    }

    @Test
    @TestSecurity(user = "admin", roles = {"ADMIN"})
    @JwtSecurity(claims = {
        @Claim(key = "upn", value = "admin")
    })
    void getCurrentUser() {
        given()
        .when()
            .get("/api/auth/me")
        .then()
            .statusCode(200)
            .body("username", equalTo("admin"))
            .body("nome", equalTo("Amministratore"));
    }

    @Test
    void getCurrentUserWithoutAuth() {
        given()
        .when()
            .get("/api/auth/me")
        .then()
            .statusCode(401);
    }
}
