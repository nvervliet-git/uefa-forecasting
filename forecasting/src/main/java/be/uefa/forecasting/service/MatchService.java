package be.uefa.forecasting.service;

import be.uefa.forecasting.dto.*;
import be.uefa.forecasting.entity.*;
import be.uefa.forecasting.repository.GroupMatchesRepository;
import be.uefa.forecasting.repository.TeamRepository;
import be.uefa.forecasting.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private TeamRepository teamRepository;

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

    public void registerResults(final String name, final Integer year, final List<GroupMatchResultHolder> groupMatchResultHolder) {
        Assert.hasText(name, "No username provided");
        Assert.notNull(year, "No season year provided");
        Assert.notEmpty(groupMatchResultHolder, "No results of matches provided");


        UserEntity userEntity = userRepository.findByEmailIgnoreCase(name);
        if (userEntity == null) {
            throw new UsernameNotFoundException("User not found");
        }

        groupMatchResultHolder.forEach(holder -> holder.teamMatchResultHolder().forEach(resultHolder -> {
            TeamEntity teamEntity = teamRepository.findByName(resultHolder.getName()).orElseThrow();
            for (MatchResult matchResult : resultHolder.getMatches()) {
                TeamEntity opponentEntity = teamRepository.findByName(matchResult.getOpponent().getName()).orElseThrow();
                MatchResultEntity matchResultEntity = new MatchResultEntity(matchResult.getGoalsFor(), matchResult.getOpponent().getGoals(), userEntity, teamEntity, opponentEntity);
                userEntity.addMatchResult(matchResultEntity);
            }
        }));

        userRepository.save(userEntity);
    }
}
