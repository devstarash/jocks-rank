package ru.starashchuk.jocks.leaderboard.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.starashchuk.jocks.leaderboard.exception.AccessDeniedException;
import ru.starashchuk.jocks.leaderboard.exception.AlreadyExistsException;
import ru.starashchuk.jocks.leaderboard.exception.ExceptionResponse;
import ru.starashchuk.jocks.leaderboard.exception.NotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleNotFound(NotFoundException ex) {
        ExceptionResponse response = new ExceptionResponse(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(AlreadyExistsException.class)
    public ResponseEntity<ExceptionResponse> handleAlreadyExists(AlreadyExistsException ex) {
        ExceptionResponse response = new ExceptionResponse(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ExceptionResponse> handleAccessDenied(AccessDeniedException ex) {
        ExceptionResponse response = new ExceptionResponse(ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage()).findFirst()
                .orElse("Ошибка валидации");
        ExceptionResponse response = new ExceptionResponse(message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}