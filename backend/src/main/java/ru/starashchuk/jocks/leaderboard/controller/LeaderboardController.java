package ru.starashchuk.jocks.leaderboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.starashchuk.jocks.leaderboard.dto.ResultDto;
import ru.starashchuk.jocks.leaderboard.mapper.ResultMapper;
import ru.starashchuk.jocks.leaderboard.model.OneRepResult;
import ru.starashchuk.jocks.leaderboard.model.Result;
import ru.starashchuk.jocks.leaderboard.service.OneRepResultService;
import ru.starashchuk.jocks.leaderboard.service.ResultService;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {
    private final OneRepResultService service;
    private final ResultService resultService;
    private final ResultMapper mapper;

    @GetMapping("/one-rep")
    public ResponseEntity<List<OneRepResult>> findAll() {
        List<OneRepResult> result = service.getLeaderboard();
        return ResponseEntity.status(200).body(result);
    }

    @GetMapping("/{categorySlug}")
    public ResponseEntity<List<ResultDto>> getLeaderboard(@PathVariable String categorySlug) {
        List<ResultDto> response = resultService.getLeaderboard(categorySlug)
                .stream().map(result -> mapper.toDto(result)).toList();
        return ResponseEntity.ok(response);
    }
}
