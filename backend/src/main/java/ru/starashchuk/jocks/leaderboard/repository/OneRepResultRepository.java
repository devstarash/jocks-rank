package ru.starashchuk.jocks.leaderboard.repository;

import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.SelectionQuery;
import org.springframework.stereotype.Repository;
import ru.starashchuk.jocks.leaderboard.model.OneRepResult;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class OneRepResultRepository {
    private final SessionFactory factory;

    public OneRepResult save(OneRepResult result) {
        Session session = factory.getCurrentSession();
        session.persist(result);
        return result;
    }

    public List<OneRepResult> findAll() {
        Session session = factory.getCurrentSession();
        SelectionQuery<OneRepResult> findOneRepResultsRequest =
                session.createSelectionQuery("FROM OneRepResult o JOIN FETCH o.user " +
                        "WHERE o.approved = true ORDER BY o.total DESC", OneRepResult.class);
        List<OneRepResult> results = findOneRepResultsRequest.getResultList();
        return results;
    }

    public List<OneRepResult> findByUserId(Integer id) {
        Session session = factory.getCurrentSession();
        SelectionQuery<OneRepResult> findByIdRequest = session
                .createSelectionQuery("FROM OneRepResult o JOIN FETCH o.user" +
                        " WHERE o.user.id = :id ORDER BY o.recordedAt DESC", OneRepResult.class)
                .setParameter("id", id);
        List<OneRepResult> result = findByIdRequest.getResultList();
        return result;
    }
}
