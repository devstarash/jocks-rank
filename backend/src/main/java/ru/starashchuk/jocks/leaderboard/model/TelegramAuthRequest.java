package ru.starashchuk.jocks.leaderboard.model;

import lombok.Getter;

@Getter
public class TelegramAuthRequest {
    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String photoUrl;
    private Long authDate;
    private String hash;
}