package it.comunali.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "candidato_consigliere")
public class CandidatoConsigliere extends PanacheEntity {

    @Column(nullable = false)
    public String nome;

    @Column(nullable = false)
    public String cognome;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lista_id", nullable = false)
    public ListaElettorale lista;

    @Column(nullable = false)
    public Integer ordineLista;

    public static java.util.List<CandidatoConsigliere> findByLista(ListaElettorale lista) {
        return find("lista", lista).list();
    }
}
