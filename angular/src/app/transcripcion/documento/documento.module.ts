import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentoRoutingModule } from './documento-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/app.module';
import { DocumentoComponent } from './documento.component';
import { AddComponent } from './add/add.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  imports: [
    CommonModule,
    DocumentoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [DocumentoComponent, AddComponent, SearchComponent]
})
export class DocumentoModule { }
