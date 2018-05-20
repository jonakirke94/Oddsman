import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

/* COMPONENTS */
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';

/* Admin Panel */
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { AdminStatsComponent } from './adminpanel/admincomponents/admin-stats/admin-stats.component';
import { AdminusersComponent } from './adminpanel/admincomponents/adminusers/adminusers.component';
import { AdminTournamentsComponent } from './adminpanel/admincomponents/admin-tournaments/admin-tournaments.component';
import { AdminRequestsComponent } from './adminpanel/admincomponents/admin-requests/admin-requests.component';
import { AdminHistoryComponent } from './adminpanel/admincomponents/history/history.component';

import { HistoryComponent } from './history/history.component';
import { StandingComponent } from './standing/standing.component';
import { EditMatchComponent } from './adminpanel/admincomponents/edit-match/edit-match.component';
import { BetFeedComponent } from './bet-feed/bet-feed.component';
import { ResultFeedComponent } from './result-feed/result-feed.component';
import { ResultsComponent } from './adminpanel/admincomponents/results/results.component';

/* SERVICES */
import { AuthService } from './services/auth.service';
import { OddsService } from './services/odds.service';
import { TournamentService } from './services/tournament.service';
import { UserService } from './services/user.service';
import { MatchService } from './services/match.service';
import { SocketService } from './services/socket.service';

/* GUARDS */
import { AuthGuard } from './guards/auth.guard';
import { AdminguardGuard } from './guards/adminguard.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

/* Layout Module */ 
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { DashboardModule } from './dashboard/dashboard.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    DashboardModule

  ],
  exports : [
    FooterComponent,  
    HeaderComponent,
    
  ],
  declarations: [
    FooterComponent,  
    HeaderComponent,
    HomeComponent,

    LoginComponent,
    SignupComponent,
    
    AdminpanelComponent,
    AdminStatsComponent,
    AdminusersComponent,
    AdminTournamentsComponent,
    AdminRequestsComponent,
    AdminHistoryComponent,
    EditMatchComponent,

  ],
  providers: [    
    AuthService,
    OddsService,
    TournamentService,
    UserService,  
    MatchService,
    SocketService,
    AuthGuard,
    AdminguardGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  entryComponents: []
})
export class CoreModule { }
