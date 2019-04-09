import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppconfigService {

  constructor() { }
  
  //restApiServiceBaseUri= 'http://localhost:8080/rstSaloj/webapi/' // REST Api
  restApiServiceBaseUri= 'http://wsdesacit:8080/rstSaloj/webapi/' // REST Api pruebas desacit01
  restOAUTH = 'http://wsdesacit:8080/OAUTH2/webapi/' //oauth
  restRRHH = 'http://servicioscit.oj.gob.gt:8080/rrhh/' //rrhh prod
  restCompras = 'http://servicioscit.oj.gob.gt:8080/rstCompras/webapi/'
  sistemaId = 28  //id sistema  oauth  CITBASE2 16 -pruebas
  sistemaIdOAUTH = 2  //id sistema  oauth
  sistemaIdRRHH = 1
  
  Sistema: 'SALOJ'

}
