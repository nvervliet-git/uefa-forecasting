import { Result } from "../../model/results";
import { ITeam } from "../forecasting-result/forecasting-result.component";
import { RankingCriteria } from "./ranking-criteria";
import { HighestComparedValueMapHolder } from "./result-match-calculator";

export abstract class ResultGroupCalculator {

    private next: ResultGroupCalculator;

    public static getResultGroupHolderMap(results: Result[]): Map<RankingCriteria, HighestComparedValueMapHolder> {
        const bestGoallDiff = Math.max(...results.map(v => v.goalDifference));
        const mostGoals = Math.max(...results.map(v => v.goalsFor));
        const firstPlaceMapHolder = new Map<RankingCriteria, HighestComparedValueMapHolder>([
            [RankingCriteria.GOAL_DIFFERENCE, {highesValue:bestGoallDiff, teamNameResulMap:new Map([])}],
            [RankingCriteria.GOALS, {highesValue:mostGoals, teamNameResulMap:new Map([])}],
            [RankingCriteria.UNDEFINED, {highesValue:0, teamNameResulMap:new Map([])}],
        ]);

        return firstPlaceMapHolder;
    }

    protected nonUnique = (a: any[]) => new Set(a).size !== a.length;

    
    public static link(first: ResultGroupCalculator, ...chain: ResultGroupCalculator[]): ResultGroupCalculator {
        let head: ResultGroupCalculator = first;
        chain.forEach(nextInCHain => {
            head.next = nextInCHain;
            head = nextInCHain;
        });
        return first;
    }

    //     It should return a number where:

    // A negative value indicates that a (remember) should come before b (teamMatchAgainst).
    // A positive value indicates that a should come after b.
    // Zero or NaN indicates that a and b are considered equal.
    // To memorize this, remember that (a, b) => a - b sorts numbers in ascending order.
    // compareFn(a, b) return value	sort order
    // > 0	sort a after b, e.g. [b, a]
    // < 0	sort a before b, e.g. [a, b]
    // === 0	keep original order of a and b
    abstract compare(result: Result, groupResults: Result[]): ResultGroupCalculatorResult

    protected checkNext(result: Result, groupResults: Result[]): ResultGroupCalculatorResult {
        if (this.next == null) {
            return {
                compare: 0,
                criteria: RankingCriteria.UNDEFINED
            };
        }
        return this.next.compare(result, groupResults);
    }

    
  public static calculateResults(teamGroupMatches: TeamMatchResultHolder[]): TeamMatchResultHolder[] {
    return teamGroupMatches.map((groupMatches: TeamMatchResultHolder) => this.calculateTeamResult(groupMatches, groupMatches.result))
    .sort((a, b) => b.result.points - a.result.points);
  }

  public static calculateTeamResult(groupMatches:TeamMatchResultHolder, result:Result): TeamMatchResultHolder {
    // console.log(`calculating result for team: ${groupMatches.name}`);
    groupMatches.matches.forEach(match => {
        this.calculateResult(match.goalsFor, match.opponent.goals, result);
    });
    groupMatches.result = result;
    return groupMatches;
  }

  private static calculateResult(goalsTeamFor: number, goalsTeamAgainst: number, result:Result): Result {
    result.goalsFor += goalsTeamFor;
    result.goalsAgainst += goalsTeamAgainst;
    result.played++;
    result.goalDifference = result.goalsFor - result.goalsAgainst;
    if (goalsTeamFor === goalsTeamAgainst) {
      result.drawn++;
      result.points++;
    } else if (goalsTeamFor >= goalsTeamAgainst) {
      result.won++;
      result.points += 3;
    } else {
      result.lost ++;
    }
    return result;
  }

}


export interface ResultGroupCalculatorResult {
    compare: number,
    criteria: RankingCriteria
}


export interface TeamMatchResultHolder {
    name: string,
    logo: string,
    matches: MatchHolder[],
    originalResult?: Result,
    result: Result,
    determined?: boolean,
    undeterminedGroupIndex?: number,
    order?: number
}

export interface MatchHolder {
    goalsFor: number,
    opponent: ITeam,
    
}

export interface GoalsHolder {
    goals: number,
    goalDifference:number,
}