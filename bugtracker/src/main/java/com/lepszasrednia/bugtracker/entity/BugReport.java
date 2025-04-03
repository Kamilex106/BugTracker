package com.lepszasrednia.bugtracker.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "bug_report")
public class BugReport {
    @Id
    @ColumnDefault("nextval('bug_report_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Size(max = 100)
    @Column(name = "title", length = 100)
    private String title;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @Size(max = 10)
    @Column(name = "priority", length = 10)
    private String priority;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "actual_bug_status_id")
    private com.lepszasrednia.bugtracker.entity.BugStatus actualStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    @JsonProperty("category")
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER) // LAZY
    @JoinColumn(name = "user_id")
    private Users user;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime createdAt;
    // private Date createdAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public com.lepszasrednia.bugtracker.entity.BugStatus getActualStatus() {
        return actualStatus;
    }

    public void setActualStatus(com.lepszasrednia.bugtracker.entity.BugStatus actualStatus) {
        this.actualStatus = actualStatus;
    }

    public com.lepszasrednia.bugtracker.entity.Category getCategory() {
        return category;
    }

    public void setCategory(com.lepszasrednia.bugtracker.entity.Category category) {
        this.category = category;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}