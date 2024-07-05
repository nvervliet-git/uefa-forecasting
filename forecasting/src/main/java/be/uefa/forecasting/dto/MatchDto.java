package be.uefa.forecasting.dto;

import java.time.Instant;

public record MatchDto(long matchId, Instant kickOffTime, TeamDto homeTeam, TeamDto awayTeam) {
}
