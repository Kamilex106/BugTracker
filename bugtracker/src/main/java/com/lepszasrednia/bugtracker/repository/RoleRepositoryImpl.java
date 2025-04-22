package com.lepszasrednia.bugtracker.repository;

import com.lepszasrednia.bugtracker.entity.Roles;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public class RoleRepositoryImpl implements RoleRepository {

    private EntityManager entityManager;

    public RoleRepositoryImpl(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }

    @Override
    public Roles findByRoleName(String theRoleName) {

        // retrieve/read from database using name
        TypedQuery<Roles> theQuery = entityManager.createQuery("from Roles where name=:roleName", Roles.class);
        theQuery.setParameter("roleName", theRoleName);

        Roles theRole = null;

        try {
            theRole = theQuery.getSingleResult();
        } catch (Exception e) {
            theRole = null;
        }

        return theRole;
    }

    @Override
    public List<Roles> getAllRoles() {
        return entityManager.createQuery("from Roles", Roles.class).getResultList();
    }

    @Override
    public Roles findByRoleId(Integer theRoleId) {
        return entityManager.find(Roles.class, theRoleId);
    }

    @Override
    public List<Roles> findByNameIn(List<String> oktaGroups) {
        if (oktaGroups == null || oktaGroups.isEmpty()) {
            return List.of();
        }

        TypedQuery<Roles> query = entityManager.createQuery(
                "FROM Roles WHERE name IN :names", Roles.class);
        query.setParameter("names", oktaGroups);

        return query.getResultList();
    }
}
