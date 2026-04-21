package it.comunali.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "candidato_sindaco")
public class CandidatoSindaco extends PanacheEntity {

    @Column(nullable = false)
    public String nome;

    @Column(nullable = false)
    public String cognome;

    @Column
    public String foto;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "sindaco_liste",
        joinColumns = @JoinColumn(name = "sindaco_id"),
        inverseJoinColumns = @JoinColumn(name = "lista_id")
    )
    public Set<ListaElettorale> liste = new HashSet<>();
}
