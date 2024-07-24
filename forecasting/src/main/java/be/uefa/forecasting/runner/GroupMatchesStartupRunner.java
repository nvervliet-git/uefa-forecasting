package be.uefa.forecasting.runner;

import be.uefa.forecasting.entity.GroupMatchesEntity;
import be.uefa.forecasting.entity.MatchEntity;
import be.uefa.forecasting.entity.TeamEntity;
import be.uefa.forecasting.repository.GroupMatchesRepository;
import be.uefa.forecasting.repository.MatchRepository;
import be.uefa.forecasting.repository.TeamRepository;
import com.google.gson.Gson;
import com.google.gson.internal.LinkedTreeMap;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.lang.String.valueOf;

@Profile("!test")
@Component
public class GroupMatchesStartupRunner implements CommandLineRunner {

    private static final Logger LOG =
            LoggerFactory.getLogger(GroupMatchesStartupRunner.class);

    private static Type groupMatchesListType = new TypeToken<List<LinkedTreeMap<String, Object>>>() {}.getType();
    private static Gson gson = new Gson();



    @Value("classpath:/ek_2024/*.json")
    private Resource[] groupMatchesResource;

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private MatchRepository matchRepository;
    @Autowired
    private GroupMatchesRepository groupMatchesRepository;

    @Override
    public void run(String... args) throws Exception {
        LOG.info("Loading group matches...");
        Assert.notEmpty(groupMatchesResource, "No matches to load.");
        for (Resource resource: groupMatchesResource) {
            List<LinkedTreeMap<String, Object>> jsonObject = readJson(resource);
            persistJsonObject(jsonObject);
        }
        LOG.info("Group matches loaded OK!");
    }

    private void persistJsonObject(List<LinkedTreeMap<String, Object>> jsonObject) {
        GroupMatchesEntity group = readGroup(jsonObject.get(0).get("group"));
        Map<String, TeamEntity> teams = new LinkedHashMap<>();
        for (LinkedTreeMap<String, Object> linkedTreeMap : jsonObject) {
            TeamEntity homeTeam = readTeam(linkedTreeMap.get("homeTeam"));
            homeTeam = Optional.ofNullable(teams.putIfAbsent(homeTeam.getName(), homeTeam)).orElse(homeTeam);
            TeamEntity awayTeam = readTeam(linkedTreeMap.get("awayTeam"));
            awayTeam = Optional.ofNullable(teams.putIfAbsent(awayTeam.getName(), awayTeam)).orElse(awayTeam);

            Assert.notNull(homeTeam, "home team cannot be null.");
            Assert.notNull(awayTeam, "away team cannot be null.");
            homeTeam.setGroup(group);
            Long matchId = Long.valueOf(linkedTreeMap.get("id").toString());
            Instant kickOffTime = getKickOffTime(linkedTreeMap.get("kickOffTime"));
            MatchEntity matchEntity = new MatchEntity(matchId, kickOffTime, homeTeam, awayTeam);
            group.addMatch(matchEntity);
            matchEntity.setGroupMatch(group);

        }
        group.setTeams(teams.values().stream().toList());
        groupMatchesRepository.save(group);
    }

    private GroupMatchesEntity readGroup(Object group) {
        if (group instanceof LinkedTreeMap<?,?> patternGroup) {
            Long groupId = Long.valueOf((String)patternGroup.get("id"));
            Integer seasonYear = Integer.parseInt(patternGroup.get("seasonYear").toString());
            String groupName = valueOf(((LinkedTreeMap<String, Object>) patternGroup.get("metaData")).get("groupName"));
            return new GroupMatchesEntity(seasonYear, groupId, groupName);
        }
        throw new IllegalStateException("Should not reach here");
    }

    private TeamEntity readTeam(Object team) {
        if (team instanceof LinkedTreeMap<?,?> patternTeam) {
            String name = valueOf(patternTeam.get("internationalName"));
            String imgUrl = valueOf(patternTeam.get("mediumLogoUrl"));
            return new TeamEntity(name, imgUrl);
        }
        throw new IllegalStateException("Should not reach here");
    }
    private Instant getKickOffTime(Object kickOffTime) {
        if (kickOffTime instanceof LinkedTreeMap<?,?> patternKickOffTime) {
            String dateTime = valueOf(patternKickOffTime.get("dateTime"));
            return Instant.parse(dateTime);
        }
        throw new IllegalStateException("Should not reach here");
    }

    private static List<LinkedTreeMap<String, Object>> readJson(Resource resource) throws IOException {
        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            JsonReader jsonReader = new JsonReader(reader);
            Assert.notNull(jsonReader, "no json read");
            List<LinkedTreeMap<String, Object>> result = gson.fromJson(jsonReader, groupMatchesListType);
            Assert.notEmpty(result, "no json read");
            return result;
        } catch (IOException e) {
            LOG.error("Error during startup. Reading json file.", e);
            throw e;
        }
    }
}
