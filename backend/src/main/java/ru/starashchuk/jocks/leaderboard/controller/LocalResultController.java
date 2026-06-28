package ru.starashchuk.jocks.leaderboard.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.starashchuk.jocks.leaderboard.dto.ResultDto;
import ru.starashchuk.jocks.leaderboard.mapper.ResultMapper;
import ru.starashchuk.jocks.leaderboard.model.AddResultRequest;
import ru.starashchuk.jocks.leaderboard.model.Result;
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

    @PostMapping("/results")
    public ResponseEntity<ResultDto> addResult(@Valid @RequestBody AddResultRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Result result = localResultService.addResult(username, request);
        return ResponseEntity.ok(resultMapper.toDto(result));
    }

    @DeleteMapping("/results/{id}")
    public ResponseEntity<Void> deleteResult(@PathVariable Integer id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        localResultService.deleteResult(username, id);
        return ResponseEntity.noContent().build();
    }
}