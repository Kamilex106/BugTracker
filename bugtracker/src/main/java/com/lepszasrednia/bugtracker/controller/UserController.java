package com.lepszasrednia.bugtracker.controller;

import com.lepszasrednia.bugtracker.entity.*;
import com.lepszasrednia.bugtracker.repository.BugReportRepository;
import com.lepszasrednia.bugtracker.repository.UserRepository;
import com.lepszasrednia.bugtracker.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class UserController {
    UserService userService;
    RoleService roleService;
    UserRepository userRepository;
    BugReportRepository bugReportRepository;

    @Autowired
    public UserController(
            UserService userService,
            RoleService roleService,
            UserRepository userRepository,
            BugReportRepository bugReportRepository
    ) {
        this.userService = userService;
        this.roleService = roleService;
        this.userRepository = userRepository;
        this.bugReportRepository = bugReportRepository;

    }

    @GetMapping("/users/all")
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }


    @GetMapping("/roles/all")
    public List<Roles> getAllRoles() {
        return roleService.getAllRoles();
    }

    // endpoint zwracający informacje o zalogowanym użytkowniku
    @GetMapping("/user/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal Jwt principal) {
        String oktaId = principal.getClaim("uid");
        Users user = userRepository.findByOktaId(oktaId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Pobierz role użytkownika
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());

        // Sprawdź czy użytkownik jest adminem
        boolean isAdmin = roles.contains("ROLE_ADMIN");

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "username", user.getUsername(),
                "isAdmin", isAdmin,
                "roles", roles // DODAJ TO POLE!
        ));
    }


    @GetMapping("/api/user/stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) auth.getPrincipal();
        String email = jwt.getClaim("sub");

        Users currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<BugReport> userBugs = bugReportRepository.findAllByUser(currentUser);

        long totalBugs = userBugs.size();
        long closedBugs = userBugs.stream()
                .filter(bug -> "Closed".equalsIgnoreCase(bug.getActualStatus().getName()))
                .count();
        long openBugs = userBugs.stream()
                .filter(bug -> "Open".equalsIgnoreCase(bug.getActualStatus().getName()))
                .count();
        long inProgressBugs = userBugs.stream()
                .filter(bug -> "In Progress".equalsIgnoreCase(bug.getActualStatus().getName()))
                .count();

        Map<String, Object> stats = Map.of(
                "totalBugs", totalBugs,
                "closedBugs", closedBugs,
                "openBugs", openBugs,
                "inProgressBugs", inProgressBugs
        );

        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/users/all/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Boolean enabled = body.get("enabled");
        if (enabled == null) {
            return ResponseEntity.badRequest().body("Missing 'enabled' value");
        }

        userService.updateStatus(id, enabled); // zaimplementuj w serwisie
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/admins")
    public List<Users> getAdminUsers() {
        return userService.getUsersByRole("ROLE_ADMIN");
    }

}
