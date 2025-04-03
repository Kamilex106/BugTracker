package com.lepszasrednia.bugtracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name="category")
public class Category {
    @Id
    @ColumnDefault("nextval('category_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Size(max=50)
    @Column(name="name", length=50)
    private String name;

    public Integer Category() { return id; }

    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public Integer getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
