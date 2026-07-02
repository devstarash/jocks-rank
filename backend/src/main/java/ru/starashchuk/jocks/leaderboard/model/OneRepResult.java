package ru.starashchuk.jocks.leaderboard.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "one_rep_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OneRepResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private BigDecimal bench;

    private BigDecimal bicep;

    private BigDecimal pullups;

    @Column(insertable = false, updatable = false)
    private BigDecimal total;

    private Boolean approved = false;

    private String note;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}