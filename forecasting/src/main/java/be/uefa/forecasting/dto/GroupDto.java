package be.uefa.forecasting.dto;

import java.util.List;

public record GroupDto(Long id, String groupName, Integer year, List<TeamDto> teams, List<MatchDto> matchDtoList) {
}
