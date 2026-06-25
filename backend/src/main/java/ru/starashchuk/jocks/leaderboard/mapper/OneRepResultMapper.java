package ru.starashchuk.jocks.leaderboard.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.starashchuk.jocks.leaderboard.dto.OneRepResultDto;
import ru.starashchuk.jocks.leaderboard.model.OneRepResult;

@Mapper(componentModel = "spring")
public interface OneRepResultMapper {

    @Mapping(source = "user.username", target = "username")
    OneRepResultDto toDto(OneRepResult result);
}