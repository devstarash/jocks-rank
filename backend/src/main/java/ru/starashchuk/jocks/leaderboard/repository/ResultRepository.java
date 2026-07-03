package ru.starashchuk.jocks.leaderboard.repository;

import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.SelectionQuery;
import org.springframework.stereotype.Repository;
import ru.starashchuk.jocks.leaderboard.model.Result;
import ru.starashchuk.jocks.leaderboard.model.ResultStatus;

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
        List<?> ids = session.createNativeQuery(
                "SELECT DISTINCT ON (r.user_id) r.id FROM results r" +
                " WHERE r.status = 'APPROVED' AND r.category_id = (SELECT id FROM categories WHERE slug = :slug)" +
                " ORDER BY r.user_id, r.value DESC")
                .setParameter("slug", slug)
                .getResultList();
        if (ids.isEmpty()) return List.of();
        List<Result> results = session.createSelectionQuery(
                "SELECT r FROM Result r JOIN FETCH r.user JOIN FETCH r.category WHERE r.id IN :ids ORDER BY r.value DESC",
                Result.class)
                .setParameter("ids", ids)
                .getResultList();
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
        Session session = factory.getCurrentSession();
        SelectionQuery<Result> query = session.createSelectionQuery(
                "SELECT r FROM Result r JOIN FETCH r.user JOIN FETCH r.category WHERE r.id = :id",
                Result.class)
                .setParameter("id", id);
        return query.getResultList().stream().findFirst();
    }

    public List<Result> findForModeration(String categorySlug, ResultStatus status) {
        Session session = factory.getCurrentSession();
        StringBuilder hql = new StringBuilder(
                "SELECT r FROM Result r JOIN FETCH r.user JOIN FETCH r.category WHERE 1=1");
        if (status != null) {
            hql.append(" AND r.status = :status");
        }
        if (categorySlug != null) {
            hql.append(" AND r.category.slug = :slug");
        }
        hql.append(" ORDER BY r.category.name ASC, r.recordedAt ASC");

        SelectionQuery<Result> query = session.createSelectionQuery(hql.toString(), Result.class);
        if (status != null) {
            query.setParameter("status", status);
        }
        if (categorySlug != null) {
            query.setParameter("slug", categorySlug);
        }
        return query.getResultList();
    }
}
