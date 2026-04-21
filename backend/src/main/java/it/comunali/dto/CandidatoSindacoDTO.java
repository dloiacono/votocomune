package it.comunali.dto;

import java.util.List;

public class CandidatoSindacoDTO {
    public Long id;
    public String nome;
    public String cognome;
    public String foto;
    public List<ListaDTO> liste;

    public CandidatoSindacoDTO() {
    }

    public CandidatoSindacoDTO(Long id, String nome, String cognome, String foto, List<ListaDTO> liste) {
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.foto = foto;
        this.liste = liste;
    }

    public static class ListaDTO {
        public Long id;
        public Integer numero;
        public String nome;
        public String colore;

        public ListaDTO() {
        }

        public ListaDTO(Long id, Integer numero, String nome, String colore) {
            this.id = id;
            this.numero = numero;
            this.nome = nome;
            this.colore = colore;
        }
    }
}
