
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

/* This is a feature module that contains all components for authentication
   All feature modules are imported in the core module
*/

@NgModule({

    imports: [
      CommonModule,
      SharedModule,
      AppRoutingModule,

    ],
    declarations: [
        LoginComponent,
        SignupComponent

    ],
    exports: [
        LoginComponent,
        SignupComponent
    ]


  })
  export class AuthenticationModule { }
