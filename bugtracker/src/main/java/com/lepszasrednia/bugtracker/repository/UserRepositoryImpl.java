package com.lepszasrednia.bugtracker.repository;

import com.lepszasrednia.bugtracker.entity.Users;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private EntityManager entityManager;

    public UserRepositoryImpl(EntityManager theEntityManager) {
        this.entityManager = theEntityManager;
    }

    @Override
    public Users findByUserName(String theUserName) {

        // retrieve/read from database using username
        TypedQuery<Users> theQuery = entityManager.createQuery("from Users where username=:uName", Users.class);
        theQuery.setParameter("uName", theUserName);

        Users theUser = null;
        try {
            theUser = theQuery.getSingleResult();
        } catch (Exception e) {
            theUser = null;
        }

        return theUser;
    }

//    @Override
//    public Users findByUserId(Integer id) {
//        return entityManager.find(Users.class, id);
//    }
    @Override
    public Optional<Users> findByUserId(Integer id) {
        return Optional.ofNullable(entityManager.find(Users.class, id));
    }


    @Override
    @Transactional
    public void save(Users theUser) {
        entityManager.merge(theUser);
    }

    @Override
    public List<Users> getAllUsers() {
        return entityManager.createQuery("from Users", Users.class).getResultList();
    }
}