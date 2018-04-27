import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { StandingComponent } from './standing/standing.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '', //index
    canActivate: [AuthGuard],
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
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
