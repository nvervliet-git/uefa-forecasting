import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, share } from 'rxjs';
import { GroupMatch } from '../model/group-match';
import { BasicAuthService } from './http/basic-auth.service';
import { IGroupMatchResultHolder } from '../forecasting/forecasting-result/forecasting-result.component';


export const API_MATCH_URL = 'http://localhost:9200/match'

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private http: HttpClient, private basicAuthService: BasicAuthService) { }

  retrieveMatches(seasonYear: number): Observable<GroupMatch[]> {
    return this.http.get<GroupMatch[]>(`${API_MATCH_URL}/group/${seasonYear}`)
    .pipe(
      share()
    )
  }

  submitForecastingResult(seasonYear: number, groupMatchResultHolder: IGroupMatchResultHolder[]): Observable<any> {
    return this.http.post<any>(`${API_MATCH_URL}/group/${seasonYear}/register`, groupMatchResultHolder);
  }
}
