package it.comunali.resource;

import it.comunali.dto.VotiSezioneDTO;
import it.comunali.dto.VotiSezioneRequest;
import it.comunali.model.*;
import jakarta.annotation.security.RolesAllowed;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Path("/api/voti")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class VotiResource {

    @GET
    @Path("/sezione/{sezioneId}")
    @RolesAllowed("**")
    public Response getVotiSezione(@PathParam("sezioneId") Long sezioneId) {
        Sezione sezione = Sezione.findById(sezioneId);
        if (sezione == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Sezione non trovata"))
                    .build();
        }

        List<VotoSezione> votiListe = VotoSezione.findBySezione(sezione);
        List<PreferenzaConsigliere> preferenzeConsiglieri = PreferenzaConsigliere.findBySezione(sezione);

        VotiSezioneDTO dto = new VotiSezioneDTO();
        dto.sezioneId = sezione.id;
        dto.numero = sezione.numero;

        // Calcola votanti e schede dal primo voto (per evitare duplicazioni)
        if (!votiListe.isEmpty()) {
            VotoSezione firstVoto = votiListe.get(0);
            dto.votanti = firstVoto.votanti;
            dto.schedeBianche = firstVoto.schedeBianche;
            dto.schedeNulle = firstVoto.schedeNulle;
        } else {
            dto.votanti = 0;
            dto.schedeBianche = 0;
            dto.schedeNulle = 0;
        }

        // Voti per lista
        dto.votiListe = votiListe.stream()
                .map(v -> new VotiSezioneDTO.VotoListaDTO(
                        v.lista.id,
                        v.lista.numero,
                        v.lista.nome,
                        v.lista.colore,
                        v.votiLista,
                        v.votiSindaco
                ))
                .collect(Collectors.toList());

        // Preferenze consiglieri
        dto.preferenzeConsiglieri = preferenzeConsiglieri.stream()
                .map(p -> new VotiSezioneDTO.PreferenzaConsigliereDTO(
                        p.consigliere.id,
                        p.consigliere.nome,
                        p.consigliere.cognome,
                        p.consigliere.lista.id,
                        p.consigliere.lista.nome,
                        p.preferenze
                ))
                .collect(Collectors.toList());

        return Response.ok(dto).build();
    }

    @POST
    @Path("/sezione")
    @Transactional
    @RolesAllowed({"ADMIN", "GESTORE_VOTI"})
    public Response saveVotiSezione(VotiSezioneRequest request) {
        if (request.sezioneId == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("sezioneId è obbligatorio"))
                    .build();
        }

        Sezione sezione = Sezione.findById(request.sezioneId);
        if (sezione == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Sezione non trovata"))
                    .build();
        }

        // Salva voti per lista
        if (request.votiListe != null) {
            for (int i = 0; i < request.votiListe.size(); i++) {
                VotiSezioneRequest.VotoListaRequest votoListaReq = request.votiListe.get(i);
                ListaElettorale lista = ListaElettorale.findById(votoListaReq.listaId);
                if (lista == null) {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(new ErrorResponse("Lista con ID " + votoListaReq.listaId + " non trovata"))
                            .build();
                }

                VotoSezione votoSezione = VotoSezione.findBySezioneAndLista(sezione, lista);
                if (votoSezione == null) {
                    votoSezione = new VotoSezione();
                    votoSezione.sezione = sezione;
                    votoSezione.lista = lista;
                }

                votoSezione.votiLista = votoListaReq.votiLista != null ? votoListaReq.votiLista : 0;
                votoSezione.votiSindaco = votoListaReq.votiSindaco != null ? votoListaReq.votiSindaco : 0;

                if (votoSezione.votiLista < 0 || votoSezione.votiSindaco < 0) {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(new ErrorResponse("I voti non possono essere negativi"))
                            .build();
                }

                // Salva metadati votazione solo nella prima lista (per evitare duplicazione)
                if (i == 0) {
                    votoSezione.votanti = request.votanti != null ? request.votanti : 0;
                    votoSezione.schedeBianche = request.schedeBianche != null ? request.schedeBianche : 0;
                    votoSezione.schedeNulle = request.schedeNulle != null ? request.schedeNulle : 0;
                } else {
                    // Prendi i valori dalla prima lista
                    VotoSezione firstVoto = VotoSezione.findBySezioneAndLista(sezione, request.votiListe.get(0).listaId != null ? ListaElettorale.findById(request.votiListe.get(0).listaId) : null);
                    if (firstVoto != null) {
                        votoSezione.votanti = firstVoto.votanti;
                        votoSezione.schedeBianche = firstVoto.schedeBianche;
                        votoSezione.schedeNulle = firstVoto.schedeNulle;
                    }
                }

                votoSezione.persist();
            }
        }

        // Salva preferenze consiglieri
        if (request.preferenzeConsiglieri != null) {
            for (VotiSezioneRequest.PreferenzaRequest prefReq : request.preferenzeConsiglieri) {
                CandidatoConsigliere consigliere = CandidatoConsigliere.findById(prefReq.consigliereId);
                if (consigliere == null) {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(new ErrorResponse("Consigliere con ID " + prefReq.consigliereId + " non trovato"))
                            .build();
                }

                PreferenzaConsigliere preferenza = PreferenzaConsigliere.findBySezioneAndConsigliere(sezione, consigliere);
                if (preferenza == null) {
                    preferenza = new PreferenzaConsigliere();
                    preferenza.sezione = sezione;
                    preferenza.consigliere = consigliere;
                }

                preferenza.preferenze = prefReq.preferenze;
                preferenza.persist();
            }
        }

        // Marca sezione come scrutinata
        sezione.scrutinata = true;
        sezione.persist();

        return Response.ok(new SuccessResponse("Voti salvati correttamente")).build();
    }

    @GET
    @Path("/stato")
    @RolesAllowed("**")
    public Response getStatoSezioni() {
        List<Sezione> sezioni = Sezione.listAll();
        List<StatoSezioneDTO> risultato = sezioni.stream()
                .map(s -> new StatoSezioneDTO(s.id, s.numero, s.nome, s.scrutinata))
                .collect(Collectors.toList());
        return Response.ok(risultato).build();
    }

    public static class StatoSezioneDTO {
        public Long sezioneId;
        public Integer numero;
        public String nome;
        public Boolean scrutinata;

        public StatoSezioneDTO() {
        }

        public StatoSezioneDTO(Long sezioneId, Integer numero, String nome, Boolean scrutinata) {
            this.sezioneId = sezioneId;
            this.numero = numero;
            this.nome = nome;
            this.scrutinata = scrutinata;
        }
    }

    public static class SuccessResponse {
        public String message;

        public SuccessResponse() {
        }

        public SuccessResponse(String message) {
            this.message = message;
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
