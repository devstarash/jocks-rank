package ru.starashchuk.jocks.leaderboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.starashchuk.jocks.leaderboard.model.Result;
import ru.starashchuk.jocks.leaderboard.repository.ResultRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultService {
    private final ResultRepository resultRepository;

    public List<Result> getLeaderboard(String slug) {
        List<Result> results = resultRepository.findByCategorySlug(slug);
        return results;
    }

    public List<Result> getByUserId(Integer userId) {
        List<Result> results = resultRepository.findByUserId(userId);
        return results;
    }

    public Result save(Result result) {
        Result savedResult = resultRepository.save(result);
        return savedResult;
    }
}
