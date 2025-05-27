package com.lepszasrednia.bugtracker.controller;

import com.lepszasrednia.bugtracker.repository.BugReportRepository;
import com.lepszasrednia.bugtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final BugReportRepository bugReportRepository;
    private final UserRepository userRepository;

    @Autowired
    public AdminController(BugReportRepository bugReportRepository,
                           UserRepository userRepository) {
        this.bugReportRepository = bugReportRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalUsers = userRepository.count();
        long totalBugs = bugReportRepository.count();

        long pendingBugs = bugReportRepository.countByActualStatus_NameIn(
                List.of("Open", "In Progress"));

        // Bugs created today
        LocalDate today = LocalDate.now();
        long todayBugs = bugReportRepository.countByCreatedAtAfter(
                today.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());

        Map<String, Object> stats = Map.of(
                "totalUsers", totalUsers,
                "totalBugs", totalBugs,
                "pendingBugs", pendingBugs,
                "todayBugs", todayBugs
        );

        return ResponseEntity.ok(stats);
    }
}

