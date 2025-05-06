package com.lepszasrednia.bugtracker.repository;

import com.lepszasrednia.bugtracker.entity.Users;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
public interface UserRepository {

    Users findByUserName(String userName);

//    public Users findByUserId(Integer id);
    public Optional<Users> findByUserId(Integer id);

    void save(Users user);

    List<Users> getAllUsers();

    Optional<Users> findByEmail(String email);

    Optional<Users> findByOktaId(String oktaId);

    List<Users> findAll();
}