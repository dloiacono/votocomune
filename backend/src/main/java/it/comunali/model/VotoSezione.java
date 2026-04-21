package it.comunali.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "voto_sezione", uniqueConstraints = @UniqueConstraint(columnNames = {"sezione_id", "lista_id"}))
public class VotoSezione extends PanacheEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sezione_id", nullable = false)
    public Sezione sezione;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lista_id", nullable = false)
    public ListaElettorale lista;

    @Column(nullable = false)
    public Integer votiLista;

    @Column(nullable = false)
    public Integer votiSindaco;

    @Column(nullable = false)
    public Integer schedeBianche;

    @Column(nullable = false)
    public Integer schedeNulle;

    @Column(nullable = false)
    public Integer votanti;

    public static VotoSezione findBySezioneAndLista(Sezione sezione, ListaElettorale lista) {
        return find("sezione = ?1 and lista = ?2", sezione, lista).firstResult();
    }

    public static java.util.List<VotoSezione> findBySezione(Sezione sezione) {
        return find("sezione", sezione).list();
    }
}
