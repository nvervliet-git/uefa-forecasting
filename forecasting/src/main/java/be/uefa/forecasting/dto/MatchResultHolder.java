package be.uefa.forecasting.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import java.util.List;

public class MatchResultHolder {
    private String name;
    private List<MatchResult> matches;
    private Result result;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<MatchResult> getMatches() {
        return matches;
    }

    public void setMatches(List<MatchResult> matches) {
        this.matches = matches;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }

    public static class Result
    {
        private int drawn;
        private int goalDifference;
        private int goalsAgainst;
        private int goalsFor;
        private int lost;
        private int played;
        private int points;
        private boolean qualified;
        private int rank;
        private int won;

        public int getDrawn() {
            return drawn;
        }

        public void setDrawn(int drawn) {
            this.drawn = drawn;
        }

        public int getGoalDifference() {
            return goalDifference;
        }

        public void setGoalDifference(int goalDifference) {
            this.goalDifference = goalDifference;
        }

        public int getGoalsAgainst() {
            return goalsAgainst;
        }

        public void setGoalsAgainst(int goalsAgainst) {
            this.goalsAgainst = goalsAgainst;
        }

        public int getGoalsFor() {
            return goalsFor;
        }

        public void setGoalsFor(int goalsFor) {
            this.goalsFor = goalsFor;
        }

        public int getLost() {
            return lost;
        }

        public void setLost(int lost) {
            this.lost = lost;
        }

        public int getPlayed() {
            return played;
        }

        public void setPlayed(int played) {
            this.played = played;
        }

        public int getPoints() {
            return points;
        }

        public void setPoints(int points) {
            this.points = points;
        }

        public boolean isQualified() {
            return qualified;
        }

        public void setQualified(boolean qualified) {
            this.qualified = qualified;
        }

        public int getRank() {
            return rank;
        }

        public void setRank(int rank) {
            this.rank = rank;
        }

        public int getWon() {
            return won;
        }

        public void setWon(int won) {
            this.won = won;
        }
    }
}
