package com.lepszasrednia.bugtracker.service;

import com.lepszasrednia.bugtracker.entity.Roles;
import com.lepszasrednia.bugtracker.entity.Users;
import com.lepszasrednia.bugtracker.repository.RoleRepository;
import com.lepszasrednia.bugtracker.repository.UserRepository;
import com.lepszasrednia.bugtracker.user.WebUser;
import org.springframework.stereotype.Service;
//import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
//    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
//            PasswordEncoder passwordEncoder
            RoleRepository roleRepository
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Users> getAllUsers() {
        return userRepository.getAllUsers();
    }

    @Override
    public Users findByUserName(String userName) {
        // check the database if the user already exists
        return userRepository.findByUserName(userName);
    }

    @Override
    public void save(WebUser webUser) {
        Users user = new Users();

        // assign user details to the user object
        user.setUsername(webUser.getUserName());
//        user.setPassword(passwordEncoder.encode(webUser.getPassword()));
        user.setPassword(webUser.getPassword());

        user.setRoles(Arrays.asList(roleRepository.findByRoleName(webUser.getRoleName())));

        // save user in the database
        userRepository.save(user);
    }

    @Override
    public Roles findRoleByName(String roleName) {
        return roleRepository.findByRoleName(roleName);
    }
}
