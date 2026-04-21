package it.comunali.resource;

import it.comunali.dto.CandidatoSindacoDTO;
import it.comunali.model.CandidatoSindaco;
import it.comunali.model.ListaElettorale;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Path("/api/sindaci")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SindacoResource {

    @GET
    @RolesAllowed("**")
    public Response getAll() {
        List<CandidatoSindaco> sindaci = CandidatoSindaco.listAll();
        List<CandidatoSindacoDTO> dtos = sindaci.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return Response.ok(dtos).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed("**")
    public Response getById(@PathParam("id") Long id) {
        CandidatoSindaco sindaco = CandidatoSindaco.findById(id);
        if (sindaco == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Candidato sindaco non trovato"))
                    .build();
        }
        return Response.ok(toDTO(sindaco)).build();
    }

    @POST
    @Transactional
    @RolesAllowed({"ADMIN", "GESTORE_CANDIDATI"})
    public Response create(CreateSindacoRequest request) {
        if (request.nome == null || request.cognome == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Nome e cognome sono obbligatori"))
                    .build();
        }

        CandidatoSindaco sindaco = new CandidatoSindaco();
        sindaco.nome = request.nome;
        sindaco.cognome = request.cognome;
        sindaco.foto = request.foto;

        if (request.listeIds != null && !request.listeIds.isEmpty()) {
            for (Long listaId : request.listeIds) {
                ListaElettorale lista = ListaElettorale.findById(listaId);
                if (lista == null) {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(new ErrorResponse("Lista con ID " + listaId + " non trovata"))
                            .build();
                }
                sindaco.liste.add(lista);
            }
        }

        sindaco.persist();
        return Response.status(Response.Status.CREATED).entity(toDTO(sindaco)).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed({"ADMIN", "GESTORE_CANDIDATI"})
    public Response update(@PathParam("id") Long id, CreateSindacoRequest request) {
        CandidatoSindaco sindaco = CandidatoSindaco.findById(id);
        if (sindaco == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Candidato sindaco non trovato"))
                    .build();
        }

        if (request.nome != null) {
            sindaco.nome = request.nome;
        }
        if (request.cognome != null) {
            sindaco.cognome = request.cognome;
        }
        if (request.foto != null) {
            sindaco.foto = request.foto;
        }

        if (request.listeIds != null) {
            sindaco.liste.clear();
            for (Long listaId : request.listeIds) {
                ListaElettorale lista = ListaElettorale.findById(listaId);
                if (lista == null) {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(new ErrorResponse("Lista con ID " + listaId + " non trovata"))
                            .build();
                }
                sindaco.liste.add(lista);
            }
        }

        sindaco.persist();
        return Response.ok(toDTO(sindaco)).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed({"ADMIN", "GESTORE_CANDIDATI"})
    public Response delete(@PathParam("id") Long id) {
        CandidatoSindaco sindaco = CandidatoSindaco.findById(id);
        if (sindaco == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Candidato sindaco non trovato"))
                    .build();
        }

        sindaco.delete();
        return Response.noContent().build();
    }

    private CandidatoSindacoDTO toDTO(CandidatoSindaco sindaco) {
        List<CandidatoSindacoDTO.ListaDTO> listeDTOs = sindaco.liste.stream()
                .map(l -> new CandidatoSindacoDTO.ListaDTO(l.id, l.numero, l.nome, l.colore))
                .collect(Collectors.toList());

        return new CandidatoSindacoDTO(sindaco.id, sindaco.nome, sindaco.cognome, sindaco.foto, listeDTOs);
    }

    public static class CreateSindacoRequest {
        public String nome;
        public String cognome;
        public String foto;
        public List<Long> listeIds;

        public CreateSindacoRequest() {
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
