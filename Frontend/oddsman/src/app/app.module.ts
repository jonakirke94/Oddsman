import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validator, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { SignupComponent } from './signup/signup.component';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OddsService } from './services/odds.service';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminguardGuard } from './guards/adminguard.guard';
import { ChartsModule } from 'ng2-charts';
import { UsersettingsComponent } from './dashboard/usercomponents/usersettings/usersettings.component';
import { UserstatsComponent } from './dashboard/usercomponents/userstats/userstats.component';
import { AdminStatsComponent } from './adminpanel/admincomponents/admin-stats/admin-stats.component';
import { AdminusersComponent } from './adminpanel/admincomponents/adminusers/adminusers.component';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { UserService } from './services/user.service';
import { AdminTournamentsComponent } from './adminpanel/admincomponents/admin-tournaments/admin-tournaments.component';
import { TournamentService } from './services/tournament.service';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DataTableModule, DialogModule } from 'primeng/primeng'; // Here
import { GrowlModule } from 'primeng/primeng';
import { UserTournamentsComponent } from './dashboard/usercomponents/user-tournaments/user-tournaments.component';
import { SendBetsComponent } from './dashboard/usercomponents/send-bets/send-bets.component';
import { MyBetsComponent } from './dashboard/usercomponents/my-bets/my-bets.component';
import { DropdownModule } from 'primeng/primeng';
import { EditMatchComponent } from './adminpanel/admincomponents/edit-match/edit-match.component';
import { MatchService } from './services/match.service';
import { HomeComponent } from './home/home.component';
import { StandingComponent } from './standing/standing.component';
import { AdminHistoryComponent } from './adminpanel/admincomponents/history/history.component';
import { HistoryComponent } from './history/history.component';
import { UserHistoryComponentComponent } from './dashboard/usercomponents/user-history-component/user-history-component.component';
import { AdminRequestsComponent } from './adminpanel/admincomponents/admin-requests/admin-requests.component';
import * as io from 'socket.io-client';


@NgModule({
  declarations: [
    AppComponent,
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
    EditMatchComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule,
    AccordionModule,
    TableModule,
    CalendarModule,
    FormsModule,
    InputTextModule,
    DataTableModule,
    GrowlModule,
    DropdownModule,
    DialogModule



  ],
  providers: [
    AuthService,
    OddsService,
    TournamentService,
    UserService,
    AuthGuard,
    MatchService,
    AdminguardGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
