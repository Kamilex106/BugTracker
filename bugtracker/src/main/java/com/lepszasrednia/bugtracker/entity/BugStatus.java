package com.lepszasrednia.bugtracker.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "bug_status")
public class BugStatus {
    @Id
    @ColumnDefault("nextval('status_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Size(max = 20)
    @Column(name = "name", length = 20)
    private String name;

    @JsonCreator
    public BugStatus(@JsonProperty("id") Integer id) {
        this.id = id;
    }

    // Default constructor (required by JPA)
    public BugStatus() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "BugStatus{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}