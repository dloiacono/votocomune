package it.comunali.auth.dto;

import java.util.Set;

public class LoginResponse {
    public String token;
    public UtenteDTO utente;

    public LoginResponse() {
    }

    public LoginResponse(String token, UtenteDTO utente) {
        this.token = token;
        this.utente = utente;
    }

    public static class UtenteDTO {
        public Long id;
        public String username;
        public String nome;
        public String cognome;
        public Set<String> profili;

        public UtenteDTO() {
        }

        public UtenteDTO(Long id, String username, String nome, String cognome, Set<String> profili) {
            this.id = id;
            this.username = username;
            this.nome = nome;
            this.cognome = cognome;
            this.profili = profili;
        }
    }
}
