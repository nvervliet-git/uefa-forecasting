import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GroupsOverviewComponent } from "./groups-overview/groups-overview.component";
import { MenuComponent } from "./menu/menu.component";
import { LoginComponent } from './login/login.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, GroupsOverviewComponent, MenuComponent, LoginComponent], 
})
export class AppComponent {
  title = 'uefa-ek-2024-prono-app';
}
