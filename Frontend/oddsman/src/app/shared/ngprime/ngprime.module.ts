import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DataTableModule, DialogModule } from 'primeng/primeng'; // Here
import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { GrowlModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    DataTableModule,
    GrowlModule,
    DropdownModule,
    DialogModule,
    AccordionModule,
    TableModule,
    CalendarModule,

  ],
  exports: [
    InputTextModule,
    DataTableModule,
    GrowlModule,
    DropdownModule,
    DialogModule,
    AccordionModule,
    TableModule,
    CalendarModule,
  ],
  declarations: [],
  providers: [
  ]
})
export class NgPrimeModule { }
