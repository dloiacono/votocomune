package it.comunali.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "preferenza_consigliere", uniqueConstraints = @UniqueConstraint(columnNames = {"sezione_id", "consigliere_id"}))
public class PreferenzaConsigliere extends PanacheEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sezione_id", nullable = false)
    public Sezione sezione;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "consigliere_id", nullable = false)
    public CandidatoConsigliere consigliere;

    @Column(nullable = false)
    public Integer preferenze;

    public static PreferenzaConsigliere findBySezioneAndConsigliere(Sezione sezione, CandidatoConsigliere consigliere) {
        return find("sezione = ?1 and consigliere = ?2", sezione, consigliere).firstResult();
    }

    public static java.util.List<PreferenzaConsigliere> findBySezione(Sezione sezione) {
        return find("sezione", sezione).list();
    }
}
