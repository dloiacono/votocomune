package it.comunali.dto;

import java.util.List;

public class VotiSezioneRequest {
    public Long sezioneId;
    public Integer votanti;
    public Integer schedeBianche;
    public Integer schedeNulle;
    public List<VotoListaRequest> votiListe;
    public List<PreferenzaRequest> preferenzeConsiglieri;

    public VotiSezioneRequest() {
    }

    public static class VotoListaRequest {
        public Long listaId;
        public Integer votiLista;
        public Integer votiSindaco;

        public VotoListaRequest() {
        }

        public VotoListaRequest(Long listaId, Integer votiLista, Integer votiSindaco) {
            this.listaId = listaId;
            this.votiLista = votiLista;
            this.votiSindaco = votiSindaco;
        }
    }

    public static class PreferenzaRequest {
        public Long consigliereId;
        public Integer preferenze;

        public PreferenzaRequest() {
        }

        public PreferenzaRequest(Long consigliereId, Integer preferenze) {
            this.consigliereId = consigliereId;
            this.preferenze = preferenze;
        }
    }
}
