import { Group } from "../../model/group";
import { Result } from "../../model/results";
import { Team } from "../../model/team";
import { HigherNumberOfPointCalc } from "./higher-number-of-point-calc";
import { HighestGoalsMatchCalc } from "./highest-goals-match-calc";
import { RankingCriteria } from "./ranking-criteria";
import { TeamMatchResultHolder } from "./result-group-calculator";
import { SuperiorGoalsMatchCalc } from "./superior-goals-match-calc";

// https://documents.uefa.com/r/Regulations-of-the-UEFA-European-Football-Championship-2022-24/Article-20-Equality-of-points-final-tournament-group-stage-Online
// Article 20 Equality of points – final tournament group stage
// 20.01
// If two or more teams in the same group are equal on points on completion of the final tournament group stage, the following criteria are applied, in the order given, to determine their rankings:

// a. higher number of points obtained in the matches played among the teams in question;
// b. superior goal difference resulting from the matches played among the teams in question;
// c. higher number of goals scored in the matches played among the teams in question;
// d. if, after having applied criteria a) to c), teams still have an equal ranking, criteria a) to c) are reapplied exclusively to the matches between the remaining teams to determine their final rankings. If this procedure does not lead to a decision, criteria e) to h) apply in the order given to the two or more teams still equal:
// e. superior goal difference in all group matches;
// f. higher number of goals scored in all group matches;
// g. ower disciplinary points total based only on yellow and red cards received by players and team officials in all group matches (red card = 3 points, yellow card = 1 point, expulsion for two yellow cards in one match = 3 points);
// h. position in the overall European Qualifiers rankings (see Article 23), or if Germany, the host association team, is involved in the comparison, drawing of lots.

// 20.02
// If two teams which have the same number of points and the same number of goals scored and conceded play their last group match against each other and are still equal at the end of that match, their final rankings are determined by kicks from the penalty mark (see Paragraph 22.03 and Paragraph 22.04), provided that no other teams within the group have the same number of points on completion of all group matches. Should more than two teams have the same number of points, the criteria listed under Paragraph 20.01 apply.
export abstract class ResultMatchCalculator {

    private next: ResultMatchCalculator;
    public static undefinedOrder:string = 'undefined';

    public static getResultMatchHolderMap(results: Result[]): Map<RankingCriteria, HighestComparedValueMapHolder> {
        const mostPoints = Math.max(...results.map(v => v.points));
        const bestGoallDiff = Math.max(...results.map(v => v.goalDifference));
        const mostGoals = Math.max(...results.map(v => v.goalsFor));

        const firstPlaceMapHolder = new Map<RankingCriteria, HighestComparedValueMapHolder>([
            [RankingCriteria.POINTS, {highesValue:mostPoints, teamNameResulMap:new Map([])}],
            [RankingCriteria.GOAL_DIFFERENCE, {highesValue:bestGoallDiff, teamNameResulMap:new Map([])}],
            [RankingCriteria.GOALS, {highesValue:mostGoals, teamNameResulMap:new Map([])}],
            [RankingCriteria.UNDEFINED, {highesValue:0, teamNameResulMap:new Map([])}],
        ]);

        return firstPlaceMapHolder;
    }
    
    public static link(first: ResultMatchCalculator, ...chain: ResultMatchCalculator[]): ResultMatchCalculator {
        let head: ResultMatchCalculator = first;
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
    abstract compare(result: Result, resultAgainst: Result[]): ResultMatchCalculatorResult

    protected checkNext(result: Result, resultAgainst: Result[]): ResultMatchCalculatorResult {
        if (this.next == null) {
            return {
                compare: 0,
                criteria: RankingCriteria.UNDEFINED
            };
        }

        return this.next.compare(result, resultAgainst);
    }
}

export interface HighestComparedValueMapHolder{
    highesValue: number,
    teamNameResulMap: Map<string, TeamMatchResultHolder>
}

export interface ResultMatchCalculatorResult {
    compare: number,
    criteria: RankingCriteria
}
