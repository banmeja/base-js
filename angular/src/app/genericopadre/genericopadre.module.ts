import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { SelectModule } from 'ng2-select';
import { MaterialModule } from '../app.module';
import { FormsRoutes } from './genericopadre.routing';

import { HijoComponent } from './hijo/hijo.component';
import { Hijo2Component } from './hijo2/hijo2.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FormsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule
  ],
  declarations: [
    HijoComponent,
    Hijo2Component
  ]
})

export class Genericopadre {}
