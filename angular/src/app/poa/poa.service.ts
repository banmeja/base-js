import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppconfigService } from '../appconfig.service';
import { HttpClient } from '@angular/common/http';
import { recursosVarios } from '../recursos/recursosVarios';

@Injectable({
  providedIn: 'root'
})
export class PoaService {

  constructor(private http: HttpClient,private appSettings:AppconfigService) { }

  getSigesMigrados(filtroBusqueda): Observable<any>{
    return this.http.get<any>(this.appSettings.restCompras+'compras/getListaProductos')
    .pipe(
      catchError(this.handleError('compras/getListaProductos', []))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
   
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      //new recursosVarios().showNotification('top','right',error.error.replace('</body>','<h3>Metodo '+operation.toString()+'</h3></body>'),4)
      new recursosVarios().showNotification('top','right','<h4>Error Metodo '+operation.toString()+'</h3>',4)
      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);
   
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
