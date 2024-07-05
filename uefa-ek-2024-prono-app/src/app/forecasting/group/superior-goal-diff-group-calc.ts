import { Group } from "../../model/group";
import { Result } from "../../model/results";
import { RankingCriteria } from "./ranking-criteria";
import { GoalsHolder, ResultGroupCalculator, ResultGroupCalculatorResult } from "./result-group-calculator";


// e. superior goal difference in all group matches;
export class SuperiorGoalDiffGroupCalc extends ResultGroupCalculator {

    private atLeastOneElementEqual: boolean = false;
    private firstIterate: boolean = true;

    override compare(result: Result, groupResults: Result[]): ResultGroupCalculatorResult {

        // if (this.firstIterate) {
        //     this.atLeastOneElementEqual =  groupResults.map(gr => gr.goalDifference).some( v => v === result.goalDifference )
        //     this.firstIterate = false;
        // }
        this.atLeastOneElementEqual =  groupResults.map(gr => gr.goalDifference).filter( v => v === result.goalDifference ).length > 1;
        

        if (this.atLeastOneElementEqual) {
            return this.checkNext(result, groupResults);
        }

        return {
            compare: result.goalDifference,
            criteria: RankingCriteria.GOAL_DIFFERENCE
        }; 
    }

}
