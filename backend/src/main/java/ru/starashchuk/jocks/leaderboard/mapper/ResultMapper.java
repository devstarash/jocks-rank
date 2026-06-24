package ru.starashchuk.jocks.leaderboard.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import ru.starashchuk.jocks.leaderboard.dto.ResultDto;
import ru.starashchuk.jocks.leaderboard.model.Result;

@Mapper(componentModel = "spring")
public interface ResultMapper {
    @Mappings({
            @Mapping(source = "user.username", target = "username"),
            @Mapping(source = "category.name", target = "categoryName"),
            @Mapping(source = "category.unit", target = "unit")
    })
    ResultDto toDto(Result result);
}
