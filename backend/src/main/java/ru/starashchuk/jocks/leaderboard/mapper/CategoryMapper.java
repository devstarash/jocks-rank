package ru.starashchuk.jocks.leaderboard.mapper;

import org.mapstruct.Mapper;
import ru.starashchuk.jocks.leaderboard.dto.CategoryDto;
import ru.starashchuk.jocks.leaderboard.model.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDto toDto(Category category);
}