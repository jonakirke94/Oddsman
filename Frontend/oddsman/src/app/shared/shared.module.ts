import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgPrimeModule } from './ngprime/ngprime.module';
import {  ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    NgPrimeModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    HttpClientModule

  ],
  exports: [ 
    NgPrimeModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    HttpClientModule
 
  ],
  declarations: []
})
export class SharedModule { }
