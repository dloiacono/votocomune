package it.comunali.model;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "utente")
public class Utente extends PanacheEntity {

    @Column(nullable = false, unique = true)
    public String username;

    @Column(nullable = false)
    public String passwordHash;

    @Column(nullable = false)
    public String nome;

    @Column(nullable = false)
    public String cognome;

    @Column(nullable = false)
    public String email;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "utente_profili", joinColumns = @JoinColumn(name = "utente_id"))
    @Column(name = "profilo")
    public Set<String> profili = new HashSet<>();

    public static Utente findByUsername(String username) {
        return find("username", username).firstResult();
    }

    public boolean verifyPassword(String password) {
        return BcryptUtil.matches(password, this.passwordHash);
    }

    public static void setPasswordHash(Utente utente, String password) {
        utente.passwordHash = BcryptUtil.bcryptHash(password);
    }
}
