package ru.starashchuk.jocks.leaderboard.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class RegisterRequest {

    @NotBlank(message = "Username обязателен")
    @Size(min = 3, max = 64, message = "Username от 3 до 64 символов")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username только латинские буквы, цифры и _")
    private String username;

    @NotBlank(message = "Пароль обязателен")
    @Size(min = 6, message = "Пароль минимум 6 символов")
    @Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*]+$", message = "Пароль только латинские буквы, цифры и спецсимволы")
    private String password;

    @Email(message = "Некорректный email")
    private String email;
}