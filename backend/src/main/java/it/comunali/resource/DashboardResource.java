package it.comunali.resource;

import it.comunali.dto.DashboardDTO;
import it.comunali.model.*;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.*;
import java.util.stream.Collectors;

@Path("/api/dashboard")
@Produces(MediaType.APPLICATION_JSON)
public class DashboardResource {

    @GET
    @Path("/riepilogo")
    @RolesAllowed("**")
    public Response getRiepilogo() {
        List<Sezione> sezioni = Sezione.listAll();
        List<VotoSezione> votiListe = VotoSezione.listAll();

        int sezioniTotali = sezioni.size();
        int sezioniScrutinate = (int) sezioni.stream().filter(s -> s.scrutinata).count();
        int votantiTotali = votiListe.stream().map(v -> v.votanti).distinct().mapToInt(Integer::intValue).sum();
        int aventiDirittoTotali = sezioni.stream().mapToInt(s -> s.aventiDiritto).sum();
        int schedeBiancheTotali = votiListe.stream().map(v -> v.schedeBianche).distinct().mapToInt(Integer::intValue).sum();
        int schedeNulleTotali = votiListe.stream().map(v -> v.schedeNulle).distinct().mapToInt(Integer::intValue).sum();

        DashboardDTO.RiepilogoDTO riepilogo = new DashboardDTO.RiepilogoDTO(
                sezioniTotali,
                sezioniScrutinate,
                votantiTotali,
                aventiDirittoTotali,
                schedeBiancheTotali,
                schedeNulleTotali
        );

        return Response.ok(riepilogo).build();
    }

    @GET
    @Path("/sindaci")
    @RolesAllowed("**")
    public Response getRisultatiSindaci() {
        List<CandidatoSindaco> sindaci = CandidatoSindaco.listAll();
        List<VotoSezione> votiListe = VotoSezione.listAll();

        int votiTotaliEspressi = votiListe.stream().mapToInt(v -> v.votiSindaco).sum();

        List<DashboardDTO.SindacoRisultatiDTO> risultati = sindaci.stream().map(sindaco -> {
            int votiSindaco = 0;
            for (ListaElettorale lista : sindaco.liste) {
                votiSindaco += votiListe.stream()
                        .filter(v -> v.lista.id.equals(lista.id))
                        .mapToInt(v -> v.votiSindaco)
                        .sum();
            }

            double percentuale = votiTotaliEspressi > 0 ? (double) votiSindaco / votiTotaliEspressi * 100 : 0;

            List<DashboardDTO.SindacoRisultatiDTO.ListaRisultatiDTO> listeRisultati = sindaco.liste.stream()
                    .map(lista -> {
                        int votiLista = votiListe.stream()
                                .filter(v -> v.lista.id.equals(lista.id))
                                .mapToInt(v -> v.votiLista)
                                .sum();
                        return new DashboardDTO.SindacoRisultatiDTO.ListaRisultatiDTO(lista.id, lista.nome, votiLista);
                    })
                    .collect(Collectors.toList());

            return new DashboardDTO.SindacoRisultatiDTO(
                    sindaco.id,
                    sindaco.nome,
                    sindaco.cognome,
                    votiSindaco,
                    percentuale,
                    listeRisultati
            );
        }).collect(Collectors.toList());

        // Ordina per voti decrescenti
        risultati.sort((a, b) -> Integer.compare(b.votiTotali, a.votiTotali));

        return Response.ok(risultati).build();
    }

    @GET
    @Path("/liste")
    @RolesAllowed("**")
    public Response getRisultatiListe() {
        List<ListaElettorale> liste = ListaElettorale.listAll();
        List<VotoSezione> votiListe = VotoSezione.listAll();

        int votiTotaliEspressi = votiListe.stream().mapToInt(v -> v.votiLista).sum();

        List<DashboardDTO.ListaRisultatiDTO> risultati = liste.stream().map(lista -> {
            int votiLista = votiListe.stream()
                    .filter(v -> v.lista.id.equals(lista.id))
                    .mapToInt(v -> v.votiLista)
                    .sum();

            double percentuale = votiTotaliEspressi > 0 ? (double) votiLista / votiTotaliEspressi * 100 : 0;

            return new DashboardDTO.ListaRisultatiDTO(
                    lista.id,
                    lista.numero,
                    lista.nome,
                    lista.colore,
                    votiLista,
                    percentuale
            );
        }).collect(Collectors.toList());

        // Ordina per voti decrescenti
        risultati.sort((a, b) -> Integer.compare(b.votiTotali, a.votiTotali));

        return Response.ok(risultati).build();
    }

    @GET
    @Path("/sezioni")
    @RolesAllowed("**")
    public Response getRisultatiSezioni() {
        List<Sezione> sezioni = Sezione.listAll();
        Map<Long, Integer> votantiPerSezione = new HashMap<>();
        List<VotoSezione> votiListe = VotoSezione.listAll();

        // Calcola votanti per sezione
        for (VotoSezione v : votiListe) {
            votantiPerSezione.put(v.sezione.id, v.votanti);
        }

        List<DashboardDTO.SezioneRisultatiDTO> risultati = sezioni.stream()
                .map(sezione -> new DashboardDTO.SezioneRisultatiDTO(
                        sezione.id,
                        sezione.numero,
                        sezione.nome,
                        sezione.scrutinata,
                        votantiPerSezione.getOrDefault(sezione.id, 0),
                        sezione.aventiDiritto
                ))
                .collect(Collectors.toList());

        // Ordina per numero sezione
        risultati.sort((a, b) -> Integer.compare(a.numero, b.numero));

        return Response.ok(risultati).build();
    }

    @GET
    @Path("/consiglieri")
    @RolesAllowed("**")
    public Response getRisultatiConsiglieri() {
        List<CandidatoConsigliere> consiglieri = CandidatoConsigliere.listAll();
        List<PreferenzaConsigliere> preferenze = PreferenzaConsigliere.listAll();

        Map<Long, Integer> preferenzeTotaliPerConsigliere = new HashMap<>();
        for (PreferenzaConsigliere p : preferenze) {
            preferenzeTotaliPerConsigliere.merge(p.consigliere.id, p.preferenze, Integer::sum);
        }

        List<DashboardDTO.ConsigliereRisultatiDTO> risultati = consiglieri.stream()
                .map(consigliere -> {
                    DashboardDTO.ConsigliereRisultatiDTO.ListaInfoDTO listaInfo =
                            new DashboardDTO.ConsigliereRisultatiDTO.ListaInfoDTO(
                                    consigliere.lista.id,
                                    consigliere.lista.nome,
                                    consigliere.lista.colore
                            );

                    return new DashboardDTO.ConsigliereRisultatiDTO(
                            consigliere.id,
                            consigliere.nome,
                            consigliere.cognome,
                            listaInfo,
                            preferenzeTotaliPerConsigliere.getOrDefault(consigliere.id, 0)
                    );
                })
                .collect(Collectors.toList());

        // Ordina per preferenze decrescenti
        risultati.sort((a, b) -> Integer.compare(b.preferenzeTotali, a.preferenzeTotali));

        return Response.ok(risultati).build();
    }
}
