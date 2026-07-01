package ru.starashchuk.jocks.leaderboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.starashchuk.jocks.leaderboard.exception.NotFoundException;
import ru.starashchuk.jocks.leaderboard.model.AddResultRequest;
import ru.starashchuk.jocks.leaderboard.model.Category;
import ru.starashchuk.jocks.leaderboard.model.Result;
import ru.starashchuk.jocks.leaderboard.model.User;
import ru.starashchuk.jocks.leaderboard.repository.CategoryRepository;
import ru.starashchuk.jocks.leaderboard.repository.ResultRepository;
import ru.starashchuk.jocks.leaderboard.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ResultRepository resultRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public Result addGlobalResult(Integer userId, AddResultRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        Category category = categoryRepository.findBySlug(request.getCategorySlug())
                .orElseThrow(() -> new NotFoundException("Категория не найдена"));

        Result result = new Result();
        result.setUser(user);
        result.setCategory(category);
        result.setValue(request.getValue());
        result.setApproved(true);

        return resultRepository.save(result);
    }

    @Transactional
    public Result updateResult(Integer id, AddResultRequest request) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Результат не найден"));
        Category category = categoryRepository.findBySlug(request.getCategorySlug())
                .orElseThrow(() -> new NotFoundException("Категория не найдена"));

        result.setValue(request.getValue());
        result.setCategory(category);

        return resultRepository.save(result);
    }

    @Transactional
    public void deleteResult(Integer id) {
        resultRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void changeRole(Integer userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        user.setRole(role);
        userRepository.save(user);
    }
}