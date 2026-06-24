package ru.starashchuk.jocks.leaderboard.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Temporal;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;

    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    private String role = "USER";

    @Column(name = "vk_id")
    private Long vkId;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
