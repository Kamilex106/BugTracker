package com.lepszasrednia.bugtracker.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "bug_assignment")
public class BugAssignment {
    @Id
    @ColumnDefault("nextval('bug_assignment_id_seq')")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "bug_report_id")
    private com.lepszasrednia.bugtracker.entity.BugReport bugReport;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Users employee;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public com.lepszasrednia.bugtracker.entity.BugReport getBugReport() {
        return bugReport;
    }

    public void setBugReport(com.lepszasrednia.bugtracker.entity.BugReport bugReport) {
        this.bugReport = bugReport;
    }

    public Users getEmployee() {
        return employee;
    }

    public void setEmployee(Users employee) {
        this.employee = employee;
    }

}