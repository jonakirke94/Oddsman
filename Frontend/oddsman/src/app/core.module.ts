import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

/* COMPONENTS */
import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { StatisticsComponent } from './components/statistics/statistics.component';


/* SERVICES */
import { AuthService } from './services/auth.service';
import { OddsService } from './services/odds.service';
import { TournamentService } from './services/tournament.service';
import { UserService } from './services/user.service';
import { MatchService } from './services/match.service';
import { SocketService } from './services/socket.service';

/* FEATURE MODULES */
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminPanelModule } from './adminpanel/adminpanel.module';
import { AuthenticationModule } from './authentication/authentication.module';


/* GUARDS */

import { AuthGuard } from './guards/auth.guard';
import { AdminguardGuard } from './guards/adminguard.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

/* Layout Module */ 
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';




/* Layout Modules, Singleton Services, Guards, and single components*/


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    DashboardModule,
    AdminPanelModule,
    AuthenticationModule

  ],
  exports : [
    FooterComponent,  
    HeaderComponent,
    
  ],
  declarations: [
    FooterComponent,  
    HeaderComponent,
    HomeComponent,
    InfoComponent,
    StatisticsComponent
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
