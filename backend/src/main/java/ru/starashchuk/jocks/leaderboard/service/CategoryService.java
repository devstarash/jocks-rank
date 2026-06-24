package ru.starashchuk.jocks.leaderboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.starashchuk.jocks.leaderboard.model.Category;
import ru.starashchuk.jocks.leaderboard.repository.CategoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    @Transactional(readOnly = true)
    public List<Category> findAll() {
        List<Category> categories = categoryRepository.findAll();
        return categories;
    }
    @Transactional(readOnly = true)
    public Category findBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Категория не найдена: " + slug));
        return category;
    }
}
