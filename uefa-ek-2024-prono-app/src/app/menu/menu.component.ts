import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { BasicAuthService } from '../service/http/basic-auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {



  constructor(private router: Router, 
    public basicAuthService: BasicAuthService
  ) {}

  routeToForecaseting() {
    const user = this.basicAuthService.getAuthenticateduser();
    this.router.navigate(['forecasting', user]);
  }

  logout() {
    this.basicAuthService.logout();
    this.router.navigate(['login']);
  }
}
