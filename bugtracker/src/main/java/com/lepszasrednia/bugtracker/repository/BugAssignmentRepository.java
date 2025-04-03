package com.lepszasrednia.bugtracker.repository;

import com.lepszasrednia.bugtracker.entity.BugAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
@Repository
public interface BugAssignmentRepository extends JpaRepository<BugAssignment, Integer> {

}
