import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppconfigService } from '../appconfig.service';
import { HttpClient } from '@angular/common/http';
import { recursosVarios } from './recursosVarios';
import { cryptoOJ } from './cryptoOJ';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private localStorageService;
  private session:any={};

  constructor(private router: Router,
              private http: HttpClient,
              private appSettings:AppconfigService) {
    this.localStorageService = localStorage;
  }
  


  public getsession(): any {
    return this.session;
  }
  public setsession(value: any) {
    this.session = value;
  }


  saveLocalData(dataName, data ){
    this.localStorageService.setItem(dataName,data);
    if(this.localStorageService.getItem(dataName)){
      return true;
    }else{
      return false;
    }
    
  }

  isLoggedIn(){
    let token=this.getLocalData('token'+this.appSettings.sistemaId);
    let tokenOAUTH=this.getLocalData( 'token'+this.appSettings.sistemaIdOAUTH);

    if(token && tokenOAUTH){
      return true;
    }else{
      return false;
    }
  }

  getTokenOauth(){
    return this.getLocalData( 'token'+this.appSettings.sistemaIdOAUTH);
  }

  getLocalData(dataName){
    return this.localStorageService.getItem(dataName);
  }



  getSessionUsuario(p_id_sistema): Observable<any>{
    return this.http.get<any>(this.getURL(this.appSettings.restOAUTH,'Login/Sistema/'+p_id_sistema+'/getSessionUsuario'))
    .pipe(
      catchError(this.handleError('getSessionUsuario', undefined))
    );
  }

  getConstantes(): Observable<any>{
    return this.http.get<any>(this.getURL(this.appSettings.restApiServiceBaseUri,'Login/getConstantes'))
    .pipe(
      catchError(this.handleError('getConstantes', undefined))
    );
  }

  InsUsuario(data): Observable<any>{
    return this.http.post<any>(this.getURL(this.appSettings.restApiServiceBaseUri,'Login/insUsuario'),data)
    .pipe(
      catchError(this.handleError('InsUsuario', undefined))
    );
  }

  logOut(){       
    this.localStorageService.removeItem( 'permisos' + this.appSettings.sistemaId );
    this.localStorageService.removeItem( 'permisos2' + this.appSettings.sistemaId );
    this.localStorageService.removeItem( 'token' + this.appSettings.sistemaId);
    this.localStorageService.removeItem( 'token' + this.appSettings.sistemaIdOAUTH);
  }

  decodePermisos(){
        let encodePermisos=this.getLocalData("permisos2"+this.appSettings.sistemaId)
        let Permisos= new cryptoOJ().decrypt("permisos2"+this.appSettings.sistemaId,encodePermisos)
        return Permisos;
  }


  private getURL(urlServer,Servicio){
    return urlServer+Servicio;
  }  


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //console.error(error);
      //new recursosVarios().showNotification('top','right','Session ha expirada, ingrese al sistema de nuevo',4)
      //this.router.navigate(['/pages/login']);
      return of(result as T);
    };
  }

}
