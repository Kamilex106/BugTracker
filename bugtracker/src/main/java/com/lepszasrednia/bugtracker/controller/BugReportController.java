package com.lepszasrednia.bugtracker.controller;

import com.lepszasrednia.bugtracker.entity.*;
import com.lepszasrednia.bugtracker.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class BugReportController {
    private final BugReportRepository bugReportRepository;
    private final CategoryRepository categoryRepository;
    private final BugStatusRepository bugStatusRepository;
    private final UserRepository userRepository;
    private final BugReportLogRepository bugReportLogRepository;
    private final BugAssignmentRepository bugAssignmentRepository;

    public BugReportController(BugReportRepository bugReportRepository,
                               CategoryRepository categoryRepository,
                               BugStatusRepository bugStatusRepository,
                               UserRepository userRepository,
                               BugReportLogRepository bugReportLogRepository,
                               BugAssignmentRepository bugAssignmentRepository
    ) {
        this.bugReportRepository = bugReportRepository;
        this.categoryRepository = categoryRepository;
        this.bugStatusRepository = bugStatusRepository;
        this.userRepository = userRepository;
        this.bugReportLogRepository = bugReportLogRepository;
        this.bugAssignmentRepository = bugAssignmentRepository;
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

        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = jwt.getClaim("sub");
        Users local_user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email " + email));
        report.setUser(local_user);

        // Save and return
        BugReport savedBugReport = bugReportRepository.save(report);
        return ResponseEntity.ok(savedBugReport);
    }

    @PutMapping("/bugreports/{id}/status")
    public ResponseEntity<BugReport> updateBugReportStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> statusUpdate) {

        // Sprawdź czy użytkownik ma rolę ADMIN
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(null); // Lub throw new RuntimeException("Only administrators can change bug status");
        }

        // Reszta kodu...
        try {
            String newStatus = statusUpdate.get("status");
            BugReport bugReport = bugReportRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Bug report not found with id " + id));

            BugStatus oldStatus = bugReport.getActualStatus();
            BugStatus bugStatus = bugStatusRepository.findByName(newStatus)
                    .orElseThrow(() -> new RuntimeException("Bug status not found with name " + newStatus));

            bugReport.setActualStatus(bugStatus);
            BugReport updatedBugReport = bugReportRepository.save(bugReport);

            createStatusChangeLog(bugReport, oldStatus, bugStatus);

            return ResponseEntity.ok(updatedBugReport);
        } catch (Exception e) {
            System.err.println("Error updating bug report status: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }


    // - zapisuje log zmiany statusu do bazy danych
    private void createStatusChangeLog(BugReport bugReport, BugStatus oldStatus, BugStatus newStatus) {
        // Pobierz aktualnego użytkownika z JWT
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = jwt.getClaim("sub");
        Users currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email " + email));

        // Utwórz log entry
        BugReportLog logEntry = new BugReportLog();
        logEntry.setBugReport(bugReport);
        logEntry.setBugStatus(newStatus);
        logEntry.setDate(Instant.now());

        // Dodaj komentarz o zmianie
        String comment = String.format("Status changed from %s to %s",
                oldStatus != null ? oldStatus.getName() : "None",
                newStatus.getName());
        logEntry.setComment(comment);

        // Zapisz log do bazy danych
        bugReportLogRepository.save(logEntry);
    }

    @GetMapping("/bugreports/{id}")
    public ResponseEntity<BugReport> getBugReportById(@PathVariable Integer id) {
        BugReport bugReport = bugReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bug report not found with id " + id));

        return ResponseEntity.ok(bugReport);
    }


    @GetMapping("/api/bugreports")
    public ResponseEntity<List<BugReport>> getBugReports() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Sprawdź czy użytkownik ma rolę ADMIN
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        List<BugReport> bugReports;

        if (isAdmin) {
            // Admin widzi wszystkie bug reporty
            bugReports = bugReportRepository.findAll();
        } else {
            // Zwykły użytkownik widzi tylko swoje bug reporty
            Jwt jwt = (Jwt) auth.getPrincipal();
            String email = jwt.getClaim("sub");
            Users currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            bugReports = bugReportRepository.findAllByUser(currentUser);
        }

        return ResponseEntity.ok(bugReports);
    }

    @GetMapping("/api/bugreports/paginated")
    public ResponseEntity<Page<BugReport>> getBugReportsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Pageable pageable = PageRequest.of(page, size);

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Page<BugReport> bugReports;

        if (isAdmin) {
            bugReports = bugReportRepository.findAll(pageable);
        } else {
            Jwt jwt = (Jwt) auth.getPrincipal();
            String email = jwt.getClaim("sub");
            Users currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            bugReports = bugReportRepository.findByUser(currentUser, pageable);
        }

        return ResponseEntity.ok(bugReports);
    }

    @GetMapping("/api/bugreports/search")
    public ResponseEntity<List<BugReport>> searchBugReports(@RequestParam String keyword) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        List<BugReport> bugReports;

        if (isAdmin) {
            // Admin może szukać we wszystkich bug reportach
            bugReports = bugReportRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                    keyword, keyword);
        } else {
            // Użytkownik może szukać tylko w swoich bug reportach
            Jwt jwt = (Jwt) auth.getPrincipal();
            String email = jwt.getClaim("sub");
            Users currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            bugReports = bugReportRepository.findByUserAndTitleContainingIgnoreCaseOrUserAndDescriptionContainingIgnoreCase(
                    currentUser, keyword, currentUser, keyword);
        }

        return ResponseEntity.ok(bugReports);
    }

    @GetMapping("/api/bugreports/assigned")
    public ResponseEntity<List<BugReport>> getAssignedBugReports(@AuthenticationPrincipal Jwt jwt) {
        // Get the currently logged-in user
        String email = jwt.getClaim("uid");
        Users currentUser = userRepository.findByOktaId(email)
                .orElseThrow(() -> new RuntimeException("User not found with email " + email));

        // Find all bug assignments for the current user
        List<BugAssignment> assignments = bugAssignmentRepository.findByEmployee(currentUser);

        // Extract the bug reports from the assignments
        List<BugReport> assignedBugReports = assignments.stream()
                .map(BugAssignment::getBugReport)
                .collect(Collectors.toList());

        return ResponseEntity.ok(assignedBugReports);
    }
}
