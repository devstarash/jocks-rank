package ru.starashchuk.jocks.leaderboard.mapper;

import org.mapstruct.Mapper;
import ru.starashchuk.jocks.leaderboard.dto.UserDto;
import ru.starashchuk.jocks.leaderboard.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
}