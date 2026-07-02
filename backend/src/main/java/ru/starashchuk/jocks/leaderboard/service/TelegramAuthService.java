package ru.starashchuk.jocks.leaderboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.starashchuk.jocks.leaderboard.model.AuthResponse;
import ru.starashchuk.jocks.leaderboard.model.TelegramAuthRequest;
import ru.starashchuk.jocks.leaderboard.model.User;
import ru.starashchuk.jocks.leaderboard.repository.UserRepository;
import ru.starashchuk.jocks.leaderboard.security.JwtUtil;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Optional;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class TelegramAuthService {
    @Value("${telegram.bot.token}")
    private String botToken;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse authenticate(TelegramAuthRequest request) {
        if (!isValidSignature(request)) {
            throw new RuntimeException("Невалидная подпись Telegram");
        }
        User user = userRepository.findByTelegramId(request.getId())
                .orElseGet(() -> createUser(request));
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    private User createUser(TelegramAuthRequest request) {
        String displayName = request.getFirstName();
        if (request.getLastName() != null) {
            displayName += " " + request.getLastName();
        }
        User user = new User();
        user.setTelegramId(request.getId());
        user.setUsername("tg_" + request.getId());
        user.setDisplayName(displayName);
        user.setAvatarUrl(request.getPhotoUrl());
        user.setRole("USER");
        return userRepository.save(user);
    }

    private boolean isValidSignature(TelegramAuthRequest request) {
        try {
            TreeMap<String, String> data = new TreeMap<>();
            data.put("auth_date", String.valueOf(request.getAuthDate()));
            data.put("first_name", request.getFirstName());
            if (request.getLastName() != null) data.put("last_name", request.getLastName());
            if (request.getUsername() != null) data.put("username", request.getUsername());
            if (request.getPhotoUrl() != null) data.put("photo_url", request.getPhotoUrl());
            data.put("id", String.valueOf(request.getId()));
            String checkString = String.join("\n", data.entrySet().stream()
                    .map(e -> e.getKey() + "=" + e.getValue())
                    .toList()
            );
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            byte[] secretKey = sha256.digest(botToken.getBytes(StandardCharsets.UTF_8));
            Mac hmac = Mac.getInstance("HmacSHA256");
            hmac.init(new SecretKeySpec(secretKey, "HmacSHA256"));
            byte[] hash = hmac.doFinal(checkString.getBytes(StandardCharsets.UTF_8));
            String calculatedHash = HexFormat.of().formatHex(hash);
            return calculatedHash.equals(request.getHash());
        } catch (Exception e) {
            return false;
        }
    }


}
