import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { StandingComponent } from './standing/standing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminguardGuard } from './guards/adminguard.guard';

const routes: Routes = [
  {
    path: '', //index
    component: StandingComponent
  },
  {
  path: 'login',
  component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'admin',
    canActivate: [AdminguardGuard],
    component: AdminpanelComponent
  },
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
