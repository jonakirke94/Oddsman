import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { StandingComponent } from './standing/standing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminguardGuard } from './guards/adminguard.guard';
import { UserstatsComponent } from './dashboard/usercomponents/userstats/userstats.component';
import { UsersettingsComponent } from './dashboard/usercomponents/usersettings/usersettings.component';
import { AdminStatsComponent } from './adminpanel/admincomponents/admin-stats/admin-stats.component';
import { AdminusersComponent } from './adminpanel/admincomponents/adminusers/adminusers.component';
import { AdminTournamentsComponent } from './adminpanel/admincomponents/admin-tournaments/admin-tournaments.component';
import { AdminInvitationsComponent } from './adminpanel/admincomponents/admin-invitations/admin-invitations.component';
import { UserTournamentsComponent } from './dashboard/usercomponents/user-tournaments/user-tournaments.component';
import { SendBetsComponent } from './dashboard/usercomponents/send-bets/send-bets.component';
import { MyBetsComponent } from './dashboard/usercomponents/my-bets/my-bets.component';


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
    component: DashboardComponent,
    children:[
      {
        path : '',
        component: UserstatsComponent
       },
      {
       path : 'indstillinger',
       component: UsersettingsComponent
      },
      {
        path : 'sendtips',
        component: SendBetsComponent
       },
      {
        path : 'turneringer',
        component: UserTournamentsComponent
       },
       {
         path : 'mine-tips',
         component: MyBetsComponent
        }
    ]
  },
  {
    path: 'admin',
    canActivate: [AdminguardGuard],
    component: AdminpanelComponent,
     children:[
      {
        path : '',
        component: AdminStatsComponent
       },
       {
       path : 'users',
        component: AdminusersComponent
       },
       {
        path : 'tournaments',
         component: AdminTournamentsComponent
        },
       {
        path : 'requests/:id', 
        component: AdminInvitationsComponent
        },
    ]
  },
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
