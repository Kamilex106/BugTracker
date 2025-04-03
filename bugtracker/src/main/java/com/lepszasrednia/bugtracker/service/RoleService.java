package com.lepszasrednia.bugtracker.service;

import com.lepszasrednia.bugtracker.entity.Roles;

import java.util.List;

public interface RoleService {
    List<Roles> getAllRoles();

    Roles findByRoleName(String theRoleName);

    Roles findByRoleId(Integer id);
}
