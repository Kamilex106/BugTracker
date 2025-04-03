package com.lepszasrednia.bugtracker.service;

import com.lepszasrednia.bugtracker.entity.Roles;
import com.lepszasrednia.bugtracker.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Roles> getAllRoles() {
        return roleRepository.getAllRoles();
    }

    @Override
    public Roles findByRoleName(String theRoleName) {
        return roleRepository.findByRoleName(theRoleName);
    }

    @Override
    public Roles findByRoleId(Integer id) {
        return roleRepository.findByRoleId(id);
    }
}
