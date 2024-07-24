import { Component, OnInit } from '@angular/core';
import { MatchService } from '../service/match.service';
import { Match } from '../model/match';
import { GroupMatch } from '../model/group-match';
import { CommonModule, NgFor, SlicePipe } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, Validators, FormBuilder, ReactiveFormsModule, AbstractControl, FormControlStatus } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map, of, merge, mergeMap, combineLatest, last, takeLast } from 'rxjs';
import { ForecastingResultComponent, IGroupMatch, IGroupMatchResultHolder, ITeam } from "./forecasting-result/forecasting-result.component";
import { Team } from '../model/team';
import { Result } from '../model/results';
import { Group } from '../model/group';
import { MatchHolder, ResultGroupCalculator, TeamMatchResultHolder } from './group/result-group-calculator';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'app-forecasting',
    standalone: true,
    templateUrl: './forecasting.component.html',
    styleUrl: './forecasting.component.css',
    imports: [NgFor, FormsModule, CommonModule, ReactiveFormsModule, ForecastingResultComponent]
})
export class ForecastingComponent implements OnInit {

  groupMatchResultHolder:IGroupMatchResultHolder[] = [];

  private seasonYear: number = 2024;

  groupMatchesForm!: FormGroup;

  // Observables 
    // Whole formGroup
  obsStatusGroupForm$!: Observable<FormControlStatus>;
  obsValueGroupForm$!: Observable<any>;
    // All matches in a group
  obsGroupMatchesStatus$: Observable<any>;
  obsGroupMatchesValue$: Observable<IGroupMatchResultHolder>;
    // Individual matches
  obsMatchStatus$: Observable<any>;
  obsMatchValue$: Observable<any>;
    // Http Resp 
  obsGroupMatchResp$: Observable<GroupMatch[]>;

  get groupMatchesArray(): FormGroup[] {
    return (this.groupMatchesForm.get('groupMatches') as FormArray<FormGroup>).controls;
  }

  get groupMatches() {
    return <unknown> this.groupMatchesForm.get('groupMatches') as FormArray<FormGroup>;
  }

  get groupMatchesArray2() {
    return this.groupMatchesForm.get('groupMatches') as FormArray;
  }

  matchDtoListArray(fg: FormGroup): FormGroup[] {
    return (fg.get('matchDtoList') as FormArray<FormGroup>).controls;
  }


  constructor(private matchService: MatchService, 
              private fb: FormBuilder) {
    this.groupMatchesForm = this.fb.group({
      groupMatches: this.fb.array([])
    }); 
  }

  identify(index: number, item:any ){
    // console.log(`tracking index: ${index} match id: ${item.controls.matchDtoList.at(index).get('id').value}`);
    return item.get('id').value; 
 }

  identifyMatch(index: number, item:any ){
    // console.log(`tracking match id: ${item.get('id').value}`);
    return item.get('id').value;
  }

  error(arg0: FormGroup): any {

 
    if (arg0.controls['homeTeam'].get('goals')?.errors || arg0.controls['awayTeam'].get('goals')?.errors) {
      console.log('error on goals input detected');
       return true;
    }
    
    return false;
  }
  

  ngOnInit(): void {
    this.getMatches();
  }

  getMatches() {
    this.obsGroupMatchResp$ = this.matchService.retrieveMatches(this.seasonYear);
    this.obsGroupMatchResp$.subscribe({
        next: (response: GroupMatch[]) => {
          this.createGroupMatchesForm(response);
          // Individual match
          this.obsMatchStatus$ = this.createStatusChangeObservable();
          this.obsMatchValue$ = this.createValueChangeObservable();
          // Group matches
          // this.obsGroupMatchesStatus$ = merge(...this.groupMatchesArray
          //   .map((control) => control.get('matchDtoList'))
          //   .map((matchDtoListControl) => matchDtoListControl?.statusChanges.pipe(
          //     map((v) => v + Date.now().toString())
          //   ))
          // );

       
          this.obsGroupMatchesValue$ = merge(...this.groupMatchesArray
            .map((matchDtoListControl, index) => matchDtoListControl?.valueChanges.pipe(
              map((v) => {
                // index + JSON.stringify(v)
                // console.log('value chaneg group result');
                const groupResults: IGroupMatchResultHolder = this.calculateGroupResults(v, index);
          
                return groupResults;
              })
            ))
          );

          // Whole form
          this.obsStatusGroupForm$ = this.groupMatchesForm.statusChanges
          .pipe(
            map((v) => {
              
              console.log(`status: ${v}`);
              return v;
            }),
            
          );
          
          // this.obsValueGroupForm$ = this.groupMatchesForm.valueChanges.pipe(
          //   map((v) => {
          //     // console.log(`whole form value change: ${v}`);
          //     console.log(v);
          //     return v;
          //   })
          // );


          combineLatest([this.obsStatusGroupForm$,  this.obsGroupMatchesValue$])
          .pipe(debounceTime(0))
          .subscribe(([status, values])=>{
            // Do whatever you want with those values here
            
            console.log('combineLatest' + values + status);
            if (status === 'VALID' && this.groupMatches.status === 'VALID') {
              this.groupMatchResultHolder[values.groupOrder] = values;
              return;
            }
          });
        },
        error: (err: any) => {
          console.log(err);
          this.groupMatchesForm.reset();
        }
      })
  }
  createGroupMatchesForm(response: GroupMatch[]) {
    console.log('creating form...');
    response.forEach((groepMatch: GroupMatch, index: number) => {
      const groupMatchFG = this.createGroupMatchFormGroup(groepMatch);
      this.groupMatchResultHolder.push(this.calculateGroupResults(groupMatchFG.value, index));
      this.groupMatches.push(groupMatchFG);
    });
  }

  private createGroupMatchFormGroup(groepMatch :GroupMatch): FormGroup {
    const teams: FormControl[] = groepMatch.teams.map((team: Team) => {
      const teamFC = new FormControl<Team>(team);
      return teamFC;
    });

    const matches: FormGroup[] = groepMatch.matchDtoList.map((match: Match) => {
      const matchFg = this.createMatchFormGroup(match);
      return matchFg;
    });

    return new FormGroup({
      id: new FormControl<number>(groepMatch.id, Validators.required),
      groupName: new FormControl<string>(groepMatch.groupName, Validators.required),
      year: new FormControl<number>(groepMatch.year, Validators.required),
      teams: new FormArray<FormControl>(teams),
      matchDtoList: new FormArray<FormGroup>(matches)
    });
  }

  private createMatchFormGroup(match: Match): FormGroup {
    return new FormGroup({
        id: new FormControl<number>({value: match.matchId, disabled: true}, Validators.required),
        kickOffTime: new FormControl<Date>({value: match.kickOffTime, disabled: true}, Validators.required),
        homeTeam: new FormGroup({
          name: new FormControl<string>(match.homeTeam.name, Validators.required),
          logo: new FormControl<string>(match.homeTeam.logo, Validators.required),
          goals: new FormControl<number>(0, [Validators.required, Validators.min(0),  Validators.pattern("^[0-9]*$")]),
        }),
        awayTeam: new FormGroup({
          name: new FormControl<string>(match.awayTeam.name, Validators.required),
          logo: new FormControl<string>(match.awayTeam.logo, Validators.required),
          goals: new FormControl<number>(0, [Validators.required, Validators.min(0),  Validators.pattern("^[0-9]*$")]),
        })
      });
  }

  createStatusChangeObservable(): Observable<any> {
    return merge(...this.groupMatchesArray
      .map((control, index)  => (<FormGroup>control.get('matchDtoList')).controls)
      .flat()
      .map((control, rowIndex) => 
        (<FormGroup> <unknown> control).statusChanges.pipe(
        map((value) =>  {
          // console.log(`map - index: ${rowIndex} - formOneStatus change: ${value}`);
          return  value + ' - date:'  + Date.now().toString();
        }))));
  }

  createValueChangeObservable(): Observable<any> {
    return merge(...this.groupMatchesArray
      .map((control, index)  => (<FormGroup>control.get('matchDtoList')).controls)
      .flat()
      .map((control, rowIndex) => 
        (<FormGroup> <unknown> control).valueChanges.pipe(
        map((value) =>  {
          console.log(`map - index: ${rowIndex} - formOneStatus change: ${value.toString()}`);
          const blub = <FormGroup><unknown>control;
          return  {
            homeTeam: {
              name: blub.get('homeTeam.name')?.value,
              goals:  value.homeTeam.goals
          },
            awayTeam: {
              name: blub.get('awayTeam.name')?.value,
              goals:  value.awayTeam.goals
          } 
          };
        })
      ))
    );
  }


  registerResult(groupMatch: FormGroup, index: number): void {
    console.log(  groupMatch.get("groupName")?.value, index)

    this.matchService.submitForecastingResult(this.seasonYear, this.groupMatchResultHolder)
      .subscribe({
        next: (res: any) => {
          console.log(`success: ${res}`);
        },
        error: (err: HttpErrorResponse) => {
          console.log(`error: ${err?.error?.message}`);
        }
    });
    
    //TODO register / submit
  }

  private calculateGroupResults(group: any, index: number): IGroupMatchResultHolder {
    const groupName: string = group.groupName;
    const groupId: number = group.id;
    const year: number = group.year;
    const teams: Team[] = group.teams;
    const matches:IGroupMatch[] = group.matchDtoList;

    const teamMatchResultHolder: TeamMatchResultHolder[] = teams.map((team) => {
      const filteredMatches: IGroupMatch[] = matches.filter((match: IGroupMatch) => match.homeTeam.name === team.name || match.awayTeam.name === team.name);
      const teamMatchResult: TeamMatchResultHolder = {
        name: team.name,
        logo: team.logo,
        matches: filteredMatches.map((match) => {
          if (match.awayTeam.name === team.name) {
            return ForecastingComponent.toMatchHolder(match.awayTeam.goals, match.homeTeam);
          } else {
            return ForecastingComponent.toMatchHolder(match.homeTeam.goals, match.awayTeam);
          }
        }),
        result: Result.startResult(),
        determined: false
      }
      return teamMatchResult;
    });

    const teamsWithResult:TeamMatchResultHolder[] = ResultGroupCalculator.calculateResults(teamMatchResultHolder);
    console.log('Results calculated.');
    return <IGroupMatchResultHolder> {
      id: groupId,
      groupName: groupName,
      active: true,
      groupOrder: index,
      teamMatchResultHolder: teamsWithResult
    } ;
  } 

  my_handler(ev: any, index: number, obj:FormGroup): void {
    console.log(ev, index);
 }

 logOut(groupMatch: IGroupMatchResultHolder, event: TeamMatchResultHolder[]) {
    console.log(groupMatch.groupName, event)
    groupMatch.teamMatchResultHolder = event;
 }

 private static toMatchHolder(goalsFor: number, opponent: ITeam): MatchHolder {
  return {
    goalsFor,
    opponent: {
      name: opponent.name,
      logo: opponent.logo,
      goals: opponent.goals
    }
  }
}
}

