package it.comunali.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "sezione", uniqueConstraints = @UniqueConstraint(columnNames = "numero"))
public class Sezione extends PanacheEntity {

    @Column(nullable = false, unique = true)
    public Integer numero;

    @Column(nullable = false)
    public String nome;

    @Column(nullable = false)
    public Integer aventiDiritto;

    @Column(nullable = false)
    public Boolean scrutinata = false;

    public static Sezione findByNumero(Integer numero) {
        return find("numero", numero).firstResult();
    }
}
