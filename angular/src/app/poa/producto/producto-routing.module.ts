import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from 'app/layouts/admin/admin-layout.component';
import { ProductoComponent } from './producto.component';
import { PrimeroComponent } from './primero/primero.component';
import { ListMigradoComponent } from './list-migrado/list-migrado.component';
import { NoMigradoComponent } from './no-migrado/no-migrado.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';


export const routes: Routes = [
  {
  path: '',
      component: ProductoComponent,
      /*data: {paginas: [33]},
      canActivate: [AuthGuardService],*/
      children: [
        {
            path: 'list',
            component: ListMigradoComponent,
            //canActivate: [AuthGuardService],
            //component:HomeComponent
        },
        {
          path: 'noMigrado',
          component: NoMigradoComponent,
          //canActivate: [AuthGuardService],
          //component:HomeComponent
      },
      {
        path : 'edit',
        component : EditComponent
      },
      {
        path : 'add',
        component : AddComponent
      }
      ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
