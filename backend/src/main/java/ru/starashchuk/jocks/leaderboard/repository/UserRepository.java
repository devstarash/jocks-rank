package ru.starashchuk.jocks.leaderboard.repository;

import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.SelectionQuery;
import org.springframework.stereotype.Repository;
import ru.starashchuk.jocks.leaderboard.model.User;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepository {
    private final SessionFactory factory;

    public User save(User user) {
        Session session = factory.getCurrentSession();
        session.persist(user);
        return user;
    }

    public List<User> findAll() {
        Session session = factory.getCurrentSession();
        SelectionQuery<User> findUsersRequest = session.createSelectionQuery("FROM User", User.class);
        List<User> users = findUsersRequest.getResultList();
        return users;
    }

    public Optional<User> findById(Integer id) {
        Session session = factory.getCurrentSession();
        SelectionQuery<User> findByIdRequest = session
                .createSelectionQuery("Select u FROM User WHERE u.id = :id", User.class)
                .setParameter("id", id);
        Optional<User> user = findByIdRequest.uniqueResultOptional();
        return user;
    }

    public Optional<User> findByUsername(String username) {
        Session session = factory.getCurrentSession();
        SelectionQuery<User> findByUsernameRequest = session
                .createSelectionQuery("Select u FROM User WHERE u.username = :username", User.class)
                .setParameter("username", username);
        Optional<User> user = findByUsernameRequest.uniqueResultOptional();
        return user;
    }
}
