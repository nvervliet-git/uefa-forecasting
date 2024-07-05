import { Result } from "../../model/results";
import { RankingCriteria } from "./ranking-criteria";
import { ResultMatchCalculator, ResultMatchCalculatorResult } from "./result-match-calculator";

// a. higher number of points obtained in the matches played among the teams in question;
export class HigherNumberOfPointCalc extends ResultMatchCalculator {

    // a -> b = -1
    // 1 - 1
    // a -> c = 2
    // 2 - 2

    // b -> c = 0
    // 2 - 2

    // a , b , c
    // a, c ,b

  
    private allElementsEqual: boolean = false;
    private firstIterate: boolean = true;

    override compare(result: Result, resultAgainst: Result[]): ResultMatchCalculatorResult {
        if (this.firstIterate) {
            this.allElementsEqual =  resultAgainst.map(gr => gr.points).every( v => v === resultAgainst[0].points )
            this.firstIterate = false;
        }

        if (this.allElementsEqual) {
            return this.checkNext(result, resultAgainst);
        }

        return {
            compare: result.points,
            criteria: RankingCriteria.POINTS
        };   
    }


}
