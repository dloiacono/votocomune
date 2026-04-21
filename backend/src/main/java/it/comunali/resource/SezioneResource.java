package it.comunali.resource;

import it.comunali.model.Sezione;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/sezioni")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SezioneResource {

    @GET
    @RolesAllowed("**")
    public Response getAll() {
        List<Sezione> sezioni = Sezione.listAll();
        return Response.ok(sezioni).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed("**")
    public Response getById(@PathParam("id") Long id) {
        Sezione sezione = Sezione.findById(id);
        if (sezione == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Sezione non trovata"))
                    .build();
        }
        return Response.ok(sezione).build();
    }

    @POST
    @Transactional
    @RolesAllowed("ADMIN")
    public Response create(Sezione sezione) {
        if (sezione.numero == null || sezione.nome == null || sezione.aventiDiritto == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Campi obbligatori mancanti"))
                    .build();
        }

        if (Sezione.findByNumero(sezione.numero) != null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Una sezione con questo numero esiste già"))
                    .build();
        }

        sezione.persist();
        return Response.status(Response.Status.CREATED).entity(sezione).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed("ADMIN")
    public Response update(@PathParam("id") Long id, Sezione sezioneUpdate) {
        Sezione sezione = Sezione.findById(id);
        if (sezione == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Sezione non trovata"))
                    .build();
        }

        if (sezioneUpdate.numero != null) {
            Sezione existing = Sezione.findByNumero(sezioneUpdate.numero);
            if (existing != null && !existing.id.equals(id)) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse("Una sezione con questo numero esiste già"))
                        .build();
            }
            sezione.numero = sezioneUpdate.numero;
        }
        if (sezioneUpdate.nome != null) {
            sezione.nome = sezioneUpdate.nome;
        }
        if (sezioneUpdate.aventiDiritto != null) {
            sezione.aventiDiritto = sezioneUpdate.aventiDiritto;
        }
        if (sezioneUpdate.scrutinata != null) {
            sezione.scrutinata = sezioneUpdate.scrutinata;
        }

        sezione.persist();
        return Response.ok(sezione).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed("ADMIN")
    public Response delete(@PathParam("id") Long id) {
        Sezione sezione = Sezione.findById(id);
        if (sezione == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Sezione non trovata"))
                    .build();
        }

        sezione.delete();
        return Response.noContent().build();
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
