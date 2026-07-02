package ru.starashchuk.jocks.leaderboard.dto;

import lombok.Builder;
import lombok.Getter;
import ru.starashchuk.jocks.leaderboard.model.ResultStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class ResultDto {
    private Integer id;
    private String username;
    private String categoryName;
    private String categorySlug;
    private String unit;
    private BigDecimal value;
    private ResultStatus status;
    private LocalDateTime recordedAt;
}