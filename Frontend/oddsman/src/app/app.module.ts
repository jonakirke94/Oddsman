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
import { StandingComponent } from './standing/standing.component';
import { AuthInterceptor } from './auth.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OddsService } from './services/odds.service';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminguardGuard } from './guards/adminguard.guard';
import { ChartsModule } from 'ng2-charts';
import { UsersettingsComponent } from './dashboard/usercomponents/usersettings/usersettings.component';
import { UserstatsComponent } from './dashboard/usercomponents/userstats/userstats.component';
import { SendtipsComponent } from './dashboard/usercomponents/sendtips/sendtips.component';
import { AdminStatsComponent } from './adminpanel/admincomponents/admin-stats/admin-stats.component';
import { AdminusersComponent } from './adminpanel/admincomponents/adminusers/adminusers.component';
import {AccordionModule} from 'primeng/accordion';    
import {MenuItem} from 'primeng/api';    
import {TableModule} from 'primeng/table';
import { UserService } from './services/user.service';
import { AdminTournamentsComponent } from './adminpanel/admincomponents/admin-tournaments/admin-tournaments.component';
import { TournamentService } from './services/tournament.service';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoadingSpinnerComponent,
    SignupComponent,
    StandingComponent,
    DashboardComponent,
    AdminpanelComponent,
    UsersettingsComponent,
    UserstatsComponent,
    SendtipsComponent,
    AdminStatsComponent,
    AdminusersComponent,
    AdminTournamentsComponent,
    
    
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
    InputTextModule

    
  ],
  providers: [
    AuthService,
    OddsService,
    TournamentService,
    UserService,
    AuthGuard,
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
