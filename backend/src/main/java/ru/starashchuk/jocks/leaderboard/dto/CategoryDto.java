package ru.starashchuk.jocks.leaderboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryDto {
    private Integer id;
    private String name;
    private String slug;
    private String unit;
    private String description;
    private String rules;
}