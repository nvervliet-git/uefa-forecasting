import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { EMPTY, Observable, finalize, of, share, timeout } from 'rxjs';
import { UserResponse } from '../model/user-response';
import { BasicAuthService } from '../service/http/basic-auth.service';
import { RegisterService } from '../service/http/register.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule, MatProgressSpinnerModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  obsResponseMessage$!: Observable<UserResponse>;
  errorMessage: String = '';

  email:string = '';
  defaultErrorMessage = 'Invalid Credentials';
  invalidLogin = false
  error = false
  registered = false
  loading = false;

  constructor(private router: Router, 
    private basicAuthService: BasicAuthService,
    private registerService: RegisterService,
  ) {}

  handleBasicAuthLogin() {
    this.loading = true;
    this.resetVariables();
    this.basicAuthService.executeAuthService(this.email)
    .pipe(
      finalize(() => this.loading = false),
      share()
    )
    .subscribe({
      next: (res: any) => {
        console.log(res);
        this.invalidLogin = false;
        this.error = false;
        this.router.navigate(['forecasting', this.email]);
      },
      error: (err: any) => {
        console.log(err);
        this.invalidLogin = true;
        this.error = true;
      }
    })
  }

  register() {
    this.loading = true;
    this.resetVariables();

    this.obsResponseMessage$ = this.registerService.register(this.email)
      .pipe(
        finalize(() => this.loading = false),
        share()
      );
    this.obsResponseMessage$
      .subscribe({
        next: (res: UserResponse) => {
          console.log(`success: ${res.responseMessage}`);
          this.registered = true;
          this.error = false;
        },
        error: (err: HttpErrorResponse) => {
          console.log(`error: ${err?.error?.message}`);
          this.registered = false;
          this.error = true;
          this.errorMessage = err?.error?.message;
        }
    })
  }

  private resetVariables(): void {
    this.invalidLogin = false
    this.error = false
    this.registered = false
    this.errorMessage = '';
    this.obsResponseMessage$ = EMPTY;
  }
}
