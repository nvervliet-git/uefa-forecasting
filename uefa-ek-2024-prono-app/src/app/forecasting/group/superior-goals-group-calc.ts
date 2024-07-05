import { Group } from "../../model/group";
import { Result } from "../../model/results";
import { RankingCriteria } from "./ranking-criteria";
import { GoalsHolder, ResultGroupCalculator, ResultGroupCalculatorResult } from "./result-group-calculator";


// f. higher number of goals scored in all group matches;
export class SuperiorGoalsGroupCalc extends ResultGroupCalculator {

    private atLeastOneElementEqual: boolean = false;
    private firstIterate: boolean = true;

    override compare(result: Result, groupResults: Result[]): ResultGroupCalculatorResult {

        // if (this.firstIterate) {
        //     this.atLeastOneElementEqual =  groupResults.map(gr => gr.goalsFor).some( v => v === groupResults[0].goalsFor )
        //     this.firstIterate = false;
        // }

        this.atLeastOneElementEqual =  groupResults.map(gr => gr.goalsFor).filter( v => v === result.goalsFor ).length > 1;


        if (this.atLeastOneElementEqual) {
            return this.checkNext(result, groupResults);
        }
    
        return {
            compare:  result.goalsFor,
            criteria: RankingCriteria.GOALS
        };    
    }
}
