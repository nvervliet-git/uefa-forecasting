import { NgFor, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, merge } from 'rxjs';
import { MatchHolder, ResultGroupCalculator, TeamMatchResultHolder } from '../group/result-group-calculator';
import { HighestComparedValueMapHolder, ResultMatchCalculator } from '../group/result-match-calculator';
import { HigherNumberOfPointCalc } from '../group/higher-number-of-point-calc';
import { SuperiorGoalsMatchCalc } from '../group/superior-goals-match-calc';
import { HighestGoalsMatchCalc } from '../group/highest-goals-match-calc';
import { Result } from '../../model/results';
import { SuperiorGoalsGroupCalc } from '../group/superior-goals-group-calc';
import { SuperiorGoalDiffGroupCalc } from '../group/superior-goal-diff-group-calc';
import { RankingCriteria } from '../group/ranking-criteria';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { moveItemInArray, CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';


export interface ITeam {
  name: string,
  logo: string,
  goals: number
}

export interface IGroupMatch {
 homeTeam: ITeam
 awayTeam: ITeam
}

export interface IGroupMatchResultHolder {
  id: number,
  groupName: string,
  groupOrder: number,
  active: boolean,
  teamMatchResultHolder: TeamMatchResultHolder[], 
}

@Component({
  selector: 'app-forecasting-result',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule, ReactiveFormsModule, SafeHtmlPipe, DragDropModule],
  templateUrl: './forecasting-result.component.html',
  styleUrl: './forecasting-result.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastingResultComponent implements OnInit, OnChanges {
 
  @Input() obsGroupMatchesValue$?: Observable<any>;

  @Input() groupResults: IGroupMatchResultHolder
  @Output() groupResultsOut = new EventEmitter<TeamMatchResultHolder[]>();

  groupName: string;
  ranking: TeamMatchResultHolder[] = [];
  obsGroupMatchValue$: Observable<any>;

  underterminedRankingIndexHolder: number[][] = [];
  tableBodyInnerHtml: any ;


  // get groupMatchesArray(): FormGroup[] {
  //   return (this.forecastingResultForm?.get('matchDtoList') as FormArray<FormGroup>).controls;
  // }
  constructor(private cdr: ChangeDetectorRef){}

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected');
    const changedgroupResults:IGroupMatchResultHolder = changes['groupResults']?.currentValue;
    this.groupName = changedgroupResults.groupName;
    if (changedgroupResults != null && !changes['groupResults']?.firstChange) {
      this.ranking = []; // reset
      this.underterminedRankingIndexHolder = [];
      const resultPlaceMapHolder = new Map<number, TeamMatchResultHolder[]>();
      changedgroupResults.teamMatchResultHolder.forEach(teamMatch => {
        const points = teamMatch.result.points;
        if (resultPlaceMapHolder.has(points)) {
          resultPlaceMapHolder.get(points)?.push(teamMatch);
        } else {
          resultPlaceMapHolder.set(points, [teamMatch])
        }
      });

      console.log(resultPlaceMapHolder);

      resultPlaceMapHolder.forEach((value: TeamMatchResultHolder[], key: number) => {
        if (value.length === 1) {
          console.log('first place determined');
          this.setRankingDetermination(value[0], true);
          value[0].order =  this.ranking.length;
          this.ranking.push(value[0]);
        } else {
          this.determineRanking(value);
        }      
      });

      console.log(`undetermined index holder: ${this.underterminedRankingIndexHolder}`);
    } else if (changedgroupResults != null && changes['groupResults']?.firstChange) {
      this.groupName = this.groupResults.groupName;
      this.ranking = this.groupResults.teamMatchResultHolder;
    }

    this.groupResultsOut.emit(this.ranking);
   
  }

  private determineRanking(teamMatchResultHolderFirstPlace: TeamMatchResultHolder[]) {
    if (teamMatchResultHolderFirstPlace.length === 0) {
      return;
    }
    var underlyingMatchResults = this.calculatPlaceBasedOnUnderlyingMatches(teamMatchResultHolderFirstPlace);
    var runnerUp = this.determineOrder(underlyingMatchResults);
    this.calculatPlaceBasedOnGroup(runnerUp, this.groupResults);
    }

  private calculatPlaceBasedOnUnderlyingMatches(teamMatchResultHolderFirstPlace: TeamMatchResultHolder[]): Map<string, HighestComparedValueMapHolder> {
    const teamMatchResultHolderFirstPlaceWithFilteredMatches: TeamMatchResultHolder[] = [];
    teamMatchResultHolderFirstPlace
    .map((firstPlaceTeam: TeamMatchResultHolder) => {
      firstPlaceTeam.matches = firstPlaceTeam.matches.filter((match: MatchHolder) => teamMatchResultHolderFirstPlace.find((teamsToFindInMatches) => teamsToFindInMatches.name === match.opponent.name))
      return firstPlaceTeam;
    }).forEach(val => teamMatchResultHolderFirstPlaceWithFilteredMatches.push(Object.assign({}, val)))
    const caclulatedResultsOfUnderlyingMatches =  teamMatchResultHolderFirstPlaceWithFilteredMatches
    .map((fistPlaceTeams: TeamMatchResultHolder) => {
      if (!fistPlaceTeams.originalResult) {
        fistPlaceTeams.originalResult = fistPlaceTeams.result; 
      } 
      return ResultGroupCalculator.calculateTeamResult(fistPlaceTeams, Result.startResult())
    });

    return this.compareMatchResults(caclulatedResultsOfUnderlyingMatches);
  }

  private compareMatchResults(caclulatedResultsOfUnderlyingMatches: TeamMatchResultHolder[]): Map<string, HighestComparedValueMapHolder> {
    const results: Result[] = caclulatedResultsOfUnderlyingMatches.map(v => v.result);
    const firstPlaceMapHolder: Map<string, HighestComparedValueMapHolder> = ResultMatchCalculator.getResultMatchHolderMap(results);
    const resultMatchCalculator = ResultMatchCalculator.link(
      new HigherNumberOfPointCalc(),
      new SuperiorGoalsMatchCalc(),
      new HighestGoalsMatchCalc()
    )

    caclulatedResultsOfUnderlyingMatches.forEach(team => {
      const value = resultMatchCalculator.compare(team.result, results);
      const mapValue = firstPlaceMapHolder.get(value.criteria);
      const highesValue= mapValue?.highesValue ?? 0; 
      if (value.compare === highesValue) {
        mapValue?.teamNameResulMap.set(team.name, team);
      } else  {
        firstPlaceMapHolder.get(RankingCriteria.UNDEFINED)?.teamNameResulMap.set(team.name, team);
      }
    })

      this.normalize(firstPlaceMapHolder);
      return firstPlaceMapHolder;
  }

  private determineOrder(firstPlaceMapHolder: Map<string, HighestComparedValueMapHolder>): TeamMatchResultHolder[] {
    let winner:boolean = this.determineOrderByRankingCriteria(firstPlaceMapHolder, RankingCriteria.POINTS, RankingCriteria.GOAL_DIFFERENCE, RankingCriteria.GOALS);
    const mapHolder = firstPlaceMapHolder.get(RankingCriteria.UNDEFINED);
    if (winner) {
      console.log('determine runner up)');
      var runnerUp = Array.from(mapHolder?.teamNameResulMap.values() ?? []);
      if (runnerUp.length === 1) {
        this.setRankingDetermination(runnerUp[0], true);
        runnerUp[0].result =  runnerUp[0].originalResult ?? Result.startResult();
        runnerUp[0].order = this.ranking.length;
        this.ranking.push(runnerUp[0]);
        mapHolder?.teamNameResulMap.delete(runnerUp[0].name);
      } else {;
        const runerUpMapHolder = this.compareMatchResults(runnerUp);
        runnerUp = this.determineOrder(runerUpMapHolder)
        this.determineRanking(runnerUp);
      }
      return [];
    }

    //Undefined ranking move to compare with group
    return Array.from(mapHolder?.teamNameResulMap.values() ?? []);
  }

  private determineOrderByRankingCriteria(firstPlaceMapHolder: Map<string, HighestComparedValueMapHolder>, ...rankingCriterias: RankingCriteria[]): boolean {
    for (let rankingCriteria of rankingCriterias) {
      const mapHolder = firstPlaceMapHolder.get(rankingCriteria)
      const firtsPlacePointslength = mapHolder?.teamNameResulMap.size ?? 0;
      if (firtsPlacePointslength == 1) {
        //TODO fix delete
        let winner:TeamMatchResultHolder = mapHolder?.teamNameResulMap.values().next().value;
        console.log('absolute winner found based on points between underlying matches:' + winner);
        this.setRankingDetermination(winner, true);
        winner.result = winner.originalResult ?? Result.startResult();
        winner.order = this.ranking.length;
        this.ranking.push(winner);
        mapHolder?.teamNameResulMap.delete(winner.name);
        return true;
      }
      // if (firtsPlacePointslength > 1) {
      //   console.log('need to find winner of winner found based on points between underlying matches');
      //   var values = (Array.from(mapHolder?.teamNameResulMap.values() ?? []));
      //   this.determineRanking(values);
      //   console.log('recursion complete' + values);
      //   values.forEach(element => {
      //     mapHolder?.teamNameResulMap.delete(element.name);
      //   });
      // }
      if (firtsPlacePointslength > 1) {
        console.log('need to find winner of winner found based on points between underlying matches');
        var runnerUp = (Array.from(mapHolder?.teamNameResulMap.values() ?? []));
        this.calculatPlaceBasedOnGroup(runnerUp, this.groupResults);
      }
    }
 
    return false;
  }


  private determineGroupOrderByRankingCriteria(groupPlaceMapHolder: Map<string, HighestComparedValueMapHolder>, ...rankingCriterias: RankingCriteria[]): void {
    for (let rankingCriteria of rankingCriterias) {
      const mapHolder = groupPlaceMapHolder.get(rankingCriteria)
      const firtsPlacePointslength = mapHolder?.teamNameResulMap.size ?? 0;
      if (firtsPlacePointslength == 1) {
        //TODO fix delete
        let winner:TeamMatchResultHolder = mapHolder?.teamNameResulMap.values().next().value;
        console.log('absolute winner found based on points between underlying matches:' + winner);
        this.setRankingDetermination(winner, true);
        winner.result = winner.originalResult ?? Result.startResult();
        winner.order = this.ranking.length;
        this.ranking.push(winner);
        mapHolder?.teamNameResulMap.delete(winner.name);
      }
      if (firtsPlacePointslength > 1) {
        console.log('need to find winner of winner found based on points between underlying matches');
        var runnerUp = (Array.from(mapHolder?.teamNameResulMap.values() ?? []));
        this.calculatPlaceBasedOnGroup(runnerUp, this.groupResults);
      }
    }
  }
  
  private calculatPlaceBasedOnGroup(teamMatchResultHolder: TeamMatchResultHolder[], group: IGroupMatchResultHolder): void {
    if (teamMatchResultHolder.length === 0){
      return;
    }
    if (teamMatchResultHolder.length === 1){
      this.setRankingDetermination(teamMatchResultHolder[0], true);
      teamMatchResultHolder[0].result = teamMatchResultHolder[0].originalResult ?? Result.startResult();
      teamMatchResultHolder[0].order = this.ranking.length;
      this.ranking.push(teamMatchResultHolder[0]);
      return;
    }

    const groupResults =  group.teamMatchResultHolder.map(holder => holder.result);
    const results: Result[] = teamMatchResultHolder.map(v => v.originalResult ?? Result.startResult());
    const resultGroupCalculator =  ResultGroupCalculator.link(
      new SuperiorGoalDiffGroupCalc(),
      new SuperiorGoalsGroupCalc()
    );
    const groupPlaceMapHolder: Map<string, HighestComparedValueMapHolder> = ResultGroupCalculator.getResultGroupHolderMap(results);
    teamMatchResultHolder
    .forEach(team => {
      team.result = Object.assign({}, team.originalResult) ?? Result.startResult();
      const value = resultGroupCalculator.compare(team.result, groupResults);
      const mapValue = groupPlaceMapHolder.get(value.criteria);
      const highesValue= mapValue?.highesValue ?? 0; 
      if (value.compare === highesValue) {
        mapValue?.teamNameResulMap.set(team.name, team);
      } else  {
        groupPlaceMapHolder.get(RankingCriteria.UNDEFINED)?.teamNameResulMap.set(team.name, team);
      }
    });

    console.log(groupPlaceMapHolder)
    this.normalize(groupPlaceMapHolder);

    if (!this.shouldContinue(groupPlaceMapHolder, teamMatchResultHolder.length)) {
      const tempUnderterminedIndexHolder: number[] = []
      teamMatchResultHolder.forEach(ru => {
        let undeterminedIndex:number= this.setUndeterminedRankingDetermination(ru);
        tempUnderterminedIndexHolder.push(undeterminedIndex);
      })
      let indexUnderterminedRankingIndexHolder = this.underterminedRankingIndexHolder.push(tempUnderterminedIndexHolder);
      teamMatchResultHolder.forEach(ru => {
       ru.undeterminedGroupIndex = indexUnderterminedRankingIndexHolder;
      })
      return;
    }
    this.determineGroupOrderByRankingCriteria(groupPlaceMapHolder, RankingCriteria.GOAL_DIFFERENCE, RankingCriteria.GOALS, RankingCriteria.UNDEFINED);
  }

  private normalize(firstPlaceMapHolder: Map<string, HighestComparedValueMapHolder>): void {

    var foundNames =  new Set<string>();
    for(let v of firstPlaceMapHolder.values()) {
      if (v.teamNameResulMap.size === 0) {continue}
      for (let k of v.teamNameResulMap.keys()) {
        if (foundNames.has(k)) {
          v.teamNameResulMap.delete(k)
        } else {
          foundNames.add(k);
        }
      }
    }

  }

  private shouldContinue(groupPlaceMapHolder: Map<string, HighestComparedValueMapHolder>, length: number): boolean {

    for (let values of groupPlaceMapHolder.values()) {
      if (values.teamNameResulMap.size === length) {
        return false;
      }
    }
    return true;
  }

  private setRankingDetermination(teamMatchResultHolder:TeamMatchResultHolder, determined: boolean): void {
    teamMatchResultHolder.determined = determined;
  }

  private setUndeterminedRankingDetermination(teamMatchResultHolder:TeamMatchResultHolder): number {
    teamMatchResultHolder.determined = false;
    teamMatchResultHolder.order =  this.ranking.length;
    var index = this.ranking.push(teamMatchResultHolder) - 1;
    return index;
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (this.underterminedRankingIndexHolder.length === 0 || this.underterminedRankingIndexHolder[0].length === 4) {
      //Go
      moveItemInArray(this.ranking, event.previousIndex, event.currentIndex);
      this.groupResultsOut.emit(this.ranking);
      return
    }

    if (this.underterminedRankingIndexHolder.length === 1) {
      // 1 group to handle
      let startIndex = this.underterminedRankingIndexHolder[0][0];
      let endIndex = this.underterminedRankingIndexHolder[0][this.underterminedRankingIndexHolder[0].length-1];
      if (event.currentIndex === 0) {
        event.currentIndex = startIndex;
      } else if (event.currentIndex === this.underterminedRankingIndexHolder[0].length-1) {
        event.currentIndex = endIndex;
      } 

      if (event.previousIndex === 0)  {
        event.previousIndex = startIndex
      } else if (event.previousIndex === this.underterminedRankingIndexHolder[0].length-1)  {
        event.previousIndex = endIndex
      }    
      moveItemInArray(this.ranking, event.previousIndex, event.currentIndex);
    }

    if (this.underterminedRankingIndexHolder.length === 2) {
      // 1 group to handle
      let startIndexGroup1 = this.underterminedRankingIndexHolder[0][0];
      let endIndexGroup1 = this.underterminedRankingIndexHolder[0][this.underterminedRankingIndexHolder[0].length-1];


      let startIndexGroup2 = this.underterminedRankingIndexHolder[1][0];
      let endIndexGroup2 = this.underterminedRankingIndexHolder[1][this.underterminedRankingIndexHolder[1].length-1];

      //Need to stay in group 1
      if (event.previousIndex < startIndexGroup2) {
        if (event.currentIndex >= endIndexGroup1) {
          event.currentIndex = endIndexGroup1;
        }
      }

      //Need to stay in group 2
      if (event.previousIndex > endIndexGroup1) {
        if (event.currentIndex <= startIndexGroup2) {
          event.currentIndex = startIndexGroup2;
        }    
      }
      moveItemInArray(this.ranking, event.previousIndex, event.currentIndex);
    }
    this.groupResultsOut.emit(this.ranking);
  }

}

