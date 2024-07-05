package be.uefa.forecasting;

import be.uefa.forecasting.entity.GroupMatchesEntity;
import be.uefa.forecasting.entity.MatchEntity;
import be.uefa.forecasting.entity.TeamEntity;
import be.uefa.forecasting.repository.GroupMatchesRepository;
import be.uefa.forecasting.repository.MatchRepository;
import be.uefa.forecasting.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.util.Assert;

import java.time.Instant;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class JpaTest {

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private GroupMatchesRepository groupMatchesRepository;

    @Test
//    @Transactional
    public void testGroupMatches() {

        final Instant instant = Instant.now();
        TeamEntity homeTeam = new TeamEntity("team 1", "url1");
        TeamEntity awayTeam = new TeamEntity("team 2", "url2");

        TeamEntity team3 = new TeamEntity("team 3", "url3");


        teamRepository.save(homeTeam);
        teamRepository.save(awayTeam);
        teamRepository.save(team3);


        MatchEntity matchEntity = new MatchEntity(1L, instant, homeTeam, awayTeam);
//        homeTeam.setMatchEntity(matchEntity);
//        awayTeam.setMatchEntity(matchEntity);
//        matchRepository.save(matchEntity);
////

        MatchEntity matchEntity2 = new MatchEntity(2L, instant, awayTeam, homeTeam);

        MatchEntity matchEntity3 = new MatchEntity(3L, instant, homeTeam, team3);


        GroupMatchesEntity groupMatchesEntity = new GroupMatchesEntity(2024, 1L, "group 1");
        groupMatchesEntity.addMatch(matchEntity);
        groupMatchesEntity.addMatch(matchEntity2);
        groupMatchesEntity.addMatch(matchEntity3);
        matchEntity.setGroupMatch(groupMatchesEntity);
        matchEntity2.setGroupMatch(groupMatchesEntity);
        matchEntity3.setGroupMatch(groupMatchesEntity);

        GroupMatchesEntity save = groupMatchesRepository.save(groupMatchesEntity);
        Assert.notNull(save.getId(), "not PK");

        matchRepository.findAll();
    }
}
