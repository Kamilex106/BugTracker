package com.lepszasrednia.bugtracker.controller;

import com.lepszasrednia.bugtracker.entity.*;
import com.lepszasrednia.bugtracker.repository.UserRepository;
import com.lepszasrednia.bugtracker.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class UserController {
    UserService userService;
    RoleService roleService;
    UserRepository userRepository;

    @Autowired
    public UserController(
            UserService userService,
            RoleService roleService,
            UserRepository userRepository
    ) {
        this.userService = userService;
        this.roleService = roleService;
        this.userRepository = userRepository;

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
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt principal) {
        String oktaId = principal.getClaim("uid");
        Users user = userRepository.findByOktaId(oktaId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "username", user.getUsername()
        ));
    }

}
