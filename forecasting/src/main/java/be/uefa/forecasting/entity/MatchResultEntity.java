package be.uefa.forecasting.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "MATCH_RESULT")
public class MatchResultEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private int goalsFor;
    @Column(nullable = false)
    private int goalsAgainst;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id", referencedColumnName = "id", unique = false)
    private UserEntity user;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "team_id")
    private TeamEntity team;

    @ManyToOne(targetEntity = TeamEntity.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "opponent_id")
    private TeamEntity opponent;

    protected MatchResultEntity() {
    }

    public MatchResultEntity(int goalsFor, int goalsAgainst, UserEntity user, TeamEntity team, TeamEntity opponent) {
        this.goalsFor = goalsFor;
        this.goalsAgainst = goalsAgainst;
        this.user = user;
        this.team = team;
        this.opponent = opponent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public int getGoalsFor() {
        return goalsFor;
    }

    public void setGoalsFor(int goalsFor) {
        this.goalsFor = goalsFor;
    }

    public int getGoalsAgainst() {
        return goalsAgainst;
    }

    public void setGoalsAgainst(int goalsAgainst) {
        this.goalsAgainst = goalsAgainst;
    }

    public TeamEntity getTeam() {
        return team;
    }

    public void setTeam(TeamEntity team) {
        this.team = team;
    }

    public TeamEntity getOpponent() {
        return opponent;
    }

    public void setOpponent(TeamEntity opponent) {
        this.opponent = opponent;
    }
}
