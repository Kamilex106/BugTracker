package com.lepszasrednia.bugtracker.repository;

import com.lepszasrednia.bugtracker.entity.BugReport;
import com.lepszasrednia.bugtracker.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.Instant;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@Repository
public interface BugReportRepository extends JpaRepository<BugReport, Integer> {

    Page<BugReport> findByTitleContaining(@Param("title") String title, Pageable pageable);

    List<BugReport> findAllByUser(Users user);

    @RestResource(path = "byUserPaged")
    Page<BugReport> findByUser(Users user, Pageable pageable);

    List<BugReport> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String title, String description);

    List<BugReport> findByUserAndTitleContainingIgnoreCaseOrUserAndDescriptionContainingIgnoreCase(
            Users user1, String title, Users user2, String description);

    long countByActualStatus_NameIn(List<String> statusNames);

    long countByCreatedAtAfter(Instant date);
}
