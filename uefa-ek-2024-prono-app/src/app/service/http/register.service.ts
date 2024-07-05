import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../../model/user-response';
import { API_URL } from './basic-auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  
  constructor(private http: HttpClient) { }

  register(email:string): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${API_URL}/users/register`, {email});
  }

}
