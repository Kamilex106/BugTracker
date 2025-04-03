package com.lepszasrednia.bugtracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;


@Entity
@Table(name = "bug_report_log")
public class BugReportLog {
    @Id
    @ColumnDefault("nextval('bug_report_log_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "bug_report_id")
    private BugReport bugReport;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bug_status_id")
    private com.lepszasrednia.bugtracker.entity.BugStatus bugStatus;

    @Size(max = 255)
    @Column(name = "comment")
    private String comment;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "date")
    private Instant date;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BugReport getBugReport() {
        return bugReport;
    }

    public void setBugReport(BugReport bugReport) {
        this.bugReport = bugReport;
    }

    public com.lepszasrednia.bugtracker.entity.BugStatus getBugStatus() {
        return bugStatus;
    }

    public void setBugStatus(com.lepszasrednia.bugtracker.entity.BugStatus bugStatus) {
        this.bugStatus = bugStatus;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

}