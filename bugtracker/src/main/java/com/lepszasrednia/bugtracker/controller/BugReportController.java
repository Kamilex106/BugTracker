package com.lepszasrednia.bugtracker.controller;

import com.lepszasrednia.bugtracker.entity.BugReport;
import com.lepszasrednia.bugtracker.entity.Category;
import com.lepszasrednia.bugtracker.entity.BugStatus;
import com.lepszasrednia.bugtracker.entity.Users;
import com.lepszasrednia.bugtracker.repository.BugReportRepository;
import com.lepszasrednia.bugtracker.repository.CategoryRepository;
import com.lepszasrednia.bugtracker.repository.BugStatusRepository;
import com.lepszasrednia.bugtracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class BugReportController {
    private final BugReportRepository bugReportRepository;
    private final CategoryRepository categoryRepository;
    private final BugStatusRepository bugStatusRepository;
    private final UserRepository userRepository;

    public BugReportController(BugReportRepository bugReportRepository,
                               CategoryRepository categoryRepository,
                               BugStatusRepository bugStatusRepository,
                               UserRepository userRepository
    ) {
        this.bugReportRepository = bugReportRepository;
        this.categoryRepository = categoryRepository;
        this.bugStatusRepository = bugStatusRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/bugreports")
    public ResponseEntity<BugReport> createBugReport(@RequestBody BugReport bugReport) {
        // Fetch and validate category
        Category category = categoryRepository.findById(bugReport.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found with id " + bugReport.getCategory().getId()));
        bugReport.setCategory(category);

        // Fetch and validate status
        BugStatus actualStatus = bugStatusRepository.findById(bugReport.getActualStatus().getId())
                .orElseThrow(() -> new RuntimeException("BugStatus not found with id " + bugReport.getActualStatus().getId()));
        bugReport.setActualStatus(actualStatus);

        BugReport report = new BugReport();
        report.setTitle(bugReport.getTitle());
        report.setDescription(bugReport.getDescription());
        report.setPriority(bugReport.getPriority());
        report.setCategory(category);
        report.setActualStatus(actualStatus);

        // Set default user
        Users defaultUser = userRepository.findByUserId(2)
                .orElseThrow(() -> new RuntimeException("User not found with id 2"));
        report.setUser(defaultUser);

        // Save and return
        BugReport savedBugReport = bugReportRepository.save(report);
        return ResponseEntity.ok(savedBugReport);
    }
}
