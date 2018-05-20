import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import * as io from 'socket.io-client';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';


//https://stackoverflow.com/questions/39906949/angular2-how-to-clean-up-the-appmodule

/* CoreModule: 
- Components
- Layout Files
- Services
- Guards
- Interceptors
*/

/* 
- NgPrime Components
- Chart/Form Modules
*/

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
