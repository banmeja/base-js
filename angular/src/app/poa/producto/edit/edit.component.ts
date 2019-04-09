import { AuthService } from 'app/recursos/auth.service';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ComprasService } from 'app/poa/compras.service'
import { ProductoService } from '../producto.service';
import { SelectionModel } from '@angular/cdk/collections';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialog, MatTableDataSource, MatTable, MatPaginator, MatSort, MatSelectChange, MatOption, MatInputModule } from '@angular/material';

export interface Tipo {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public data;
  public dependencias;
  public dependenciaConfigurada;

  dataProductoEditar: MatTableDataSource<any>;

  dataDependencia: MatTableDataSource<any>;
  dataDependenciaAgregar: MatTableDataSource<any>;

  producto: any = [];
  infoAdicional: any = [];

  unidades: any = [];
  quitarUnidad: any = [];
  agregarUnidad: any = [];

  selectRows: any = [];
  InfoRows = [];

  selectRowsAgregar: any = [];
  InfoRowsAgregar = [];

  confirmarProducto: any = [];

  comproducto: string;
  comprecio: number;
  anioVigencia: number;
  selectedValue: string;
  oculta: boolean;

  tipos: Tipo[] = [
    { value: 'T', viewValue: 'GENERICO' },
    { value: 'U', viewValue: 'ESPECIALIZADO' }

  ];
  displayedColumns: string[] = ['select', 'DEPENDENCIA', 'NOMBRE_DEPENDENCIA'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);


  displayedColumnsAgregarDependencia: string[] = ['selectAgregar', 'DEPENDENCIA', 'NOMBRE_DEPENDENCIA'];


  dataSourceDependencia = new MatTableDataSource<any>();
  dataSourceDependenciaAgregar = new MatTableDataSource<any>();


  selectionAgregar = new SelectionModel<any>(true, []);

  constructor(
    private compraService: ComprasService,
    private datoSession: AuthService,
    private router: Router,
    private productoService: ProductoService,
    public dialog: MatDialog
  ) {
    this.data = this.productoService.getEditMigrado();
    if (this.data == null || this.data.length == 0) {
      this.router.navigate(['/poa/producto/list']);
    } else {
      this.producto = this.data.info;
      console.log(this.producto)
      this.dataProductoEditar = new MatTableDataSource<any>(this.data.info);
      this.dataProductoEditar.paginator = this.paginator;
      this.dataProductoEditar.sort = this.sort;
      this.comproducto = this.producto[0].COMDESCRIPCION_CORTA;
      this.infoAdicional.precioEstimado = this.producto[0].PRECIO_ESTIMADO;
      this.infoAdicional.anioVigencia = this.producto[0].ANIO;

      this.dependencias = this.compraService.getListaDependenciasConfiguradas(this.producto[0].CODIGO_COMPRAS).subscribe(

        data => {
          if (data.length > 0) {
            this.dataDependencia = new MatTableDataSource<any>(data);
            this.dataDependencia.paginator = this.paginator;
            this.dataDependencia.sort = this.sort;
          } else {
            this.dependencias = [];
            this.unidades = [];

          }
        }
      );
    }
  }

  ngOnInit() {
  }

  updDescProducto() {

    this.producto[0].ID_USUARIO_REGISTRO = this.datoSession.getsession().SESSION.ID_USUARIO;
    this.producto[0].COMPRODUCTO = this.producto[0].COMPRODUCTO;
    this.producto[0].COMDESCRIPCION_PRODUCTO = this.comproducto;

    this.compraService.updProducto(this.producto[0]).subscribe(
      data => {
        swal({
          title: "Función realizada con éxito.",
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

  updPrecio() {
    this.producto[0].ID_USUARIO_REGISTRO = this.datoSession.getsession().SESSION.ID_USUARIO;
    this.producto[0].USUARIO = this.datoSession.getsession().SESSION.ID_USUARIO;
    this.producto[0].PRODUCTO = this.producto[0].COMPRODUCTO;
    this.producto[0].ANIO = this.infoAdicional.anioVigencia;
    this.producto[0].PRECIO = this.infoAdicional.precioEstimado;

    this.compraService.insPrecioEstimado(this.producto[0]).subscribe(
      data => {
        swal({
          title: "Actualización de Precio realizada con éxito.",
          showCancelButton: false,
          confirmButtonClass: "btn btn-success",
          confirmButtonText: "Confirmar",
          cancelButtonClass: "btn btn-danger",
          cancelButtonText: "Cancelar",
          customClass: 'swal-width',
          type: 'success',
        }).then((confirm) => {
          this.router.navigate(['/poa/producto']);
        })
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataDependencia.data.length;
    return numSelected === numRows;
  }

  isAllSelectedAgregar() {
    const numSelected = this.selectionAgregar.selected.length;
    const numRows = this.dataDependenciaAgregar.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataDependencia.data.forEach(row => this.selection.select(row));
  }

  masterToggleAgregar() {
    this.isAllSelectedAgregar() ?
      this.selectionAgregar.clear() :
      this.dataDependenciaAgregar.data.forEach(row => this.selectionAgregar.select(row));
  }

  public doFilter = (value: string) => {
    if (this.dataDependencia == undefined) { console.log("fxcaddp") } else {
      this.dataDependencia.filter = value.trim().toLocaleLowerCase();
    }

  }

  public doFilterAgregar = (value: string) => {
    if (this.dataDependenciaAgregar == undefined) { console.log("fxcaddp") } else {
      this.dataDependenciaAgregar.filter = value.trim().toLocaleLowerCase();
    }

  }

  selected(value) {

    if (value == 'U') {
      this.dependencias = this.compraService.getListaDependencias().subscribe(

        data => {
          if (data.length > 0) {
            this.unidades = [];
            this.dataDependenciaAgregar = new MatTableDataSource<any>(data);
            this.dataDependenciaAgregar.paginator = this.hBSort1;
            //this.dataDependenciaAgregar.sort = this.hBSort1;          
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
    this.quitarUnidad = [];
    this.selection.selected.forEach(item => {

      this.InfoRows.push({
        COMPRODUCTO: this.producto[0].COMPRODUCTO,
        COMGRUPO: this.producto[0].COMGRUPO,
        COMSUB_GRUPO: this.producto[0].COMSUB_GRUPO,
        COMRENGLON: this.producto[0].COMRENGLON,
        DEPENDENCIA: item.DEPENDENCIA
      });
    });
    this.quitarUnidad.push(this.InfoRows);
  }

  SelectedRowsAgregar() {
    this.InfoRowsAgregar = [];
    this.agregarUnidad = [];
    this.selectionAgregar.selected.forEach(item => {

      this.InfoRowsAgregar.push({
        DEPENDENCIA: item.DEPENDENCIA,
        NOMBRE_DEPENDENCIA: item.NOMBRE_DEPENDENCIA,
        COMPRODUCTO: this.producto[0].COMPRODUCTO,
        COMGRUPO: this.producto[0].COMGRUPO,
        COMSUB_GRUPO: this.producto[0].COMSUB_GRUPO,
        COMRENGLON: this.producto[0].COMRENGLON
      });
    });
    this.agregarUnidad.push(this.InfoRowsAgregar);
  }

  save() {
    this.SelectedRows();
    if (this.quitarUnidad[0].length > 0) {
      this.producto[0].DEPENDENCIAS = this.quitarUnidad[0];
      this.compraService.updQuitarDependencias(this.producto[0]).subscribe(
        data => {
          swal({
            title: "Se han quitado las dependencias con éxito.",
            showCancelButton: false,
            confirmButtonClass: "btn btn-success",
            confirmButtonText: "Confirmar",
            cancelButtonClass: "btn btn-danger",
            cancelButtonText: "Cancelar",
            customClass: 'swal-width',
            type: 'success',
          })
        });
    }

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

    else {
      this.SelectedRowsAgregar();
      if (this.agregarUnidad[0].length > 0) {
        this.producto[0].DEPENDENCIAS = this.agregarUnidad[0];


        this.compraService.insAgregarDependencias(this.producto[0]).subscribe(
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
              this.router.navigate(['/poa/producto']);
            })
          });
      } else {
        this.router.navigate(['/poa/producto']);

      }
    }
  }
  volver() {
    this.router.navigate(['/poa/producto/list']);
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('hBSort1') hBSort1: MatPaginator;
  @ViewChild('sBSort1') sBSort1: MatPaginator;

}
