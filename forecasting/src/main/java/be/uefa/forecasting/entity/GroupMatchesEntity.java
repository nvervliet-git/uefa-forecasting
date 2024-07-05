package be.uefa.forecasting.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "GROUP_MATCHES")
public class GroupMatchesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private Integer seasonYear;

    @Column(nullable = false, unique = true)
    private Long groupId; //From UEFA

    @Column(nullable = false, unique = true)
    private String groupName;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "group", cascade = CascadeType.ALL)
    private List<TeamEntity> teams = new ArrayList<>();

    @OneToMany(
            mappedBy = "groupMatch",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<MatchEntity> groupMatch = new ArrayList<>();




    protected GroupMatchesEntity() {
        // JPA empty constructor
    }


    public GroupMatchesEntity(Integer seasonYear, Long groupId, String groupName) {
        this.seasonYear = seasonYear;
        this.groupId = groupId;
        this.groupName = groupName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSeasonYear() {
        return seasonYear;
    }

    public void setSeasonYear(Integer seasonYear) {
        this.seasonYear = seasonYear;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public List<TeamEntity> getTeams() {
        return teams;
    }

    public void setTeams(List<TeamEntity> teams) {
        this.teams = teams;
    }

    public void addTeam(TeamEntity teamEntity) {
        this.teams.add(teamEntity);
    }


    public List<MatchEntity> getGroupMatch() {
        return groupMatch;
    }

    public void setGroupMatch(List<MatchEntity> groupMatch) {
        this.groupMatch = groupMatch;
    }

    public void addMatch(MatchEntity matchEntity) {
        this.groupMatch.add(matchEntity);
    }
}
