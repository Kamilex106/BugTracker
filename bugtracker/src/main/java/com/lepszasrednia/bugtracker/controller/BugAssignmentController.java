package com.lepszasrednia.bugtracker.controller;

import com.lepszasrednia.bugtracker.entity.BugAssignment;
import com.lepszasrednia.bugtracker.entity.BugReport;
import com.lepszasrednia.bugtracker.entity.Users;
import com.lepszasrednia.bugtracker.repository.BugAssignmentRepository;
import com.lepszasrednia.bugtracker.repository.BugReportRepository;
import com.lepszasrednia.bugtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:4200")
//@PreAuthorize("hasRole('ADMIN')")
public class BugAssignmentController {

    private final BugAssignmentRepository bugAssignmentRepository;
    private final BugReportRepository bugReportRepository;
    private final UserRepository userRepository;

    @Autowired
    public BugAssignmentController(
            BugAssignmentRepository bugAssignmentRepository,
            BugReportRepository bugReportRepository,
            UserRepository userRepository
    ) {
        this.bugAssignmentRepository = bugAssignmentRepository;
        this.bugReportRepository = bugReportRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignBugToUser(@RequestBody AssignmentRequest request) {
        try {
            // Pobierz zgłoszenie błędu
            BugReport bugReport = bugReportRepository.findById(request.getBugReportId())
                    .orElseThrow(() -> new ResourceNotFoundException("Bug report not found with id: " + request.getBugReportId()));

            // Pobierz użytkownika
            Optional<Users> userOptional = userRepository.findByUserId(request.getEmployeeId());
            Users employee = userOptional
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getEmployeeId()));

            // Utwórz nowe przypisanie
            BugAssignment assignment = new BugAssignment();
            assignment.setBugReport(bugReport);
            assignment.setEmployee(employee);

            // Zapisz przypisanie
            BugAssignment savedAssignment = bugAssignmentRepository.save(assignment);

            // Zwróć odpowiedź z informacją o powodzeniu
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedAssignment.getId());
            response.put("bugReportId", savedAssignment.getBugReport().getId());
            response.put("bugReportTitle", savedAssignment.getBugReport().getTitle());
            response.put("employeeId", savedAssignment.getEmployee().getId());
            response.put("employeeName", savedAssignment.getEmployee().getUsername());
            response.put("message", "Bug successfully assigned to employee");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("error", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Failed to assign bug to employee: " + e.getMessage())
            );
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<BugAssignment>> getAllAssignments() {
        List<BugAssignment> assignments = bugAssignmentRepository.findAll();
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssignmentById(@PathVariable Integer id) {
        Optional<BugAssignment> assignment = bugAssignmentRepository.findById(id);
        if (assignment.isPresent()) {
            return ResponseEntity.ok(assignment.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("error", "Assignment not found with id: " + id)
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Integer id) {
        try {
            if (!bugAssignmentRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        Map.of("error", "Assignment not found with id: " + id)
                );
            }

            bugAssignmentRepository.deleteById(id);
            return ResponseEntity.ok(
                    Map.of("message", "Assignment deleted successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Failed to delete assignment: " + e.getMessage())
            );
        }
    }

    // Klasa pomocnicza dla requestu przypisania zgłoszenia do pracownika
    public static class AssignmentRequest {
        private Integer bugReportId;
        private Integer employeeId;

        public Integer getBugReportId() {
            return bugReportId;
        }

        public void setBugReportId(Integer bugReportId) {
            this.bugReportId = bugReportId;
        }

        public Integer getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Integer employeeId) {
            this.employeeId = employeeId;
        }
    }
}