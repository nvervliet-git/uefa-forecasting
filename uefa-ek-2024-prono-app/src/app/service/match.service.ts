import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, share } from 'rxjs';
import { GroupMatch } from '../model/group-match';


export const API_MATCH_URL = 'http://localhost:9200/match'

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private http: HttpClient) { }

  retrieveMatches(seasonYear: number): Observable<GroupMatch[]> {
    return this.http.get<GroupMatch[]>(`${API_MATCH_URL}/group/${seasonYear}`)
    .pipe(
      share()
    )
  }
}
