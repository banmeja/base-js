	
import  {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppconfigService } from '../appconfig.service';
import { cryptoOJ } from './cryptoOJ';

import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { recursosVarios } from './recursosVarios';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private localStorageService;

  constructor(private appSettings: AppconfigService,private router: Router, private authService:AuthService) {
    this.localStorageService = localStorage;
  }
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
    let authReq=req.clone();
    if (req.url.startsWith(this.appSettings.restApiServiceBaseUri)) {
        //req.headers = config.headers || {};
        const token = this.localStorageService.getItem('token' + this.appSettings.sistemaId);
        if (token) {
            authReq = req.clone({
                setHeaders: {
                Authorization: `Bearer ${token}`
                }
            });
            
        } else {//si no hay token enviamos la fecha
            //CIT-CAPE-D124-M4-Y2018
            if(!authReq.headers.get('Authorization')){
                var dateObj = new Date();
                var fecha256 = new cryptoOJ().sha256("CIT-" + this.appSettings.Sistema + "-D" + dateObj.getDate() + "-M" + dateObj.getMonth() + "-Y" + dateObj.getFullYear());
                authReq = req.clone({setHeaders: {Authorization: `Bearer ${fecha256}`}});
                
            }
        }
        if (req.method == 'POST' || req.method == 'PUT') {
          var jwtData = token.split('.')[1];
          var decodedJwtJsonData = window.atob(jwtData);
          var decodedJwtData = JSON.parse(decodedJwtJsonData);
          var ID_USUARIO = decodedJwtData.ID_USUARIO;
          authReq.body.ID_USUARIO=ID_USUARIO;
        }

    }

    if(req.url.startsWith(this.appSettings.restOAUTH)){
        var tokenOAUTH = this.localStorageService.getItem( 'token' + this.appSettings.sistemaIdOAUTH );
        if(tokenOAUTH){
            authReq = req.clone({setHeaders: {Authorization: `Bearer ${tokenOAUTH}`}});
        }
      }
      
      return next.handle(authReq).do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //todo bien
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.log('401  ->',err )
            new recursosVarios().showNotification('top','right','Session ha expirada, ingrese al sistema de nuevo',4)
            // new recursosVarios().showNotification('top','right',err.error,4)
            this.authService.logOut();
            this.router.navigate(['login']);
            
          }
        }
      });
  }

}