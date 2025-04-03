package com.lepszasrednia.bugtracker.repository;

import com.lepszasrednia.bugtracker.entity.BugReportLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
@Repository
public interface BugReportLogRepository extends JpaRepository<BugReportLog, Integer> {

    Page<BugReportLog> findByCommentContaining(@Param("comment") String comment, Pageable pageable);

}


