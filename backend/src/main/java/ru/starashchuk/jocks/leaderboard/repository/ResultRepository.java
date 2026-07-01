package ru.starashchuk.jocks.leaderboard.repository;

import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.SelectionQuery;
import org.springframework.stereotype.Repository;
import ru.starashchuk.jocks.leaderboard.model.Result;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ResultRepository {
    private final SessionFactory factory;

    public Result save(Result result) {
        Session session = factory.getCurrentSession();
        session.persist(result);
        return result;
    }

    public List<Result> findByCategorySlug(String slug) {
        Session session = factory.getCurrentSession();
        SelectionQuery<Result> findResultsRequest =
                session.createSelectionQuery
                                ("SELECT r FROM Result r JOIN FETCH r.user JOIN FETCH r.category" +
                                        " WHERE r.approved = true AND r.category.slug = :slug" +
                                        " ORDER BY r.value DESC", Result.class)
                        .setParameter("slug", slug);
        List<Result> results = findResultsRequest.getResultList();
        return results;
    }

    public List<Result> findByUserId(Integer id) {
        Session session = factory.getCurrentSession();
        SelectionQuery<Result> findResultsRequest =
                session.createSelectionQuery
                                ("Select r FROM Result r JOIN FETCH r.category WHERE r.user.id = :id ORDER BY r.recordedAt DESC", Result.class)
                        .setParameter("id", id);
        List<Result> results = findResultsRequest.getResultList();
        return results;
    }

    public void deleteById(Integer id) {
        Result result = factory.getCurrentSession().find(Result.class, id);
        if (result != null) {
            factory.getCurrentSession().remove(result);
        }
    }
    public Optional<Result> findById(Integer id) {
        return Optional.ofNullable(factory.getCurrentSession().find(Result.class, id));
    }
}
