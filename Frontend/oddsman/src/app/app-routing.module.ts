import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Guards */
import { AuthGuard } from './guards/auth.guard';
import { AdminguardGuard } from './guards/adminguard.guard';

/* Admin Panel Components */
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { AdminStatsComponent } from './adminpanel/admincomponents/admin-stats/admin-stats.component';
import { AdminusersComponent } from './adminpanel/admincomponents/adminusers/adminusers.component';
import { AdminTournamentsComponent } from './adminpanel/admincomponents/admin-tournaments/admin-tournaments.component';
import { AdminRequestsComponent } from './adminpanel/admincomponents/admin-requests/admin-requests.component';
import { AdminHistoryComponent } from './adminpanel/admincomponents/history/history.component';
import { EditMatchComponent } from './adminpanel/admincomponents/edit-match/edit-match.component';
import { ResultsComponent } from './adminpanel/admincomponents/results/results.component';

/* User Dashboard Components */
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserstatsComponent } from './dashboard/usercomponents/userstats/userstats.component';
import { UsersettingsComponent } from './dashboard/usercomponents/usersettings/usersettings.component';
import { UserTournamentsComponent } from './dashboard/usercomponents/user-tournaments/user-tournaments.component';
import { SendBetsComponent } from './dashboard/usercomponents/send-bets/send-bets.component';
import { MyBetsComponent } from './dashboard/usercomponents/my-bets/my-bets.component';
import { UserHistoryComponentComponent } from './dashboard/usercomponents/user-history-component/user-history-component.component';

/* Authentication Components */
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';

/* Components not part of a feature module */
import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { StatisticsComponent } from './components/statistics/statistics.component';


const routes: Routes = [
  { path: '', component: HomeComponent }, //index
  { path: 'info', component: InfoComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent,
    children: [
      { path: '', component: UserstatsComponent },
      { path: 'indstillinger', component: UsersettingsComponent },
      { path: 'sendtips', component: SendBetsComponent },
      { path: 'turneringer', component: UserTournamentsComponent },
      { path: 'historik', component: UserHistoryComponentComponent },
      { path: 'historik/:id', component: UserHistoryComponentComponent },
      { path: 'mine-tips', component: MyBetsComponent }
    ]
  },
  {
    path: 'admin', canActivate: [AdminguardGuard], component: AdminpanelComponent,
    children: [
      { path: '', component: AdminStatsComponent },
      { path: 'users', component: AdminusersComponent },
      { path: 'tournaments', component: AdminTournamentsComponent },
      { path: 'historik', component: AdminHistoryComponent },
      { path: 'historik/:id', component: AdminHistoryComponent },
      { path: 'requests', component: AdminRequestsComponent },
      { path: 'requests/:id', component: AdminRequestsComponent },
      { path: 'kampe', component: EditMatchComponent },
      { path: 'resultater', component: ResultsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
