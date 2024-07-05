package be.uefa.forecasting.service;

import be.uefa.forecasting.dto.GroupDto;
import be.uefa.forecasting.dto.MatchDto;
import be.uefa.forecasting.dto.TeamDto;
import be.uefa.forecasting.entity.GroupMatchesEntity;
import be.uefa.forecasting.entity.MatchEntity;
import be.uefa.forecasting.entity.TeamEntity;
import be.uefa.forecasting.repository.GroupMatchesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {

    @Autowired
    private GroupMatchesRepository groupMatchesRepository;

    public List<GroupDto> getGroupMatches(Integer year) {

        List<GroupMatchesEntity> groupBySeasonYear = groupMatchesRepository.findBySeasonYear(year);
        final List<GroupDto> groupDtoList = new LinkedList<>();
        for (GroupMatchesEntity groupMatchesEntity: groupBySeasonYear) {
            GroupDto groupDto = mapMatchesInGroup(groupMatchesEntity);
            groupDtoList.add(groupDto);
        }
        return groupDtoList;
    }

    private static GroupDto mapMatchesInGroup(GroupMatchesEntity groupMatchesEntity) {
        List<MatchDto> matchDtoList = new ArrayList<>();
        final String groupName = groupMatchesEntity.getGroupName();
        final Integer seasonYear = groupMatchesEntity.getSeasonYear();
        final long groupId = groupMatchesEntity.getGroupId();
        List<MatchEntity> groupMatch = groupMatchesEntity.getGroupMatch();
        List<TeamDto> teamDtoList = groupMatchesEntity.getTeams().stream().map(MatchService::mapTeam).toList();;
        for (MatchEntity matchEntity: groupMatch) {
            final TeamDto homeTeam = mapTeam(matchEntity.getHomeTeam());
            final TeamDto awayTeam = mapTeam(matchEntity.getAwayTeam());
            final MatchDto matchDto = new MatchDto(matchEntity.getMatchId(), matchEntity.getKickOffTime(), homeTeam, awayTeam);
            matchDtoList.add(matchDto);
        }
       return new GroupDto(groupId, groupName, seasonYear, teamDtoList, matchDtoList);
    }

    private static TeamDto mapTeam(TeamEntity teamEntity) {
        return new TeamDto(teamEntity.getName(), teamEntity.getImgUrl());
    }
}
