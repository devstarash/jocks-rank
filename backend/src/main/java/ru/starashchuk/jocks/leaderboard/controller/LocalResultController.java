package ru.starashchuk.jocks.leaderboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.starashchuk.jocks.leaderboard.dto.ResultDto;
import ru.starashchuk.jocks.leaderboard.mapper.ResultMapper;
import ru.starashchuk.jocks.leaderboard.service.LocalResultService;

import java.util.List;

@RestController
@RequestMapping("/me")
@RequiredArgsConstructor
public class LocalResultController {

    private final LocalResultService localResultService;
    private final ResultMapper resultMapper;

    @GetMapping("/results")
    public ResponseEntity<List<ResultDto>> getMyResults() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        List<ResultDto> results = localResultService.getMyResults(username)
                .stream().map(resultMapper::toDto).toList();
        return ResponseEntity.ok(results);
    }
}