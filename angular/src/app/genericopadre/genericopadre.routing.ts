import { Routes } from '@angular/router';

import { HijoComponent } from './hijo/hijo.component';
import { Hijo2Component } from './hijo2/hijo2.component';
import { validarPermisos } from '../guardAccesos/auth-guard.service';

export const FormsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'hijo2'
  },
  {
    path: '',
    children: [ {
      path: 'hijo',
      component: HijoComponent,
 /*     data: {paginas: [17]},//permisos
      canActivate:[validarPermisos]*/
  }]},
  {
  path: '',
  children: [ {
    path: 'hijo2',
    component: Hijo2Component,
    data: {paginas: [17]},//permisos
    canActivate:[validarPermisos]
  }]},
];
