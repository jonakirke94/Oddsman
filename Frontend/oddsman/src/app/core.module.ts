import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';


import { LoginComponent } from './login/login.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { UsersettingsComponent } from './dashboard/usercomponents/usersettings/usersettings.component';
import { UserstatsComponent } from './dashboard/usercomponents/userstats/userstats.component';
import { AdminStatsComponent } from './adminpanel/admincomponents/admin-stats/admin-stats.component';
import { AdminusersComponent } from './adminpanel/admincomponents/adminusers/adminusers.component';
import { AdminTournamentsComponent } from './adminpanel/admincomponents/admin-tournaments/admin-tournaments.component';
import { AdminRequestsComponent } from './adminpanel/admincomponents/admin-requests/admin-requests.component';
import { UserTournamentsComponent } from './dashboard/usercomponents/user-tournaments/user-tournaments.component';
import { SendBetsComponent } from './dashboard/usercomponents/send-bets/send-bets.component';
import { MyBetsComponent } from './dashboard/usercomponents/my-bets/my-bets.component';
import { HistoryComponent } from './history/history.component';
import { StandingComponent } from './standing/standing.component';
import { AdminHistoryComponent } from './adminpanel/admincomponents/history/history.component';
import { UserHistoryComponentComponent } from './dashboard/usercomponents/user-history-component/user-history-component.component';
import { EditMatchComponent } from './adminpanel/admincomponents/edit-match/edit-match.component';
import { BetFeedComponent } from './bet-feed/bet-feed.component';
import { ResultFeedComponent } from './result-feed/result-feed.component';
import { ResultsComponent } from './adminpanel/admincomponents/results/results.component';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/auth.service';
import { OddsService } from './services/odds.service';
import { TournamentService } from './services/tournament.service';
import { UserService } from './services/user.service';
import { MatchService } from './services/match.service';
import { SocketService } from './services/socket.service';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule

  ],
  declarations: [    
    LoginComponent,
    LoadingSpinnerComponent,
    SignupComponent,
    HomeComponent,
    DashboardComponent,
    AdminpanelComponent,
    UsersettingsComponent,
    UserstatsComponent,
    AdminStatsComponent,
    AdminusersComponent,
    AdminTournamentsComponent,
    AdminRequestsComponent,
    UserTournamentsComponent,
    SendBetsComponent,
    MyBetsComponent,
    HistoryComponent,
    StandingComponent,
    AdminHistoryComponent,
    UserHistoryComponentComponent,
    EditMatchComponent,
    BetFeedComponent,
    ResultFeedComponent,
    ResultsComponent],
  providers: [    
    AuthService,
    OddsService,
    TournamentService,
    UserService,  
    MatchService,
    SocketService,],
  entryComponents: []
})
export class CoreModule { }
