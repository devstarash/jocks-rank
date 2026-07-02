package ru.starashchuk.jocks.leaderboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.starashchuk.jocks.leaderboard.dto.CategoryDto;
import ru.starashchuk.jocks.leaderboard.mapper.CategoryMapper;
import ru.starashchuk.jocks.leaderboard.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> findAll() {
        List<CategoryDto> categories = categoryService.findAll().stream().map(categoryMapper::toDto).toList();
        return ResponseEntity.status(200).body(categories);
    }
}
