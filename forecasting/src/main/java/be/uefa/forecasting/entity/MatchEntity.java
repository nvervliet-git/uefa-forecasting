package be.uefa.forecasting.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "MATCH")
public class MatchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long matchId; //From UEFA

    @Column(nullable = false)
    @Basic
    private Instant kickOffTime; //From UEFA

//    @OneToOne(targetEntity = TeamEntity.class, fetch = FetchType.EAGER)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "home_team_id", referencedColumnName = "id", unique = false)
    private TeamEntity homeTeam;

//    @OneToOne(targetEntity = TeamEntity.class, fetch = FetchType.EAGER)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "away_team_id", referencedColumnName = "id", unique = false)
    private TeamEntity awayTeam;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "group_match_id", referencedColumnName = "id", nullable = false, updatable = false)
    private GroupMatchesEntity groupMatch;

    protected MatchEntity() {
    }

    public MatchEntity(Long matchId, Instant kickOffTime, TeamEntity homeTeam, TeamEntity awayTeam) {
        this.matchId = matchId;
        this.kickOffTime = kickOffTime;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMatchId() {
        return matchId;
    }

    public void setMatchId(Long matchId) {
        this.matchId = matchId;
    }

    public Instant getKickOffTime() {
        return kickOffTime;
    }

    public void setKickOffTime(Instant kickOffTime) {
        this.kickOffTime = kickOffTime;
    }

    public TeamEntity getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(TeamEntity homeTeam) {
        this.homeTeam = homeTeam;
    }

    public TeamEntity getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(TeamEntity awayTeam) {
        this.awayTeam = awayTeam;
    }

    public GroupMatchesEntity getGroupMatch() {
        return groupMatch;
    }

    public void setGroupMatch(GroupMatchesEntity groupMatch) {
        this.groupMatch = groupMatch;
    }
}
