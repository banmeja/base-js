import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentoComponent } from './documento.component';
import { AddComponent } from './add/add.component';
import { SearchComponent } from './search/search.component';
import { AdminLayoutComponent } from 'app/layouts/admin/admin-layout.component';

const routes: Routes = [
  {
    path: '',
        component: DocumentoComponent,
        /*data: {paginas: [33]},
        canActivate: [AuthGuardService],*/
        children: [
          {
              path: 'add',
              component: AddComponent,
              //canActivate: [AuthGuardService],
              //component:HomeComponent
          },
          {
            path: 'search',
            component: SearchComponent,
            //canActivate: [AuthGuardService],
            //component:HomeComponent
        }
        ]
        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentoRoutingModule { }
