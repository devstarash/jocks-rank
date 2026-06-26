package ru.starashchuk.jocks.leaderboard.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LoginRequest {

    @NotBlank(message = "Username обязателен")
    private String username;

    @NotBlank(message = "Пароль обязателен")
    private String password;
}