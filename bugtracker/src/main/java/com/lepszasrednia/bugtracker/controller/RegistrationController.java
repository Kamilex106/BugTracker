package com.lepszasrednia.bugtracker.controller;

import com.lepszasrednia.bugtracker.entity.Roles;
import com.lepszasrednia.bugtracker.entity.Users;
import com.lepszasrednia.bugtracker.repository.UserRepository;
import com.lepszasrednia.bugtracker.service.OktaService;
import com.lepszasrednia.bugtracker.service.RoleService;
import com.lepszasrednia.bugtracker.user.WebUser;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/registration")
public class RegistrationController {
    private final OktaService oktaService;
    private final UserRepository userRepository;
    private final RoleService roleService;
    private static final Logger logger = LoggerFactory.getLogger(RegistrationController.class);

    public RegistrationController(OktaService oktaService,
                                  UserRepository userRepository,
                                  RoleService roleService) {
        this.oktaService = oktaService;
        this.userRepository = userRepository;
        this.roleService = roleService;
    }

    @PostMapping
    public ResponseEntity<?> registerUser(@Valid @RequestBody WebUser webUser, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMsg = Objects.requireNonNull(bindingResult.getFieldError()).getDefaultMessage();
            assert errorMsg != null;
            return ResponseEntity.badRequest().body(Map.of("message", errorMsg));
        }
        try {
            boolean userExists = oktaService.checkIfUserExists(webUser.getEmail());
            if (userExists) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("message", "Konto z tym adresem email już istnieje."));
            }

            // rejestracja new user w okta i pobranie jego okta_id
            String oktaId = oktaService.registerUserInOkta(webUser);

            String groupId = "00gobatv2hHKpIvN55d7";
            oktaService.assignUserToGroup(oktaId, groupId);

            // tworzenie lokalnego usera
            Users localUser = new Users();
            localUser.setUsername(webUser.getEmail());
            localUser.setEmail(webUser.getEmail());
            localUser.setOktaId(oktaId);
            localUser.setEnabled(true);

            // przypisanie domyslnej roli - ROLE_USER
            Roles defaultRole = roleService.findByRoleName("ROLE_USER");
            if (localUser.getRoles() == null) {
                localUser.setRoles(new ArrayList<>());
            }
            localUser.getRoles().add(defaultRole);

            // zapisanie usera w local database
            userRepository.save(localUser);

            return ResponseEntity
                    .ok()
                    .body(Map.of("message", "Użytkownik zarejestrowany w Okta i lokalnej bazie!"));
        } catch (Exception e) {
            logger.error("Błąd rejestracji użytkownika:", e);
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Nieprawidłowe dane rejestracji. Uzupełnij wszystkie wymagane pola."));
        }
    }
}
