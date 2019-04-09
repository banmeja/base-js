import { AuthService } from 'app/recursos/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ComprasService } from 'app/poa/compras.service'
import { ProductoService } from '../producto.service';
import { Router, RouterModule } from '@angular/router';
import swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

export interface Tipo {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  public data;
  public dependencias;

  producto: any = [];
  infoAdicional: any = [];
  dataProductoAgregar: MatTableDataSource<any>;
  dataDependencia: MatTableDataSource<any>;
  selectedValue: string;
  confirmarProducto: any = [];
  unidades: any = [];
  selectRows: any = [];
  InfoRows = [];
  tipos: Tipo[] = [
    { value: 'T', viewValue: 'GENERICO' },
    { value: 'U', viewValue: 'ESPECIALIZADO' }

  ];
  displayedColumns: string[] = ['select', 'DEPENDENCIA', 'NOMBRE_DEPENDENCIA'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  oculta: boolean;
  comproducto: string;
  comgrupo: string;
  comsubgrupo: string;
  comrenglon: string;

  constructor(
    private compraService: ComprasService,
    private datoSession: AuthService,
    private router: Router,
    private productoService: ProductoService,
    public dialog: MatDialog
  ) {
    this.data = this.productoService.getDataMigrado()
    if (this.data == null || this.data.length == 0) {
      this.router.navigate(['/poa/producto/list']);
    } else {
      this.producto = this.data.data;
      this.dataProductoAgregar = new MatTableDataSource<any>(this.data.data);
      this.dataProductoAgregar.paginator = this.paginator;
      this.dataProductoAgregar.sort = this.sort;
      this.comproducto = this.data.data[0].NOMBRE;
    }
   }

/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataDependencia.data.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
    this.selection.clear() :
    this.dataDependencia.data.forEach(row => this.selection.select(row));
}

public doFilter = (value: string) => {
  if (this.dataDependencia == undefined) { console.log("fxcaddp") } else {
    this.dataDependencia.filter = value.trim().toLocaleLowerCase();
  }
}

  ngOnInit() {
    this.oculta = true;
  }

  selected(value) {
    if (value == 'U') {
      this.dependencias = this.compraService.getListaDependencias().subscribe(
        data => {
          if (data.length > 0) {
            this.unidades = [];
            this.dataDependencia = new MatTableDataSource<any>(data);
            this.dataDependencia.paginator = this.paginator;
            this.dataDependencia.sort = this.sort;
          } else {
            this.dependencias = [];
            this.unidades = [];
          }
        }

      );
      this.oculta = false;
    } else {
      this.selection.clear();
      this.dependencias = [];
      this.oculta = true;
    }
  }

  SelectedRows() {
    this.InfoRows = [];
    this.unidades = [];
    this.selection.selected.forEach(item => {
      this.InfoRows.push({
        DEPENDENCIA: item.DEPENDENCIA,
        NOMBRE_DEPENDENCIA: item.NOMBRE_DEPENDENCIA,
      });
    });
    this.unidades.push(this.InfoRows);    
  }

  limpiarRegistro() {
    this.producto = [];
  }

  save() {
    if (this.infoAdicional.precioEstimado == null && this.infoAdicional.anioVigencia != null && this.selectedValue != undefined) {
      swal({
        title: "Ingresar precio estimado.",
        showCancelButton: false,
        confirmButtonClass: "btn btn-success",
        confirmButtonText: "Confirmar",
        cancelButtonClass: "btn btn-danger",
        cancelButtonText: "Cancelar",
        customClass: 'swal-width',
        type: 'warning',

      })
    } else if (this.infoAdicional.precioEstimado != null && this.infoAdicional.anioVigencia == null && this.selectedValue != undefined) {
      swal({
        title: "Ingresar año de vigencia del precio.",
        showCancelButton: false,
        confirmButtonClass: "btn btn-success",
        confirmButtonText: "Confirmar",
        cancelButtonClass: "btn btn-danger",
        cancelButtonText: "Cancelar",
        customClass: 'swal-width',
        type: 'warning',

      })
    }
    else if (this.infoAdicional.precioEstimado != null && this.infoAdicional.anioVigencia != null && this.selectedValue == undefined) {
      swal({
        title: "Seleccionar tipo de producto",
        showCancelButton: false,
        confirmButtonClass: "btn btn-success",
        confirmButtonText: "Confirmar",
        cancelButtonClass: "btn btn-danger",
        cancelButtonText: "Cancelar",
        customClass: 'swal-width',
        type: 'warning',

      })
    } else if (this.infoAdicional.precioEstimado == null || this.infoAdicional.anioVigencia == null || this.selectedValue == undefined) {
      swal({
        title: "Información incompleta.",
        showCancelButton: false,
        confirmButtonClass: "btn btn-success",
        confirmButtonText: "Confirmar",
        cancelButtonClass: "btn btn-danger",
        cancelButtonText: "Cancelar",
        customClass: 'swal-width',
        type: 'error',

      })
    } else {
      this.SelectedRows();
      if (this.unidades[0].length > 0) {
        this.producto[0].DEPENDENCIAS = this.unidades[0];
        this.producto[0].PRECIO = this.infoAdicional.precioEstimado;
        this.producto[0].ANIO = this.infoAdicional.anioVigencia;
        this.producto[0].TIPO = this.selectedValue;
        this.producto[0].USUARIO = this.datoSession.getsession().SESSION.USUARIO;
        this.producto[0].ID_USUARIO_REGISTRO = this.datoSession.getsession().SESSION.ID_USUARIO;
        this.producto[0].NOMBRE = this.comproducto;
      } else {
        this.producto[0].PRECIO = this.infoAdicional.precioEstimado;
        this.producto[0].ANIO = this.infoAdicional.anioVigencia;
        this.producto[0].TIPO = this.selectedValue;
        this.producto[0].USUARIO = this.datoSession.getsession().SESSION.USUARIO;
        this.producto[0].ID_USUARIO_REGISTRO = this.datoSession.getsession().SESSION.ID_USUARIO;
        this.producto[0].NOMBRE = this.comproducto;
        this.unidades = [];
      }

      this.compraService.addProducto(this.producto[0]).subscribe(
        data => {
          swal({
            title: "Proceso completado con éxito.",
            showCancelButton: false,
            confirmButtonClass: "btn btn-success",
            confirmButtonText: "Confirmar",
            cancelButtonClass: "btn btn-danger",
            cancelButtonText: "Cancelar",
            customClass: 'swal-width',
            type: 'success',
          }).then((confirm) => {
            this.router.navigate(['/poa/producto/list']);
          })
        });
    }
  }

  volver() {
    this.router.navigate(['/poa/producto/list']);
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
}
