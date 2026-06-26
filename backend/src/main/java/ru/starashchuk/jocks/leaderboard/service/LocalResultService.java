package ru.starashchuk.jocks.leaderboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.starashchuk.jocks.leaderboard.mapper.ResultMapper;
import ru.starashchuk.jocks.leaderboard.model.Result;
import ru.starashchuk.jocks.leaderboard.model.User;
import ru.starashchuk.jocks.leaderboard.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocalResultService {

    private final UserRepository userRepository;
    private final ResultService resultService;

    @Transactional(readOnly = true)
    public List<Result> getMyResults(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        return resultService.getByUserId(user.getId());
    }

}
