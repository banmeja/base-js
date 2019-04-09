import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentoComponent } from './documento/documento.component';

import { MaterialModule } from '../app.module';
import { ReactiveFormsModule, FormsModule } from '../../../node_modules/@angular/forms';

import { TranscripcionRoutingModule } from './transcripcion-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, //*
    ReactiveFormsModule, //*
    MaterialModule, //*
    TranscripcionRoutingModule
  ],
  declarations: []
})
export class TranscripcionModule { }
