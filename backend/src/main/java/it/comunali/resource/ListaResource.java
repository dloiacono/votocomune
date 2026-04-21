package it.comunali.resource;

import it.comunali.model.ListaElettorale;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/liste")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ListaResource {

    @GET
    @RolesAllowed("**")
    public Response getAll() {
        List<ListaElettorale> liste = ListaElettorale.listAll();
        return Response.ok(liste).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed("**")
    public Response getById(@PathParam("id") Long id) {
        ListaElettorale lista = ListaElettorale.findById(id);
        if (lista == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Lista non trovata"))
                    .build();
        }
        return Response.ok(lista).build();
    }

    @POST
    @Transactional
    @RolesAllowed({"ADMIN", "GESTORE_LISTE"})
    public Response create(ListaElettorale lista) {
        if (lista.numero == null || lista.nome == null || lista.simbolo == null || lista.colore == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Campi obbligatori mancanti"))
                    .build();
        }

        if (ListaElettorale.findByNumero(lista.numero) != null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Una lista con questo numero esiste già"))
                    .build();
        }

        lista.persist();
        return Response.status(Response.Status.CREATED).entity(lista).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed({"ADMIN", "GESTORE_LISTE"})
    public Response update(@PathParam("id") Long id, ListaElettorale listaUpdate) {
        ListaElettorale lista = ListaElettorale.findById(id);
        if (lista == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Lista non trovata"))
                    .build();
        }

        if (listaUpdate.numero != null) {
            ListaElettorale existing = ListaElettorale.findByNumero(listaUpdate.numero);
            if (existing != null && !existing.id.equals(id)) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse("Una lista con questo numero esiste già"))
                        .build();
            }
            lista.numero = listaUpdate.numero;
        }
        if (listaUpdate.nome != null) {
            lista.nome = listaUpdate.nome;
        }
        if (listaUpdate.simbolo != null) {
            lista.simbolo = listaUpdate.simbolo;
        }
        if (listaUpdate.colore != null) {
            lista.colore = listaUpdate.colore;
        }

        lista.persist();
        return Response.ok(lista).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed({"ADMIN", "GESTORE_LISTE"})
    public Response delete(@PathParam("id") Long id) {
        ListaElettorale lista = ListaElettorale.findById(id);
        if (lista == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Lista non trovata"))
                    .build();
        }

        lista.delete();
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
