package com.lepszasrednia.bugtracker.service;

import com.lepszasrednia.bugtracker.entity.Roles;
import com.lepszasrednia.bugtracker.entity.Users;
import com.lepszasrednia.bugtracker.user.WebUser;

import java.util.List;

public interface UserService {

    List<Users> getAllUsers();

    Users findByUserName(String userName);

    void save(WebUser webUser);

    Roles findRoleByName(String roleName);

}
