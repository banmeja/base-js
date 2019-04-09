import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/app.module';
import { PrimeroComponent } from './primero/primero.component';
import { ProductoComponent } from './producto.component';
import { ListMigradoComponent } from './list-migrado/list-migrado.component';
import { NoMigradoComponent } from './no-migrado/no-migrado.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';

@NgModule({
  imports: [
    CommonModule,
    ProductoRoutingModule,  
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [ PrimeroComponent,ProductoComponent, ListMigradoComponent, NoMigradoComponent, EditComponent, AddComponent]
})
export class ProductoModule { }
