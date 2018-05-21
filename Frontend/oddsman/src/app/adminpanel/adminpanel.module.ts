import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';

import { AdminpanelComponent } from './adminpanel.component';
import { AdminStatsComponent } from './admincomponents/admin-stats/admin-stats.component';
import { AdminusersComponent } from './admincomponents/adminusers/adminusers.component';
import { AdminTournamentsComponent } from './admincomponents/admin-tournaments/admin-tournaments.component';
import { AdminRequestsComponent } from './admincomponents/admin-requests/admin-requests.component';
import { AdminHistoryComponent } from './admincomponents/history/history.component';
import { EditMatchComponent } from './admincomponents/edit-match/edit-match.component';

/* This is a feature module that contains all components for the admin panel
   All feature modules are imported in the core module
*/

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      AppRoutingModule,

    ],
    declarations: [
        AdminpanelComponent,
        AdminStatsComponent,
        AdminusersComponent,
        AdminTournamentsComponent,
        AdminRequestsComponent,
        AdminHistoryComponent,
        EditMatchComponent
    ],
    exports: [
        AdminpanelComponent,
        AdminStatsComponent,
        AdminusersComponent,
        AdminTournamentsComponent,
        AdminRequestsComponent,
        AdminHistoryComponent,
        EditMatchComponent,
    ]


  })
  export class AdminPanelModule { }
