package it.comunali.resource;

import it.comunali.model.CandidatoConsigliere;
import it.comunali.model.ListaElettorale;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/consiglieri")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ConsigliereResource {

    @GET
    @RolesAllowed("**")
    public Response getAll(@QueryParam("listaId") Long listaId) {
        List<CandidatoConsigliere> consiglieri;

        if (listaId != null) {
            ListaElettorale lista = ListaElettorale.findById(listaId);
            if (lista == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Lista non trovata"))
                        .build();
            }
            consiglieri = CandidatoConsigliere.findByLista(lista);
        } else {
            consiglieri = CandidatoConsigliere.listAll();
        }

        return Response.ok(consiglieri).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed("**")
    public Response getById(@PathParam("id") Long id) {
        CandidatoConsigliere consigliere = CandidatoConsigliere.findById(id);
        if (consigliere == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Consigliere non trovato"))
                    .build();
        }
        return Response.ok(consigliere).build();
    }

    @POST
    @Transactional
    @RolesAllowed({"ADMIN", "GESTORE_CANDIDATI"})
    public Response create(CreateConsigliereRequest request) {
        if (request.nome == null || request.cognome == null || request.listaId == null || request.ordineLista == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Campi obbligatori mancanti"))
                    .build();
        }

        ListaElettorale lista = ListaElettorale.findById(request.listaId);
        if (lista == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Lista non trovata"))
                    .build();
        }

        CandidatoConsigliere consigliere = new CandidatoConsigliere();
        consigliere.nome = request.nome;
        consigliere.cognome = request.cognome;
        consigliere.lista = lista;
        consigliere.ordineLista = request.ordineLista;

        consigliere.persist();
        return Response.status(Response.Status.CREATED).entity(consigliere).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed({"ADMIN", "GESTORE_CANDIDATI"})
    public Response update(@PathParam("id") Long id, CreateConsigliereRequest request) {
        CandidatoConsigliere consigliere = CandidatoConsigliere.findById(id);
        if (consigliere == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Consigliere non trovato"))
                    .build();
        }

        if (request.nome != null) {
            consigliere.nome = request.nome;
        }
        if (request.cognome != null) {
            consigliere.cognome = request.cognome;
        }
        if (request.ordineLista != null) {
            consigliere.ordineLista = request.ordineLista;
        }
        if (request.listaId != null) {
            ListaElettorale lista = ListaElettorale.findById(request.listaId);
            if (lista == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse("Lista non trovata"))
                        .build();
            }
            consigliere.lista = lista;
        }

        consigliere.persist();
        return Response.ok(consigliere).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed({"ADMIN", "GESTORE_CANDIDATI"})
    public Response delete(@PathParam("id") Long id) {
        CandidatoConsigliere consigliere = CandidatoConsigliere.findById(id);
        if (consigliere == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Consigliere non trovato"))
                    .build();
        }

        consigliere.delete();
        return Response.noContent().build();
    }

    public static class CreateConsigliereRequest {
        public String nome;
        public String cognome;
        public Long listaId;
        public Integer ordineLista;

        public CreateConsigliereRequest() {
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
