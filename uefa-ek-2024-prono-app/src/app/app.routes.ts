import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GroupsOverviewComponent } from './groups-overview/groups-overview.component';
import { ForecastingComponent } from './forecasting/forecasting.component';
import { authGuard } from './auth.guard';


export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'groups', component: GroupsOverviewComponent},
    {path: 'forecasting/:email', component: ForecastingComponent, canActivate: [authGuard]},
];
