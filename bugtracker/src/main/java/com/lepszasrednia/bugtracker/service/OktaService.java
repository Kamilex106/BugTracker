package com.lepszasrednia.bugtracker.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lepszasrednia.bugtracker.entity.Roles;
import com.lepszasrednia.bugtracker.entity.Users;
import com.lepszasrednia.bugtracker.repository.RoleRepository;
import com.lepszasrednia.bugtracker.repository.UserRepository;
import com.lepszasrednia.bugtracker.user.WebUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OktaService {

    @Value("${okta.api.token}")
    private String oktaApiToken;

    @Value("${okta.domain}")
    private String oktaDomain;

    private final RestTemplate restTemplate;
    private static final Logger logger = LoggerFactory.getLogger(OktaService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public OktaService(RestTemplate restTemplate,
                       UserRepository userRepository,
                       RoleRepository roleRepository) {
        this.restTemplate = restTemplate;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public String registerUserInOkta(WebUser webUser) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SSWS " + oktaApiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> profile = new HashMap<>();

        profile.put("firstName", webUser.getFirstName());
        profile.put("lastName", webUser.getLastName());
        profile.put("email", webUser.getEmail());
        profile.put("login", webUser.getEmail());

        Map<String, Object> password = new HashMap<>();
        password.put("value", webUser.getPassword());

        Map<String, Object> credentials = new HashMap<>();
        credentials.put("password", password);

        Map<String, Object> user = new HashMap<>();
        user.put("profile", profile);
        user.put("credentials", credentials);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(user, headers);

        String url = oktaDomain + "/api/v1/users?activate=true";

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getBody() == null || !response.getBody().contains("\"id\":")) {
                throw new RuntimeException("Konto z tym adresem email już istnieje.");
            }

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Błąd rejestracji w Okta: " + response.getBody());
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            return root.get("id").asText();

        } catch (HttpClientErrorException e) {
            String responseBody = e.getResponseBodyAsString();
            if (responseBody.contains("E0000001") && responseBody.contains("login: An object with this field already exists in the current organization")) {
                throw new RuntimeException("Konto z tym adresem email już istnieje.");
            }
            throw new RuntimeException("Błąd rejestracji w Okta: " + responseBody, e);

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Nie można sparsować odpowiedzi z Okta (błąd JSON): " + e.getMessage(), e);
        }
    }

    public void assignUserToGroup(String userId, String groupId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SSWS " + oktaApiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = oktaDomain + "/api/v1/groups/" + groupId + "/users/" + userId;

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        restTemplate.put(url, entity); // PUT request, body is empty
    }

    public boolean checkIfUserExists(String email) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SSWS " + oktaApiToken);

        String url = oktaDomain + "/api/v1/users/" + email;

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), String.class);
            return response.getStatusCode().is2xxSuccessful(); // Jeśli 200 OK, użytkownik istnieje
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return false;
            }
            throw e;
        }
    }

    public List<String> getUserGroups(String oktaId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SSWS " + oktaApiToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        String url = oktaDomain + "/api/v1/users/" + oktaId + "/groups";

        try {
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
            ResponseEntity<List> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    requestEntity,
                    List.class
            );

            List<Map<String, Object>> groups = response.getBody();
            if (groups == null) return List.of();

            return groups.stream()
                    .map(group -> {
                        Map<String, Object> profile = (Map<String, Object>) group.get("profile");
                        return profile != null ? (String) profile.get("name") : null;
                    })
                    .filter(name -> name != null)
                    .toList();

        } catch (HttpClientErrorException e) {
            logger.error("Błąd podczas pobierania grup użytkownika z Okta: {}", oktaId, e);
            return List.of();
        }
    }

    @Scheduled(cron = "0 0 3 * * ?") // Codziennie o 3:00
    public void syncRolesWithOktaGroups() {
        List<Users> users = userRepository.findAll();

        users.forEach(user -> {
            List<String> oktaGroups = getUserGroups(user.getOktaId());
            List<Roles> roles = roleRepository.findByNameIn(oktaGroups);
            user.setRoles(roles);
            userRepository.save(user);
        });
    }
}