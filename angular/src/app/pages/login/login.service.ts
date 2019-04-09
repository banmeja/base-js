import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppconfigService } from '../../appconfig.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,private appSettings:AppconfigService) { }

  login(usuario): Observable<any>{
    return this.http.post<any>(this.getURL(this.appSettings.restOAUTH,'Login/validarUsuarioInterno'),usuario)
    .pipe(
      catchError(this.handleError('getHeroes', []))
    );
  }


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
   
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
   
      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);
   
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private getURL(urlServer,Servicio){
    return urlServer+Servicio;
  }

}
