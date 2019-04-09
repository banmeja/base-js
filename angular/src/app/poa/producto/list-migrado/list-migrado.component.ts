import { Component, OnInit, ViewChild } from '@angular/core';
import { ComprasService } from 'app/poa/compras.service'
import { ProductoService } from '../producto.service';
import { AuthService } from 'app/recursos/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-list-migrado',
  templateUrl: './list-migrado.component.html',
  styleUrls: ['./list-migrado.component.scss']
})
export class ListMigradoComponent implements OnInit {

  dataProductoFiltro: MatTableDataSource<any>;
  filtroBusqueda: null;
  oculta : boolean;

  constructor(
    private compraService : ComprasService,
    private datoSession : AuthService,
    private router : Router,
    private productoService : ProductoService,
    public dialog: MatDialog

  ) { }

  ngOnInit() {
    this.getSigesMigrados();
    this.oculta = true;
  }

  getSigesMigrados(){
    this.carga=true;
    this.start();
    
    this.compraService.getSigesMigrados(this.filtroBusqueda).subscribe(
      data => {        
        this.dataProductoFiltro = new MatTableDataSource<any>(data);
        this.dataProductoFiltro.paginator = this.paginator;
        this.dataProductoFiltro.sort = this.sort;
        this.carga=false;
      }      
    )
  }

  public doFilter = (value: string) => {
    this.dataProductoFiltro.filter = value.trim().toLocaleLowerCase();
  }

  editProducto(row){  
    this.productoService.setEditMigrado({      
      info :[row]      
    });
    
    this.router.navigate(['/poa/producto/edit']);
  
  }

     /*Inicio Funcion para el efecto de carga*/
     carga=false;
     private color='accent';
     valcolor=0;
     private intervalUpdate: any = null;
     start(){
       const type = ['primary','warn', 'accent'];
       this.intervalUpdate = setInterval(function(){
           this.color=type[this.valcolor];
           this.valcolor++;
           if(this.valcolor==3){
               this.valcolor=0;
           }
           if(!this.carga){
               clearInterval(this.intervalUpdate)
           }
       }.bind(this), 1000);
     
     }
   /*Fin Funcion para el efecto de carga*/


   
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
}

