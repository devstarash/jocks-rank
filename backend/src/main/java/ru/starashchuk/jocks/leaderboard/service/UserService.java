package ru.starashchuk.jocks.leaderboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.starashchuk.jocks.leaderboard.exception.AccessDeniedException;
import ru.starashchuk.jocks.leaderboard.exception.AlreadyExistsException;
import ru.starashchuk.jocks.leaderboard.exception.NotFoundException;
import ru.starashchuk.jocks.leaderboard.model.*;
import ru.starashchuk.jocks.leaderboard.repository.UserRepository;
import ru.starashchuk.jocks.leaderboard.security.JwtUtil;

@Component
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new AlreadyExistsException("Пользователь с таким username уже существует");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AccessDeniedException("Неверный пароль");
        }
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }
}
