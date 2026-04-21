package it.comunali.dto;

import java.util.List;

public class VotiSezioneDTO {
    public Long sezioneId;
    public Integer numero;
    public Integer votanti;
    public Integer schedeBianche;
    public Integer schedeNulle;
    public List<VotoListaDTO> votiListe;
    public List<PreferenzaConsigliereDTO> preferenzeConsiglieri;

    public VotiSezioneDTO() {
    }

    public static class VotoListaDTO {
        public Long listaId;
        public Integer numero;
        public String nome;
        public String colore;
        public Integer votiLista;
        public Integer votiSindaco;

        public VotoListaDTO() {
        }

        public VotoListaDTO(Long listaId, Integer numero, String nome, String colore, Integer votiLista, Integer votiSindaco) {
            this.listaId = listaId;
            this.numero = numero;
            this.nome = nome;
            this.colore = colore;
            this.votiLista = votiLista;
            this.votiSindaco = votiSindaco;
        }
    }

    public static class PreferenzaConsigliereDTO {
        public Long consigliereId;
        public String nome;
        public String cognome;
        public Long listaId;
        public String listaNome;
        public Integer preferenze;

        public PreferenzaConsigliereDTO() {
        }

        public PreferenzaConsigliereDTO(Long consigliereId, String nome, String cognome, Long listaId, String listaNome, Integer preferenze) {
            this.consigliereId = consigliereId;
            this.nome = nome;
            this.cognome = cognome;
            this.listaId = listaId;
            this.listaNome = listaNome;
            this.preferenze = preferenze;
        }
    }
}
