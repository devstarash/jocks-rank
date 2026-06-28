package ru.starashchuk.jocks.leaderboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.starashchuk.jocks.leaderboard.dto.ResultDto;
import ru.starashchuk.jocks.leaderboard.dto.UserDto;
import ru.starashchuk.jocks.leaderboard.mapper.ResultMapper;
import ru.starashchuk.jocks.leaderboard.mapper.UserMapper;
import ru.starashchuk.jocks.leaderboard.model.AddResultRequest;
import ru.starashchuk.jocks.leaderboard.model.User;
import ru.starashchuk.jocks.leaderboard.service.AdminService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ResultMapper resultMapper;
    private final UserMapper userMapper;

    @PostMapping("/results/{userId}")
    public ResponseEntity<ResultDto> addGlobalResult(@PathVariable Integer userId, @RequestBody AddResultRequest request) {
        ResultDto response = resultMapper.toDto(adminService.addGlobalResult(userId, request));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/results/{id}")
    public ResponseEntity<ResultDto> updateResult(@PathVariable Integer id, @RequestBody AddResultRequest request) {
        ResultDto response = resultMapper.toDto(adminService.updateResult(id, request));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/results/{id}")
    public ResponseEntity<Void> deleteResult(@PathVariable Integer id) {
        adminService.deleteResult(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getUsers() {
        List<UserDto> users = adminService.getUsers().stream().map(userMapper::toDto).toList();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Void> changeRole(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        adminService.changeRole(id, body.get("role"));
        return ResponseEntity.ok().build();
    }
}