package ru.starashchuk.jocks.leaderboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.starashchuk.jocks.leaderboard.model.OneRepResult;
import ru.starashchuk.jocks.leaderboard.repository.OneRepResultRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OneRepResultService {
    private final OneRepResultRepository oneRepResultRepository;

    public List<OneRepResult> getLeaderboard() {
        return oneRepResultRepository.findAll();
    }

    public List<OneRepResult> getByUserId(Integer userId) {
        return oneRepResultRepository.findByUserId(userId);
    }

    public OneRepResult save(OneRepResult result) {
        return oneRepResultRepository.save(result);
    }
}