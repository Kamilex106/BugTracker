package com.lepszasrednia.bugtracker.repository;

import com.lepszasrednia.bugtracker.entity.BugAssignment;
import com.lepszasrednia.bugtracker.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@Repository
public interface BugAssignmentRepository extends JpaRepository<BugAssignment, Integer> {

    List<BugAssignment> findByEmployee(Users employee);
}
