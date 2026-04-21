package it.comunali.auth;

import it.comunali.auth.dto.LoginRequest;
import it.comunali.auth.dto.LoginResponse;
import it.comunali.model.Utente;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    JwtUtils jwtUtils;

    @POST
    @Path("/login")
    @PermitAll
    public Response login(LoginRequest request) {
        if (request.username == null || request.password == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Username e password sono obbligatori"))
                    .build();
        }

        Utente utente = Utente.findByUsername(request.username);
        if (utente == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("Credenziali non valide"))
                    .build();
        }

        if (!utente.verifyPassword(request.password)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("Credenziali non valide"))
                    .build();
        }

        String token = jwtUtils.generateToken(utente.username, utente.profili);
        LoginResponse.UtenteDTO utenteDTO = new LoginResponse.UtenteDTO(
                utente.id,
                utente.username,
                utente.nome,
                utente.cognome,
                utente.profili
        );
        LoginResponse response = new LoginResponse(token, utenteDTO);

        return Response.ok(response).build();
    }

    @GET
    @Path("/me")
    @RolesAllowed("**")
    public Response getCurrentUser(@Context SecurityContext securityContext) {
        String username = securityContext.getUserPrincipal().getName();
        Utente utente = Utente.findByUsername(username);

        if (utente == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Utente non trovato"))
                    .build();
        }

        LoginResponse.UtenteDTO utenteDTO = new LoginResponse.UtenteDTO(
                utente.id,
                utente.username,
                utente.nome,
                utente.cognome,
                utente.profili
        );

        return Response.ok(utenteDTO).build();
    }

    public static class ErrorResponse {
        public String error;

        public ErrorResponse() {
        }

        public ErrorResponse(String error) {
            this.error = error;
        }
    }
}
