import { AuthService } from 'app/recursos/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ComprasService } from 'app/poa/compras.service'
import { ProductoService } from '../producto.service';
import { Router, RouterModule } from '@angular/router';
import swal from 'sweetalert2';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-no-migrado',
  templateUrl: './no-migrado.component.html',
  styleUrls: ['./no-migrado.component.scss']
})
export class NoMigradoComponent implements OnInit {

  dataProductoFiltrado: MatTableDataSource<any>;
  filtroBusqueda: string;
  public size: number;

  constructor(
    private compraService: ComprasService,
    private datoSession: AuthService,
    private router: Router,
    private productoService: ProductoService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  getSigesNoMigrados() {
    if (this.filtroBusqueda.length >= 4) {
      this.carga = true;
      this.start();

      this.compraService.getSigesNoMigrados(this.filtroBusqueda).subscribe(
        data => {

          this.dataProductoFiltrado = new MatTableDataSource<any>(data);
          this.dataProductoFiltrado.paginator = this.paginator;
          this.dataProductoFiltrado.sort = this.sort;
          this.carga = false;
        }
      )
    } else {
      console.log('advertencia')
    }
  }

  seleccion(Codigoempleado, row) {

    this.productoService.setDataMigrado({
      data: [row]
    });
    this.router.navigate(['/poa/producto/add']);

  }

  public doFilter = (value: string) => {
    if (this.dataProductoFiltrado == undefined) {
      console.log(1)
    } else {
      this.dataProductoFiltrado.filter = value.trim().toLocaleLowerCase();
    }

  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /*Inicio Funcion para el efecto de carga*/
  carga = false;
  private color = 'accent';
  valcolor = 0;
  private intervalUpdate: any = null;
  start() {
    const type = ['primary', 'warn', 'accent'];
    this.intervalUpdate = setInterval(function () {
      this.color = type[this.valcolor];
      this.valcolor++;
      if (this.valcolor == 3) {
        this.valcolor = 0;
      }
      if (!this.carga) {
        clearInterval(this.intervalUpdate)
      }
    }.bind(this), 1000);

  }
  /*Fin Funcion para el efecto de carga*/


}
