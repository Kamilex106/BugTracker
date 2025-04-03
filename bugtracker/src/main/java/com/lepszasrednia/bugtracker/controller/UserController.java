package com.lepszasrednia.bugtracker.controller;

import com.lepszasrednia.bugtracker.entity.*;
import com.lepszasrednia.bugtracker.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class UserController {
    UserService userService;
    RoleService roleService;

    @Autowired
    public UserController(
            UserService userService,
            RoleService roleService
    ) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/users/all")
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }


    @GetMapping("/roles/all")
    public List<Roles> getAllRoles() {
        return roleService.getAllRoles();
    }

}
