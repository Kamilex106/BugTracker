package com.lepszasrednia.bugtracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;

import java.util.ArrayList;
import java.util.Collection;

@Entity
@Table(name="users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Size(max = 50)
    @Column(name = "username", length = 50)
    private String username;

    @Size(max = 50)
    @Column(name = "email", length = 50)
    private String email;

//    @Size(max = 255)
//    @Column(name = "password", length = 255)
//    private String password;
    @Column(name = "okta_id", unique = true)
    private String oktaId;

    @ColumnDefault("true")
    @Column(name = "enabled")
    private Boolean enabled = false;


    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name="users_roles",
            joinColumns = @JoinColumn(name="user_id"),
            inverseJoinColumns = @JoinColumn(name="role_id"))
    private Collection<Roles> roles = new ArrayList<>();;

    public Users() {}

    public Users(String username, String email, String oktaId, Boolean enabled) {
        this.username = username;
        this.email = email;
        this.enabled = enabled;
        this.oktaId = oktaId;
    }

    public Users(String username, String email, String oktaId, Boolean enabled, Collection<Roles> roles) {
        this.username = username;
        this.email = email;
        this.enabled = enabled;
        this.roles = roles;
        this.oktaId = oktaId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOktaId() {
        return oktaId;
    }

    public void setOktaId(String oktaId) {
        this.oktaId = oktaId;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Collection<Roles> getRoles() {
        return roles;
    }

    public void setRoles(Collection<Roles> roles) {

        this.roles = roles != null ? roles : new ArrayList<>();
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", oktaId='" + oktaId + '\'' +
                ", enabled=" + enabled +
                ", roles=" + roles +
                '}';
    }
}
