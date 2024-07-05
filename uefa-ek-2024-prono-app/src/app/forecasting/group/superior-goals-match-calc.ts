import { Result } from "../../model/results";
import { RankingCriteria } from "./ranking-criteria";
import { ResultMatchCalculator, ResultMatchCalculatorResult } from "./result-match-calculator";

// b. superior goal difference resulting from the matches played among the teams in question;
export class SuperiorGoalsMatchCalc extends ResultMatchCalculator {
   
    private allElementsEqual: boolean = false;
    private firstIterate: boolean = true;

    override compare(result: Result, resultAgainst: Result[]): ResultMatchCalculatorResult {

        if (this.firstIterate) {
            this.allElementsEqual =  resultAgainst.map(gr => gr.goalDifference).every( v => v === resultAgainst[0].goalDifference )
            this.firstIterate = false;
        }

        if (this.allElementsEqual) {
            return this.checkNext(result, resultAgainst);
        }

        return {
            compare: result.goalDifference,
            criteria: RankingCriteria.GOAL_DIFFERENCE
        };      
     }
    
 
}
