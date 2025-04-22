package com.lepszasrednia.bugtracker.repository;

import com.lepszasrednia.bugtracker.entity.BugReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
@Repository
public interface BugReportRepository extends JpaRepository<BugReport, Integer> {

    Page<BugReport> findByTitleContaining(@Param("title") String title, Pageable pageable);
}
