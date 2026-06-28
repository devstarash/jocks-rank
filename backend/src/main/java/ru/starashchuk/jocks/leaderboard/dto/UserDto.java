package ru.starashchuk.jocks.leaderboard.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserDto {
    private Integer id;
    private String username;
    private String email;
    private String role;
    private String avatarUrl;
    private String displayName;
    private LocalDateTime createdAt;
}