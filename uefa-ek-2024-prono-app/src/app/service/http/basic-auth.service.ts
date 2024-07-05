import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

export const API_URL = 'http://localhost:8080'


@Injectable({
  providedIn: 'root'
})
export class BasicAuthService {

  constructor(private http: HttpClient) { }

  getAuthenticateduser() {
    return sessionStorage.getItem('authenticatedUser');
  }
  
  getAuthenticateduserAsString(): string {
    const sessesionUserName = sessionStorage.getItem('authenticatedUser');
    return sessesionUserName ? sessesionUserName : '';
  }

  getAuthenticatedToken() {
    return sessionStorage.getItem('token');
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('authenticatedUser');
    return !(user === null);
  }

  logout(): void  {
    sessionStorage.removeItem('authenticatedUser');
    sessionStorage.removeItem('token');
  }

  executeAuthService(email: string) {
    console.log(`email: ${email}`);
    let basicAuthHeaderString = 'Basic ' + window.btoa(email + ":");
    let headers = new HttpHeaders({
      Authorization: basicAuthHeaderString
    });
    return this.http.get<string>(`${API_URL}/users/login`, {headers}).pipe(
      map(
        data => {
          sessionStorage.setItem('authenticatedUser', email)
          sessionStorage.setItem('token', basicAuthHeaderString)
          return data
        }
      )
    );
  }

}
