package ru.starashchuk.jocks.leaderboard.repository;

import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.SelectionQuery;
import org.springframework.stereotype.Repository;
import ru.starashchuk.jocks.leaderboard.model.Category;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CategoryRepository {
    private final SessionFactory factory;

    public List<Category> findAll() {
        Session session = factory.getCurrentSession();
        SelectionQuery<Category> findCategoriesRequest =
                session.createSelectionQuery("Select c FROM Category c", Category.class);
        List<Category> categories = findCategoriesRequest.getResultList();
        return categories;
    }

    public Optional<Category> findBySlug(String slug) {
        Session session = factory.getCurrentSession();
        SelectionQuery<Category> findCategoryRequest = session.createSelectionQuery
                        ("Select c FROM Category c WHERE c.slug = :slug", Category.class)
                .setParameter("slug", slug);
        Optional<Category> category = findCategoryRequest.uniqueResultOptional();
        return category;
    }
}

