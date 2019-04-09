import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  dataMigrado : any =[];
  dataEditMigrado : any = [];

  constructor() { }

  getDataMigrado(){
    return this.dataMigrado;
  }

  setDataMigrado(data){
    this.dataMigrado = data;
  }

  getEditMigrado(){
    return this.dataEditMigrado;
  }

  setEditMigrado(info){
    this.dataEditMigrado = info;
  }
}
