import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoComponent } from './producto/producto.component' ;

//rutas internas
export const routes: Routes = [

  
  {
    path:'producto',    
    loadChildren: './producto/producto.module#ProductoModule',
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PoaRoutingModule { }
