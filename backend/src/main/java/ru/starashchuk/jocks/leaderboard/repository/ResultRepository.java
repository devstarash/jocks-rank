package ru.starashchuk.jocks.leaderboard.repository;

import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.SelectionQuery;
import org.springframework.stereotype.Repository;
import ru.starashchuk.jocks.leaderboard.model.Result;

import java.util.List;

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
                                ("Select r FROM Result WHERE r.approved = true " +
                                        "AND r.category.slug = :slug ORDER BY r.value DESC", Result.class)
                        .setParameter("slug", slug);
        List<Result> results = findResultsRequest.getResultList();
        return results;
    }

    public List<Result> findByUserId(Integer id) {
        Session session = factory.getCurrentSession();
        SelectionQuery<Result> findResultsRequest =
                session.createSelectionQuery
                                ("Select r FROM Result WHERE r.user.id = :id ORDER BY r.recordedAt DESC", Result.class)
                        .setParameter("id", id);
        List<Result> results = findResultsRequest.getResultList();
        return results;
    }
}
