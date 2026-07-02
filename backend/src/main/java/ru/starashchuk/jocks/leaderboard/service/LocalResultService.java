package ru.starashchuk.jocks.leaderboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.starashchuk.jocks.leaderboard.exception.AccessDeniedException;
import ru.starashchuk.jocks.leaderboard.exception.NotFoundException;
import ru.starashchuk.jocks.leaderboard.mapper.ResultMapper;
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
public class LocalResultService {

    private final UserRepository userRepository;
    private final ResultService resultService;
    private final CategoryRepository categoryRepository;
    private final ResultRepository resultRepository;

    @Transactional(readOnly = true)
    public List<Result> getMyResults(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        return resultService.getByUserId(user.getId());
    }

    @Transactional
    public Result addResult(String username, AddResultRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        Category category = categoryRepository.findBySlug(request.getCategorySlug())
                .orElseThrow(() -> new NotFoundException("Категория не найдена"));
        Result result = new Result();
        result.setUser(user);
        result.setCategory(category);
        result.setValue(request.getValue());
        result.setApproved(false);
        return resultService.save(result);
    }

    @Transactional
    public void deleteResult(String username, Integer id) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Результат не найден"));
        if (!result.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Нет доступа к этому результату");
        }
        resultRepository.deleteById(id);
    }
}
