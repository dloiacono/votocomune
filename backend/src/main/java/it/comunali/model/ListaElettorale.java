package it.comunali.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "lista_elettorale", uniqueConstraints = @UniqueConstraint(columnNames = "numero"))
public class ListaElettorale extends PanacheEntity {

    @Column(nullable = false)
    public Integer numero;

    @Column(nullable = false)
    public String nome;

    @Column(nullable = false)
    public String simbolo;

    @Column(nullable = false)
    public String colore; // hex color string

    public static ListaElettorale findByNumero(Integer numero) {
        return find("numero", numero).firstResult();
    }
}
