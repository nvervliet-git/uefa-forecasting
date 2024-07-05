import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable, map, share } from 'rxjs';
import { Group } from '../../model/group';
import { Team } from '../../model/team';
import { Result } from '../../model/results';

export const UEFA_API_URL = 'https://standings.uefa.com/v1/standings'

@Injectable({
  providedIn: 'root'
})
export class GroupService {


  private httpClient: HttpClient;

  constructor(private httpBackend: HttpBackend) { 
    this.httpClient = new HttpClient(httpBackend);
  }

  retrieveGroups(competitionId: number, phase: string, seasonYear: number): Observable<Group[]> {
    return this.httpClient.get<any[]>(`${UEFA_API_URL}`, {
      params: {
        competitionId,
        phase,
        seasonYear
      }
    } )
    .pipe(
      map(
        (_response: any[]) => {
          const groups: Group[] = [];
          _response.forEach((respGroup:any) => {

            let teams: Team[] = [];
            let results: Result[] = [];
            respGroup.items.forEach((item:any) => {
              const team: Team = this.mapTeam(item)
              teams.push(team);
            })
            const group: Group = this.mapGroup(respGroup.group, respGroup.round, teams)
            groups.push(group);
          })
          return groups;
        }
      ),
      share()
    )
  }

  private mapTeam(teamAndResult: any): Team {
    const result = new Result(teamAndResult.team.id, teamAndResult.drawn, teamAndResult.goalDifference, teamAndResult.goalsAgainst, teamAndResult.goalsFor, teamAndResult.isLive, teamAndResult.isOverridden, teamAndResult.lost, teamAndResult.played, teamAndResult.points, teamAndResult.qualified, teamAndResult.rank, teamAndResult.won);
    return new Team(teamAndResult.team.id, teamAndResult.team.internationalName, teamAndResult.team.mediumLogoUrl, result);
  }

  private mapGroup(group: any, round: any, teams: Team[]): Group {
    return new Group(group.id, group.metaData.groupName, group.order, round.active, round.mode, teams);
  }


}
