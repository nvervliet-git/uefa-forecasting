import { Result } from "../../model/results";
import { RankingCriteria } from "./ranking-criteria";
import { ResultMatchCalculator, ResultMatchCalculatorResult } from "./result-match-calculator";

// c. higher number of goals scored in the matches played among the teams in question;
export class HighestGoalsMatchCalc extends ResultMatchCalculator {
   
    private allElementsEqual: boolean = false;
    private firstIterate: boolean = true;

    override compare(result: Result, resultAgainst: Result[]): ResultMatchCalculatorResult {
        if (this.firstIterate) {
            this.allElementsEqual =  resultAgainst.map(gr => gr.goalsFor).every( v => v === resultAgainst[0].goalsFor )
            this.firstIterate = false;
        }

        if (this.allElementsEqual) {
            return this.checkNext(result, resultAgainst);
        }

        return {
            compare: result.goalsFor,
            criteria: RankingCriteria.GOALS
        };    
    }


}
