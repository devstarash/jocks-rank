package ru.starashchuk.jocks.leaderboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.starashchuk.jocks.leaderboard.dto.OneRepResultDto;
import ru.starashchuk.jocks.leaderboard.dto.ResultDto;
import ru.starashchuk.jocks.leaderboard.mapper.OneRepResultMapper;
import ru.starashchuk.jocks.leaderboard.mapper.ResultMapper;
import ru.starashchuk.jocks.leaderboard.service.OneRepResultService;
import ru.starashchuk.jocks.leaderboard.service.ResultService;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {
    private final OneRepResultService service;
    private final ResultService resultService;
    private final ResultMapper resultMapper;
    private final OneRepResultMapper oneRepResultMapper;

    @GetMapping("/one-rep")
    public ResponseEntity<List<OneRepResultDto>> findAll() {
        List<OneRepResultDto> results = service.getLeaderboard()
                .stream().map(result -> oneRepResultMapper.toDto(result))
                .toList();
        return ResponseEntity.status(200).body(results);
    }

    @GetMapping("/{categorySlug}")
    public ResponseEntity<List<ResultDto>> getLeaderboard(@PathVariable String categorySlug) {
        List<ResultDto> response = resultService.getLeaderboard(categorySlug)
                .stream().map(result -> resultMapper.toDto(result)).toList();
        return ResponseEntity.ok(response);
    }
}
