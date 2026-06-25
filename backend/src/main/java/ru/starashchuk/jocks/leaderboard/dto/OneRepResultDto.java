package ru.starashchuk.jocks.leaderboard.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class OneRepResultDto {
    private Integer id;
    private String username;
    private BigDecimal bench;
    private BigDecimal bicep;
    private BigDecimal pullups;
    private BigDecimal total;
    private LocalDateTime recordedAt;
}