package it.comunali.dto;

import java.util.List;

public class DashboardDTO {

    public static class RiepilogoDTO {
        public Integer sezioniTotali;
        public Integer sezioniScrutinate;
        public Integer votantiTotali;
        public Integer aventiDirittoTotali;
        public Integer schedeBiancheTotali;
        public Integer schedeNulleTotali;

        public RiepilogoDTO() {
        }

        public RiepilogoDTO(Integer sezioniTotali, Integer sezioniScrutinate, Integer votantiTotali,
                           Integer aventiDirittoTotali, Integer schedeBiancheTotali, Integer schedeNulleTotali) {
            this.sezioniTotali = sezioniTotali;
            this.sezioniScrutinate = sezioniScrutinate;
            this.votantiTotali = votantiTotali;
            this.aventiDirittoTotali = aventiDirittoTotali;
            this.schedeBiancheTotali = schedeBiancheTotali;
            this.schedeNulleTotali = schedeNulleTotali;
        }
    }

    public static class SindacoRisultatiDTO {
        public Long sindacoId;
        public String nome;
        public String cognome;
        public Integer votiTotali;
        public Double percentuale;
        public List<ListaRisultatiDTO> liste;

        public SindacoRisultatiDTO() {
        }

        public SindacoRisultatiDTO(Long sindacoId, String nome, String cognome, Integer votiTotali, Double percentuale, List<ListaRisultatiDTO> liste) {
            this.sindacoId = sindacoId;
            this.nome = nome;
            this.cognome = cognome;
            this.votiTotali = votiTotali;
            this.percentuale = percentuale;
            this.liste = liste;
        }

        public static class ListaRisultatiDTO {
            public Long listaId;
            public String nome;
            public Integer votiLista;

            public ListaRisultatiDTO() {
            }

            public ListaRisultatiDTO(Long listaId, String nome, Integer votiLista) {
                this.listaId = listaId;
                this.nome = nome;
                this.votiLista = votiLista;
            }
        }
    }

    public static class ListaRisultatiDTO {
        public Long listaId;
        public Integer numero;
        public String nome;
        public String colore;
        public Integer votiTotali;
        public Double percentuale;

        public ListaRisultatiDTO() {
        }

        public ListaRisultatiDTO(Long listaId, Integer numero, String nome, String colore, Integer votiTotali, Double percentuale) {
            this.listaId = listaId;
            this.numero = numero;
            this.nome = nome;
            this.colore = colore;
            this.votiTotali = votiTotali;
            this.percentuale = percentuale;
        }
    }

    public static class SezioneRisultatiDTO {
        public Long sezioneId;
        public Integer numero;
        public String nome;
        public Boolean scrutinata;
        public Integer votanti;
        public Integer aventiDiritto;

        public SezioneRisultatiDTO() {
        }

        public SezioneRisultatiDTO(Long sezioneId, Integer numero, String nome, Boolean scrutinata, Integer votanti, Integer aventiDiritto) {
            this.sezioneId = sezioneId;
            this.numero = numero;
            this.nome = nome;
            this.scrutinata = scrutinata;
            this.votanti = votanti;
            this.aventiDiritto = aventiDiritto;
        }
    }

    public static class ConsigliereRisultatiDTO {
        public Long consigliereId;
        public String nome;
        public String cognome;
        public ListaInfoDTO lista;
        public Integer preferenzeTotali;

        public ConsigliereRisultatiDTO() {
        }

        public ConsigliereRisultatiDTO(Long consigliereId, String nome, String cognome, ListaInfoDTO lista, Integer preferenzeTotali) {
            this.consigliereId = consigliereId;
            this.nome = nome;
            this.cognome = cognome;
            this.lista = lista;
            this.preferenzeTotali = preferenzeTotali;
        }

        public static class ListaInfoDTO {
            public Long id;
            public String nome;
            public String colore;

            public ListaInfoDTO() {
            }

            public ListaInfoDTO(Long id, String nome, String colore) {
                this.id = id;
                this.nome = nome;
                this.colore = colore;
            }
        }
    }
}
