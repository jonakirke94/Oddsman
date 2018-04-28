import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validator } from '@angular/forms';
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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoadingSpinnerComponent,
    SignupComponent,
    StandingComponent,
    DashboardComponent,
    AdminpanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    OddsService,
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
