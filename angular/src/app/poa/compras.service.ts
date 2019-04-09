import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppconfigService } from '../appconfig.service';
import { HttpClient } from '@angular/common/http';
import { recursosVarios } from '../recursos/recursosVarios';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private http: HttpClient,private appSettings:AppconfigService) { }

  getSigesMigrados(filtroBusqueda): Observable<any>{
    return this.http.get<any>(this.appSettings.restCompras+'compras/getListaProductos')
    .pipe(
      catchError(this.handleError('compras/getListaProductos', []))
    );
  }

  getListaDependencias(): Observable<any>{
    return this.http.get<any>(this.appSettings.restCompras+'compras/getListaDependencias')
    .pipe(
      catchError(this.handleError('compras/getListaDependencias', []))
    );
  }

  getListaDependenciasConfiguradas(p_codigo_compras): Observable<any>{
    return this.http.get<any>(this.appSettings.restCompras+'compras/getProductoDependencias/'+p_codigo_compras+'/getProductoDependencias')
    .pipe(
      catchError(this.handleError('compras/getProductoDependencias/'+p_codigo_compras+'/getProductoDependencias', []))
    );
  }
  getSigesNoMigrados(filtroBusqueda): Observable<any>{
    return this.http.get<any>(this.appSettings.restCompras+'compras/getSigesNoMigrados/'+ filtroBusqueda +'/getSigesNoMigrados')
    .pipe(
      catchError(this.handleError('compras/getSigesNoMigrados/'+ filtroBusqueda +'/getSigesNoMigrados', []))
    );
  }

  addProducto(vJson): Observable<any>{
    return this.http.post<any>(this.appSettings.restCompras+'compras/insProducto',vJson)
    .pipe(
      catchError(this.handleError('compras/insProducto', []))
    );
  }
  insAgregarDependencias(vJson): Observable<any>{
    return this.http.post<any>(this.appSettings.restCompras+'compras/insAgregarDependencias',vJson)
    .pipe(
      catchError(this.handleError('compras/insAgregarDependencias', []))
    );
  }
  insPrecioEstimado(vJson): Observable<any>{
    return this.http.post<any>(this.appSettings.restCompras+'compras/insPrecioEstimado',vJson)
    .pipe(
      catchError(this.handleError('compras/insPrecioEstimado', []))
    );
  }
  updQuitarDependencias(vJson): Observable<any>{
    return this.http.put<any>(this.appSettings.restCompras+'compras/updQuitarDependencias',vJson)
    .pipe(
      catchError(this.handleError('compras/updQuitarDependencias', []))
    );
  }
  updDependencia(vJson): Observable<any>{
    return this.http.put<any>(this.appSettings.restCompras+'compras/updDependencia',vJson)
    .pipe(
      catchError(this.handleError('compras/updDependencia', []))
    );
  }
  updProducto(vJson): Observable<any>{
    return this.http.put<any>(this.appSettings.restCompras+'compras/updProducto',vJson)
    .pipe(
      catchError(this.handleError('compras/updProducto', []))
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
