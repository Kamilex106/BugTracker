package com.lepszasrednia.bugtracker.repository;

import com.lepszasrednia.bugtracker.entity.BugReportComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@Repository
public interface BugReportCommentRepository extends JpaRepository<BugReportComment, Integer> {
    List<BugReportComment> findBugReportCommentByBugReport_Id(Integer bugReportId);

    List<BugReportComment> findBugReportCommentsByBugReport_Id(Integer bugReportId);
}
