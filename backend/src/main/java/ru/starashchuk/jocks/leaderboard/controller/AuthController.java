package ru.starashchuk.jocks.leaderboard.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.starashchuk.jocks.leaderboard.model.AuthResponse;
import ru.starashchuk.jocks.leaderboard.model.LoginRequest;
import ru.starashchuk.jocks.leaderboard.model.RegisterRequest;
import ru.starashchuk.jocks.leaderboard.model.TelegramAuthRequest;
import ru.starashchuk.jocks.leaderboard.dto.UserInfoResponse;
import ru.starashchuk.jocks.leaderboard.service.TelegramAuthService;
import ru.starashchuk.jocks.leaderboard.service.UserService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final TelegramAuthService telegramAuthService;

    @PostMapping("/register")
    public ResponseEntity<UserInfoResponse> register(@Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        AuthResponse auth = userService.register(request);
        addTokenCookie(response, auth.getToken());
        return ResponseEntity.ok(new UserInfoResponse(auth.getUsername(), auth.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<UserInfoResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        AuthResponse auth = userService.login(request);
        addTokenCookie(response, auth.getToken());
        return ResponseEntity.ok(new UserInfoResponse(auth.getUsername(), auth.getRole()));
    }

    @PostMapping("/telegram")
    public ResponseEntity<UserInfoResponse> telegramAuth(
            @RequestBody TelegramAuthRequest request,
            HttpServletResponse response) {
        AuthResponse auth = telegramAuthService.authenticate(request);
        addTokenCookie(response, auth.getToken());
        return ResponseEntity.ok(new UserInfoResponse(auth.getUsername(), auth.getRole()));
    }

    private void addTokenCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(86400)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}