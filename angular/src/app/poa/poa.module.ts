import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoComponent } from './producto/producto.component';

import { MaterialModule } from '../app.module';
import { ReactiveFormsModule, FormsModule } from '../../../node_modules/@angular/forms';

//call routing interno
import { PoaRoutingModule } from './poa-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PoaRoutingModule
  ],
  declarations: []
})
export class PoaModule { }
