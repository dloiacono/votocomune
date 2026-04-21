package it.comunali.resource;

import it.comunali.model.Utente;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Path("/api/utenti")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN")
public class UtenteResource {

    @GET
    public Response getAll() {
        List<Utente> utenti = Utente.listAll();
        List<UtenteDTO> dtos = utenti.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return Response.ok(dtos).build();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        Utente utente = Utente.findById(id);
        if (utente == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Utente non trovato"))
                    .build();
        }
        return Response.ok(toDTO(utente)).build();
    }

    @POST
    @Transactional
    public Response create(CreateUtenteRequest request) {
        if (request.username == null || request.password == null || request.nome == null || request.cognome == null || request.email == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Campi obbligatori mancanti"))
                    .build();
        }

        if (Utente.findByUsername(request.username) != null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Username già in uso"))
                    .build();
        }

        Utente utente = new Utente();
        utente.username = request.username;
        Utente.setPasswordHash(utente, request.password);
        utente.nome = request.nome;
        utente.cognome = request.cognome;
        utente.email = request.email;

        if (request.profili != null) {
            utente.profili = new HashSet<>(request.profili);
        } else {
            utente.profili = new HashSet<>();
        }

        utente.persist();
        return Response.status(Response.Status.CREATED).entity(toDTO(utente)).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, UpdateUtenteRequest request) {
        Utente utente = Utente.findById(id);
        if (utente == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Utente non trovato"))
                    .build();
        }

        if (request.password != null && !request.password.isEmpty()) {
            Utente.setPasswordHash(utente, request.password);
        }

        if (request.nome != null) {
            utente.nome = request.nome;
        }
        if (request.cognome != null) {
            utente.cognome = request.cognome;
        }
        if (request.email != null) {
            utente.email = request.email;
        }
        if (request.profili != null) {
            utente.profili = new HashSet<>(request.profili);
        }

        utente.persist();
        return Response.ok(toDTO(utente)).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        Utente utente = Utente.findById(id);
        if (utente == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Utente non trovato"))
                    .build();
        }

        utente.delete();
        return Response.noContent().build();
    }

    private UtenteDTO toDTO(Utente utente) {
        return new UtenteDTO(utente.id, utente.username, utente.nome, utente.cognome, utente.email, utente.profili);
    }

    public static class UtenteDTO {
        public Long id;
        public String username;
        public String nome;
        public String cognome;
        public String email;
        public Set<String> profili;

        public UtenteDTO() {
        }

        public UtenteDTO(Long id, String username, String nome, String cognome, String email, Set<String> profili) {
            this.id = id;
            this.username = username;
            this.nome = nome;
            this.cognome = cognome;
            this.email = email;
            this.profili = profili;
        }
    }

    public static class CreateUtenteRequest {
        public String username;
        public String password;
        public String nome;
        public String cognome;
        public String email;
        public Set<String> profili;

        public CreateUtenteRequest() {
        }
    }

    public static class UpdateUtenteRequest {
        public String password;
        public String nome;
        public String cognome;
        public String email;
        public Set<String> profili;

        public UpdateUtenteRequest() {
        }
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
