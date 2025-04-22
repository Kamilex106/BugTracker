package com.lepszasrednia.bugtracker.repository;
import com.lepszasrednia.bugtracker.entity.Roles;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
public interface RoleRepository {
    List<Roles> getAllRoles();
    public Roles findByRoleName(String theRoleName);
    Roles findByRoleId(Integer id);

    List<Roles> findByNameIn(List<String> oktaGroups);
}
