package be.uefa.forecasting.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

public class MatchResult {
    private int goalsFor;
    private Opponent opponent;

    public int getGoalsFor() {
        return goalsFor;
    }

    public void setGoalsFor(int goalsFor) {
        this.goalsFor = goalsFor;
    }


    public Opponent getOpponent() {
        return opponent;
    }

    public void setOpponent(Opponent opponent) {
        this.opponent = opponent;
    }

    public static class Opponent {
        private String name;
        private int goals;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getGoals() {
            return goals;
        }

        public void setGoals(int goals) {
            this.goals = goals;
        }
    }
}
