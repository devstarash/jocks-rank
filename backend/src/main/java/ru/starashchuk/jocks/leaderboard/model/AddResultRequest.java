package ru.starashchuk.jocks.leaderboard.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class AddResultRequest {

    @NotBlank(message = "Категория обязательна")
    private String categorySlug;

    @NotNull(message = "Значение обязательно")
    @Positive(message = "Значение должно быть больше нуля")
    private BigDecimal value;

    private String note;
}