angular.module('app.caso', [
    'ui.router',
    'ui.grid',
    'toastr',
    'app.casoService'
])

    .config([
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('index.caso', {

                    abstract: true,

                    url: 'caso',

                    params: {

                    },

                    views: {
                        '': {
                            templateUrl: 'app/caso/bandeja.tpl.html',
                            resolve: {

                            },
                            controller: ['$scope', '$state', 'toastr',
                                function ($scope, $state, toastr) {
                                    $scope.bandera = { valor: null }


                                }]
                        }
                    }

                })

                .state('index.caso.lista', {

                    url: '/lista-apertura',

                    params: {

                    },
                    views: {
                        '': {
                            templateUrl: 'app/caso/bandeja.lista.tpl.html',
                            resolve: {
                                moneda: ['casoService',
                                    function (casoService) {
                                        return casoService.list();
                                    }],
                                dependencia: ['casoService',
                                    function (casoService) {
                                        return casoService.listDependence();
                                    }],
                                documento: ['casoService',
                                    function (casoService) {
                                        return casoService.listDocument();
                                    }],
                                persona: ['casoService',
                                    function (casoService) {
                                        return casoService.listPeople();
                                    }]
                            },
                            controller: ['$scope', '$state', '$sce', 'toastr', 'ngDialog', 'moneda', 'dependencia', 'persona', 'documento', 'casoService', 'authService', '$filter',
                                function ($scope, $state, $sce, toastr, ngDialog, moneda, dependencia, persona, documento, casoService, authService, $filter) {
                                    $scope.param = {
                                    }
                                    $scope.plantilla = {}
                                    $scope.consulta = {}

                                    $scope.param.ins = "ORGANISMO JUDICIAL DE LA REPÚBLICA DE GUATEMALA";
                                    $scope.param.sistema = "PORTAL DE GESTIÓN DE APOYO JUDICIAL EN MATERIA DE FAMILIA"
                                    $scope.param.pantalla = "REGISTRO DE CASOS"

                                    $scope.plantilla.dependence = dependencia.data;
                                    $scope.plantilla.document = documento.data;
                                    $scope.plantilla.people = persona.data;
                                    $scope.plantilla.peopleAdhesion = persona.data;
                                    

                                    $scope.bandejaEdicion = angular.copy($scope.gridOptionsBandeja);
                                    $scope.bandejaEdicion.enableFiltering = true;
                                    $scope.bandejaEdicion.columnDefs = [
                                        { name: "correlativo", displayName: "# Correlativo", width: "8%" },
                                        { name: "anio", displayName: "Año", width: "4%" },
                                        { name: "nombreCaso", displayName: "Nombre Beneficiario", width: "12%" },
                                        { name: "nombreDepositante", displayName: "Nombre Depositante", width: "12%" },
                                        { name: "numeroJuicio", displayName: "# de Juicio", width: "12%" },
                                        { name: "usuarioCrea", displayName: "Usuario Crea", width: "7%" },
                                        { name: "fechaCrea", displayName: "Fecha creación", width: "10%", cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },
                                        { name: "usuarioModifica", displayName: "Usuario Modifica", width: "7%" },
                                        { name: "fechaModifica", displayName: "Fecha modificación", width: "10%", cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },
                                        { name: "estado", displayName: "Estado", width: "9%", enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents text-center">{{grid.appScope.etiquetaEstado(row.entity.estado)}}</div>' },

                                        {
                                            name: 'OPCIÓN', enableFiltering: false, width: "8%",
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span>'
                                                + '<button type="button" class="btn btn-info btn-sm" ng-click="grid.appScope.opcionVer(row.entity)" title="Ver" ng-show={{grid.appScope.validaEstadoOp1(row.entity.estado)}} ><i class="fa fa-search fa-2x"></i></button>'
                                                + '<button type="button" class="btn btn-primary btn-sm" ng-click="grid.appScope.opcionVer(row.entity)" title="Editar" ng-show={{grid.appScope.validaEstadoOp2(row.entity.estado)}}><i class="fa fa-edit fa-2x"></i></button>&#160'

                                        }
                                    ];

                                    $scope.modificacionesSolicitadas = angular.copy($scope.gridOptionsModificacion);
                                    $scope.modificacionesSolicitadas.columnDefs = [
                                        { name: "observacion", displayName: "Modificación", width: "25%" },
                                        { name: "usuarioCrea", displayName: "Solicitante", width: "25%" },
                                        { name: "rhNombreSolicita", displayName: "Dependencia del solicitante", width: "25%" },
                                        { name: "fechaCrea", displayName: "Fecha de solicitud", width: "25%",cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },


                                    ];

                                    //$scope.getsolicitudes.onRegisterApi = function(gridApi){$scope.gridApi = gridApi};
                                    function lista() {
                                        casoService.getInfoEmpleado($scope.loginData.codigoEmpleado).then(function (response) {

                                            if (response.status === "error") {
                                                toastr.warning("Gafete");
                                                $scope.gblDependencia = "null";
                                                $scope.paraNotificacion = 1;
                                                $scope.consulta.codigoDependencia = 5555;
                                                $scope.consulta.gafete = $scope.loginData.codigoEmpleado;
                                                $scope.consulta.sede = 'GT'
                                                toastr.info($scope.consulta.codigoDependencia)
                                                casoService.getCreado($scope.consulta.codigoDependencia).then(function (response) {
                                                    if (response.status == "OK") {
                                                        $scope.bandejaEdicion.data = response.data;
                                                    } else {
                                                        toastr.warning("Problema al obtener solicitudes creadas. Ex000SGLPA")
                                                    }
                                                }, function (error) {
                                                    toastr.error("Fallo de comunicación con el servidor. Ex000SFpa1")
                                                })
                                            } else {
                                                if (response.data.length > 0) {
                                                    $scope.consulta.gafete = response.data[0].empleadoId;
                                                    $scope.consulta.nombreEmpleado = response.data[0].empleadoDesc;
                                                    $scope.consulta.codigoDependencia = response.data[0].dependenciaFuncionesId;
                                                    $scope.consulta.nombreDependencia = response.data[0].dependenciaFuncionesDesc;
                                                    toastr.info($scope.consulta.codigoDependencia)
                                                    casoService.getCreado($scope.consulta.codigoDependencia).then(function (response) {
                                                        if (response.status == "OK") {
                                                            $scope.bandejaEdicion.data = response.data;
                                                        } else {
                                                            toastr.warning("Problema al obtener solicitudes creadas. Ex000SGLPA")
                                                        }
                                                    }, function (error) {
                                                        toastr.error("Fallo de comunicación con el servidor. Ex000SFpa1")
                                                    })

                                                } else {
                                                    toastr.info("Ocurrio un problema para consultar la dependencia de origen, del usuario en sesión.");
                                                    $scope.gblDependencia = "null";
                                                }
                                            }
                                        });
                                    }
                                    lista();

                                    $scope.etiquetaEstado = function (valor) {
                                        //console.log(valor);
                                        var mensaje = null;
                                        if (valor == 1) {
                                            mensaje = 'PENDIENTE APROBACIÓN JUEZ'
                                        } else if (valor == 2) {
                                            mensaje = 'PENDIENTE DE MODIFICACIÓN'
                                        } else if (valor == 3) {
                                            mensaje = 'PENDIENTE AUTORIZACIÓN EN FINANCIERO'
                                        } else if (valor == 4) {
                                            mensaje = 'CASO APERTURADO EN FINANCIERO'
                                        }
                                        return mensaje;
                                    }

                                    $scope.validaEstadoOp1 = function (valor) {
                                        var mensaje = false;
                                        if (valor == 1) {
                                            mensaje = true;//mensaje = 'FORMULARIO CREADO'
                                        } else if (valor == 2) {
                                            mensaje = false;
                                            //mensaje = 'PENDIENTE DE MODIFICACIÓN'
                                        } else if (valor == 3) {
                                            mensaje = true;
                                        }
                                        return mensaje;
                                    }
                                    $scope.validaEstadoOp2 = function (valor) {
                                        var mensaje = false;
                                        if (valor == 2) {
                                            mensaje = true;//mensaje = 'FORMULARIO CREADO'
                                        } else{ 
                                            mensaje = false;
                                            //mensaje = 'PENDIENTE DE MODIFICACIÓN'
                                        }
                                        return mensaje;
                                    }
                                    $scope.gridOptionsAnexos = angular.copy($scope.gridOptionsSelection);
                                    $scope.gridOptionsAnexos.columnDefs = [
                                        //{ name: 'tipoPersona', displayName: "Tipo Persona" },
                                        { name: 'descTipoPersona', displayName: "Descripción Persona" },
                                        //{ name: 'idTipoDocumento', displayName: "Documento" },
                                        { name: 'descIdTipoDoc', displayName: "Tipo Documento" },
                                        { name: 'documento', displayName: "# Documento", enableCellEdit: true },
                                        { name: 'descripcion', displayName: "Archivo" },
                                        {
                                            name: 'Ver', enableFiltering: false,
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span><button type="button" class="btn btn-primary btn-sm" ng-click="grid.appScope.viewFileTemp(row.entity)" title="Ver anexo">Ver</button></span></div>',
                                            width: "10%"
                                        },
                                        {
                                            name: 'Opcion', enableFiltering: false,
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span><button type="button" class="btn btn-danger btn-sm" ng-click="grid.appScope.quitarAnexo(row.entity)" title="Eliminar anexo" ng-show="grid.appScope.param.condicion === 2">Quitar</button></span></div>',
                                            width: "10%"
                                        }
                                    ];

                                    $scope.anexo = {
                                        tipoPersona: null,
                                        descripcion: null,
                                        url: null,
                                        typeFile: null
                                    }
                                    $scope.expediente = {
                                        correlativo: null,
                                        idSolicitud: null,
                                        idtipoCaso: null,
                                        idmoneda: null,
                                        nombreCaso: null,
                                        nombreDepositante: null,
                                        numeroJuicio: null,
                                        cuotaMensual: null,
                                        usuarioCrea: null,
                                        iddependencia: null,
                                        observacion: null,
                                        rhDependencia: null,
                                        sede: null,
                                        pgfAnexos: []
                                    }


                                    $scope.clonarArray = function (array) {
                                        var clonado = [];
                                        var count = Object.keys(array).length;
                                        if (count > 0) {
                                            for (var i = 0; i < count; i++) {
                                                var data = array[i];
                                                if (data.estado == 1) {
                                                    clonado.push(data);
                                                }
                                            }
                                        }
                                        return clonado;
                                    }

                                    $scope.gblExpediente = {};
                                    $scope.opcionVer = function (row) {
                                        casoService.getMovimiento(row.correlativo).then(function(response){
                                            $scope.modificacionesSolicitadas.data = response.data;
                                        })

                                        if (row.estado == 1) {
                                            $scope.param.condicion = 1;
                                        } else if (row.estado == 2) {
                                            $scope.param.condicion = 2;
                                        } else {
                                            $scope.param.condicon = 0;
                                        }

                                        $scope.plantilla.seleccion = row.correlativo;
                                        casoService.getConsultaCreado(row.correlativo, $scope.consulta.codigoDependencia).then(function (response) {
                                            $scope.bandera.valor = 0;

                                            ngDialog.open({
                                                template: 'app/caso/consulta.tpl.html',
                                                closeByDocument: true,
                                                closeByEscape: true,
                                                width: '70%',
                                                height: 600,
                                                showClose: true,
                                                scope: $scope
                                            });

                                            $scope.plantilla.moneda = moneda.data[0].descMoneda;
                                            $scope.plantilla.tipoCaso = moneda.data[1].descTipoCaso;
                                            $scope.plantilla.ben = response.data[0].nombreCaso;
                                            $scope.plantilla.dep = response.data[0].nombreDepositante;
                                            $scope.plantilla.nojuicio = response.data[0].numeroJuicio;
                                            $scope.plantilla.observacion = response.data[0].observacion;
                                            $scope.plantilla.codigoDependencia = response.data[0].iddependencia;
                                            $scope.plantilla.cuota = response.data[0].cuotaMensual;
                                            $scope.plantilla.fecha = response.data[0].fechaCrea;
                                            $scope.plantilla.anio = response.data[0].anio;
                                            $scope.plantilla.estado = response.data[0].estado;

                                            $scope.gblExpediente = response.data;
                                            $scope.expedienteAnexoTemp = $scope.clonarArray($scope.gblExpediente[0].pgfAnexos);
                                            if (!response.data[0].pgfAnexos) {
                                                response.data[0].pgfAnexos = [];
                                                $scope.gridOptionsAnexos.data = response.data[0].pgfAnexos;
                                            } else {
                                                $scope.gridOptionsAnexos.data = response.data[0].pgfAnexos;
                                            }
                                        });
                                    }

                                    $scope.findInArray = function (condicion, array) {
                                        var res;
                                        var found = $filter('filter')(array, condicion, true);
                                        if (found.length) {
                                            res = found[0];
                                        } else {
                                            res = 'No se encontró';
                                        }
                                        return res;
                                    }
                                    $scope.hoy = function () {
                                        var dt = new Date();
                                        dt.setHours(dt.getHours() + 1);
                                        dt.setMinutes(0);
                                        return dt;
                                    };
                                    $scope.capturePeople = function () {
                                        $scope.plantilla.codigoPersona = $scope.plantilla.peopleSelect.idTipoPersona;
                                        $scope.plantilla.descripcionPersona = $scope.plantilla.peopleSelect.descripcionPersona;
                                    }
                                    $scope.captureDocument = function () {
                                        $scope.plantilla.codigoDocumento = $scope.plantilla.documentSelect.idDocumento;
                                        $scope.plantilla.descripcionDocumento = $scope.plantilla.documentSelect.idTipoDocumento;

                                    }
                                    $scope.viewFileTemp = function (row) {
                                        var typeFile = row.url.split(".");
                                        if (typeFile[1] == 'PDF' || typeFile[1] == 'pdf') {
                                            var urlAnexo;
                                            urlAnexo = row.url.replace(/\//g, "$");
                                            urlAnexo = urlAnexo.replace(/ /, "%20");
                                            urlAnexo = appSettings.restApiServiceBaseUri + 'download/filetemp/' + urlAnexo;
                                            $scope.path2 = "";
                                            $scope.path2 = encodeURIComponent(urlAnexo);
                                            urlAnexo = './web/viewer.html?file=' + $scope.path2;

                                            $scope.trustSrc = function (src) {
                                                return $sce.trustAsResourceUrl(src);
                                            }
                                            $scope.iframe = { src: urlAnexo };
                                            ngDialog.open({
                                                template: 'app/caso/anexo.tpl.html',
                                                className: 'ngdialog-theme-flat',
                                                closeByDocument: true,
                                                closeByEscape: true,
                                                width: '100%',
                                                height: '100%',
                                                scope: $scope
                                            });
                                        } else {
                                            var data = {
                                                imgBase: row.url
                                            }

                                            casoService.getImg(data).then(function (response) {
                                                $scope.imgSrc = response.dataA.imgBase;
                                                ngDialog.open({
                                                    template: 'app/caso/anexoImg.tpl.html',
                                                    className: 'ngdialog-theme-flat',
                                                    closeByDocument: false,
                                                    closeByEscape: true,
                                                    scope: $scope
                                                });

                                            })
                                        }
                                    }

                                    $scope.agregarDocumento = function () {

                                        var file = $scope.$$childTail.myFile2;
                                        if (file == null || file.name == null) {
                                            toastr.error("Debe elegir un archivo");
                                            return;
                                        } else {
                                            casoService.uploadFile(file).then(function (response) {
                                                if (response.status == "OK") {
                                                    var anexoTemp = {};
                                                    for (var i in $scope.arregloAnexo) {
                                                        if ($scope.arregloAnexo[i].IDTIPO_ANEXO == $scope.anexo.TIPO_ANEXO_DESC) {
                                                            anexoTemp.tipoPersona = $scope.arregloAnexo[i].tipoPersona;
                                                            anexoTemp.descripcion = $scope.arregloAnexo[i].TIPO_ANEXO_DESC;
                                                            anexoTemp.tipoAnexo = $scope.arregloAnexo[i].IDTIPO_ANEXO;
                                                            break;
                                                        }
                                                    }


                                                    anexoTemp.tipoPersona = $scope.plantilla.codigoPersona;
                                                    anexoTemp.descTipoPersona = $scope.plantilla.descripcionPersona
                                                    anexoTemp.idTipoDocumento = $scope.plantilla.codigoDocumento;
                                                    anexoTemp.descIdTipoDoc = $scope.plantilla.descripcionDocumento;
                                                    anexoTemp.descripcion = file.name;
                                                    //anexoTemp.tipoAnexo = $scope.anexo.TIPO_ANEXO_DESC;
                                                    anexoTemp.url = response.data[0].url;
                                                    anexoTemp.name = file.name;
                                                    //anexoTemp.pgfPreaperturaCaso =  $scope.plantilla.seleccion;
                                                    anexoTemp.idSolicitud = $scope.plantilla.seleccion;
                                                    //anexoTemp.idSolicitud =  0;
                                                    //anexoTemp.idPgfAnexo = 0;
                                                    anexoTemp.idDependenciaCrea = $scope.plantilla.codigoDependencia;
                                                    anexoTemp.rhDependenciaCrea = $scope.consulta.codigoDependencia;
                                                    var typeFile = response.data[0].url.split(".");
                                                    var lengthArrayFile = typeFile.length;
                                                    anexoTemp.typeFile = typeFile[lengthArrayFile - 1];
                                                    $scope.expedienteAnexoTemp.push(anexoTemp);
                                                    $scope.gblExpediente[0].pgfAnexos.push(anexoTemp);//original                                                                                                        
                                                    $scope.gridOptionsAnexos.data = [];
                                                    //$scope.gridOptionsAnexos.data = $scope.gblExpediente[0].pgfAnexos; //original
                                                    $scope.gridOptionsAnexos.data = $scope.expedienteAnexoTemp;
                                                    swal({
                                                        title: "¡Excelente!",
                                                        text: "Anexo agregado correctamente",
                                                        type: "success",
                                                        showConfirmButton: true
                                                    });
                                                } else {
                                                    toastr.error("Carga no completada. 0X0000CEA");

                                                }
                                            }, function (error) {
                                                toastr.error(error);
                                            });
                                        }
                                    }
                                    //QUITAR, deshabilitar archivo
                                    $scope.quitarAnexo = function (row) {
                                        swal({
                                            title: "¿Está seguro que desea quitar el anexo?",
                                            text: "",
                                            showCancelButton: true,
                                            confirmButtonClass: "btn-success",
                                            confirmButtonText: "Confirmar",
                                            cancelButtonClass: "btn-danger",
                                            cancelButtonText: "Cancelar",
                                            closeOnConfirm: true
                                        },
                                            function () {
                                                var index = $scope.expedienteAnexoTemp.indexOf(row);
                                                $scope.expedienteAnexoTemp.splice(index, 1);
                                                var detalle = $scope.findInArray({ idPgfAnexo: Number(row.idPgfAnexo) }, $scope.gblExpediente[0].pgfAnexos);
                                                if (detalle.idPgfAnexo == 0) {
                                                    var posicion = $scope.gblExpediente[0].pgfAnexos.indexOf(detalle);
                                                    $scope.gblExpediente[0].pgfAnexos.splice(posicion, 1);
                                                    $scope.gridOptionsAnexos.data = $scope.expedienteAnexoTemp;
                                                } else {
                                                    detalle.estado = 0;
                                                    detalle.usuarioModifica = $scope.loginData.usuario,
                                                        detalle.fechaModifica = $scope.hoy();
                                                    $scope.gridOptionsAnexos.data = $scope.expedienteAnexoTemp;
                                                }
                                            });
                                    }

                                    $scope.upd = function () {

                                        //$scope.expediente = $scope.plantilla;
                                        //$scope.expediente.anexos = $scope.gblExpediente.anexos;
                                        $scope.expediente.correlativo = $scope.plantilla.seleccion,
                                            $scope.expediente.idSolicitud = 0,
                                            $scope.expediente.idtipoCaso = moneda.data[1].idTipoCaso,
                                            $scope.expediente.idmoneda = moneda.data[0].idMoneda,
                                            $scope.expediente.nombreCaso = $scope.plantilla.ben.toUpperCase(),
                                            $scope.expediente.nombreDepositante = $scope.plantilla.dep.toUpperCase(),
                                            $scope.expediente.numeroJuicio = $scope.plantilla.nojuicio,
                                            $scope.expediente.cuotaMensual = $scope.plantilla.cuota,
                                            $scope.expediente.usuarioCrea = $scope.loginData.usuario,
                                            $scope.expediente.iddependencia = $scope.plantilla.codigoDependencia,
                                            $scope.expediente.observacion = $scope.plantilla.observacion,
                                            $scope.expediente.rhDependencia = $scope.consulta.codigoDependencia,
                                            $scope.expediente.sede = $scope.consulta.sede,
                                            $scope.expediente.gafete = $scope.consulta.gafete,
                                            $scope.expediente.correo = $scope.loginData.correo,
                                            $scope.expediente.anio = $scope.plantilla.anio,
                                            $scope.expediente.fechaCrea = $scope.plantilla.fecha,
                                            $scope.expediente.estado = $scope.plantilla.estado,
                                            //$scope.gblExpediente[0].pgfAnexos.pgfPreaperturaCaso = $scope.plantilla.seleccion;
                                            $scope.expediente.pgfAnexos = $scope.gblExpediente[0].pgfAnexos,
                                            casoService.update($scope.expediente).then(function (response) {

                                                ngDialog.close();
                                                toastr.success("*Actualización realizada.");
                                                $state.go("index.caso.lista");
                                                lista();

                                            })


                                    }
                                    $scope.agregar = function () {
                                        $state.go("index.caso.agregar");
                                    }

                                }
                            ]
                        }
                    }

                })

                .state('index.caso.agregar', {

                    url: '/add',

                    params: {

                    },
                    views: {
                        '': {
                            templateUrl: 'app/caso/apertura.tpl.html',
                            resolve: {
                                moneda: ['casoService',
                                    function (casoService) {
                                        return casoService.list();
                                    }],
                                dependencia: ['casoService',
                                    function (casoService) {
                                        return casoService.listDependence();
                                    }],
                                documento: ['casoService',
                                    function (casoService) {
                                        return casoService.listDocument();
                                    }],
                                persona: ['casoService',
                                    function (casoService) {
                                        return casoService.listPeople();
                                    }],
                                    empresa: ['casoService',
                                    function (casoService) {
                                        return casoService.getEmpresa();
                                    }]
                            },
                            controller: ['$scope', '$state', '$sce', 'toastr', 'ngDialog', 'moneda', 'dependencia', 'documento', 'persona','empresa','casoService', 'authService',
                                function ($scope, $state, $sce, toastr, ngDialog, moneda, dependencia, documento, persona, empresa, casoService, authService) {
                                                                                                   
                                    $scope.param = {
                                    }
                                    $scope.plantilla = {}
                                    $scope.consulta = {}

                                    $scope.plantilla.noSolicitud = 1;
                                    $scope.param.ins = "ORGANISMO JUDICIAL DE LA REPÚBLICA DE GUATEMALA";
                                    $scope.param.sistema = "PORTAL DE GESTIÓN DE APOYO JUDICIAL EN MATERIA DE FAMILIA"
                                    $scope.param.pantalla = "REGISTRO DE CASOS"

                                    $scope.plantilla.moneda = moneda.data[0].descMoneda;
                                    $scope.plantilla.tipoCaso = moneda.data[1].descTipoCaso;
                                    $scope.plantilla.dependence = dependencia.data;
                                    $scope.plantilla.document = documento.data;
                                    $scope.plantilla.people = persona.data;
                                    $scope.plantilla.peopleAdhesion = persona.data;
                                    
                                    $scope.plantilla.empresa = empresa.data;


                                    casoService.getInfoEmpleado($scope.loginData.codigoEmpleado).then(function (response) {

                                        if (response.status === "error") {
                                            toastr.warning("Gafete");
                                            $scope.gblDependencia = "null";
                                            $scope.paraNotificacion = 1;
                                            $scope.consulta.codigoDependencia = 5555;
                                            $scope.consulta.gafete = $scope.loginData.codigoEmpleado;
                                            $scope.consulta.sede = 'GT';
                                            $scope.consulta.nombreDependencia = "DEPENDENCIA";
                                        } else {
                                            if (response.data.length > 0) {
                                                $scope.consulta.gafete = response.data[0].empleadoId;
                                                $scope.consulta.nombreEmpleado = response.data[0].empleadoDesc;
                                                $scope.consulta.codigoDependencia = response.data[0].dependenciaFuncionesId;
                                                $scope.consulta.nombreDependencia = response.data[0].dependenciaFuncionesDesc;
                                            } else {
                                                toastr.info("Ocurrio un problema para consultar la dependencia de origen, del usuario en sesión.");
                                                $scope.gblDependencia = "null";
                                            }
                                        }

                                    })


                                    $scope.capturaDependence = function () {

                                        $scope.plantilla.codigoDependencia = $scope.plantilla.dependenceSelect.idDependencia;
                                        toastr.info($scope.plantilla.codigoDependencia)
                                    }
                                    $scope.refrescar = function () {
                                        $scope.plantilla.document = documento.data;
                                        $scope.plantilla.people = persona.data;
                                        $scope.plantilla.dependence = dependencia.data;
                                    }
                                    $scope.bandejaEdicion = angular.copy($scope.gridOptions);
                                    $scope.bandejaEdicion.enableFiltering = true;
                                    //$scope.getsolicitudes.onRegisterApi = function(gridApi){$scope.gridApi = gridApi};

                                    $scope.bandejaEdicion.columnDefs = [
                                        { name: "idcaso", displayName: "# de Caso", width: "8%" },
                                        { name: "noJuicio", displayName: "# de Juicio", width: "8%", cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },
                                        { name: "beneficiario", displayName: "Usuario", width: "8%" },

                                        {
                                            name: 'OPCIONES', enableFiltering: false, width: "8%",
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span>'
                                                + '<button type="button" class="btn btn-primary btn-sm" ng-click="grid.appScope.opcion(row.entity)" title="Opciones"><i class="fa fa-search fa-2x"></i></button>&#160'
                                            //+ '<button type="button" class="btn btn-success btn-sm" ng-click="grid.appScope.opcion2(row.entity)" title="Opciones"><i class="fa fa-flag fa-2x"></i></button>'                                                
                                        }
                                    ];

                                    $scope.casoRelacionado = angular.copy($scope.gridOptionsSelection);
                                    $scope.casoRelacionado.enableFiltering = true;
                                    //$scope.getsolicitudes.onRegisterApi = function(gridApi){$scope.gridApi = gridApi};

                                    $scope.casoRelacionado.columnDefs = [
                                        { name: "caso", displayName: "# de Caso", width: "18%", enableFiltering: false },
                                        { name: "estatus", displayName: "Apertura", width: "20%", enableFiltering: false },
                                        { name: "juzgado", displayName: "Juzgado", width: "22%", enableFiltering: false },
                                        { name: "depositante", displayName: "Depositante", width: "20%", enableFiltering: false },
                                        { name: "beneficiario", displayName: "Beneficiario", width: "20%", enableFiltering: false }
                                    ];



                                    //eventos entre cajas
                                    $scope.buscarDep = function (KeyEvent) {
                                        if (KeyEvent.which === 9) {
                                            if ($scope.plantilla.dep.lenght == 0 || $scope.plantilla.dep == "") {
                                                $scope.plantilla.dep.lenght = 0;
                                                toastr.warning("Información - Depositante - incompleta.");
                                            } else {
                                                var data = {
                                                    depositante: $scope.plantilla.dep.toUpperCase()
                                                }
                                                casoService.depAsociado(data).then(function (response) {
                                                    $scope.casoRelacionado.data = response.data;
                                                })
                                                //servicio                                                                                                
                                            }
                                        }
                                    }

                                    $scope.buscarBen = function (KeyEvent) {
                                        if (KeyEvent.which === 9) {
                                            if ($scope.plantilla.ben.lenght == 0 || $scope.plantilla.ben == "") {
                                                $scope.plantilla.ben.lenght = 0;
                                                toastr.warning("Información - Beneficiario - incompleta.");
                                            } else {
                                                var data = {
                                                    depositante: $scope.plantilla.dep.toUpperCase(),
                                                    beneficiario: $scope.plantilla.ben.toUpperCase()
                                                }

                                                casoService.benAsociado(data).then(function (response) {
                                                    $scope.casoRelacionado.data = response.data;
                                                })
                                                //servicio                                                                                                
                                            }
                                        }
                                    }

                                    $scope.gridOptionsAnexos = angular.copy($scope.gridOptionsSelection);
                                    $scope.gridOptionsAnexos.columnDefs = [
                                        //{ name: 'idTipoPersona', displayName: "Tipo Persona" },
                                        { name: 'idTipoPersona', displayName: "Descripción Persona", enableCellEdit: false },
                                        //{ name: 'idTipoDocumento', displayName: "Documento" },
                                        { name: 'tipoDocumento', displayName: "Tipo Documento", enableCellEdit: false },
                                        { name: 'documento', displayName: "# Documento", enableCellEdit: true },
                                        { name: 'descripcion', displayName: "Archivo", enableCellEdit: false },
                                        { name: 'typeFile', displayName: "Tipo Archivo", enableCellEdit: false },
                                        {
                                            name: 'Ver', enableFiltering: false,
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span><button type="button" class="btn btn-primary btn-sm" ng-click="grid.appScope.viewFileTemp(row.entity)" title="Ver anexo">Ver</button></span></div>',
                                            width: "10%"
                                        },
                                        {
                                            name: 'Opcion', enableFiltering: false,
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span><button type="button" class="btn btn-danger btn-sm" ng-click="grid.appScope.quitarAnexo(row.entity)" title="Eliminar anexo">Quitar</button></span></div>',
                                            width: "10%"
                                        }
                                    ];

                                    $scope.gridOptionsAdhesion = angular.copy($scope.gridOptionsSelection);
                                    $scope.gridOptionsAdhesion.columnDefs = [
                                        //{ name: 'idTipoPersona', displayName: "Tipo Persona" },
                                        { name: 'descPersona', displayName: "Descripción Persona", enableCellEdit: false },
                                        //{ name: 'idTipoDocumento', displayName: "Documento" },
                                        { name: 'nombreEmpresa', displayName: "Tipo Documento", enableCellEdit: false },
                                        { name: 'numeroTelefono', displayName: "Número de Telefóno", enableCellEdit: true },                                                                                                                        
                                        {
                                            name: 'Opcion', enableFiltering: false,
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span><button type="button" class="btn btn-danger btn-sm" ng-click="grid.appScope.quitarAdhesion(row.entity)" title="Eliminar anexo">Quitar</button></span></div>',
                                            width: "10%"
                                        }
                                    ];
                                    $scope.anexo = {
                                        tipoPersona: null,
                                        descripcion: null,
                                        url: null,
                                        typeFile: null
                                    }
                                    $scope.expediente = {
                                        correlativo: null,
                                        idSolicitud: null,
                                        idtipoCaso: null,
                                        idmoneda: null,
                                        nombreCaso: null,
                                        nombreDepositante: null,
                                        numeroJuicio: null,
                                        cuotaMensual: null,
                                        usuarioCrea: null,
                                        iddependencia: null,
                                        observacion: null,
                                        rhDependencia: null,
                                        sede: null,
                                        gafete: null,
                                        correo: null,
                                        pgfAnexos: [],
                                        pgfAdhesiones: []
                                    }


                                    $scope.submitFormAnexo = function () {

                                        var file = $scope.myFile2;
                                        toastr.success(file)
                                        if (file == null || file.name == null) {
                                            toastr.error("Debe elegir un archivo");
                                            return;
                                        } else {

                                        }
                                    }

                                    $scope.capturePeople = function () {
                                        $scope.plantilla.codigoPersona = $scope.plantilla.peopleSelect.idTipoPersona;
                                        $scope.plantilla.descripcionPersona = $scope.plantilla.peopleSelect.descripcionPersona;
                                    }
                                    $scope.captureDocument = function () {
                                        $scope.plantilla.codigoDocumento = $scope.plantilla.documentSelect.idDocumento;
                                        $scope.plantilla.descripcionDocumento = $scope.plantilla.documentSelect.idTipoDocumento;

                                    }

                                    $scope.capturePeopleAdhesion = function () {
                                        $scope.plantilla.codigoPersonaAdhesion = $scope.plantilla.peopleSelectAdhesion.idTipoPersona;
                                        $scope.plantilla.descripcionPersonaAdhesion = $scope.plantilla.peopleSelectAdhesion.descripcionPersona;
                                    }

                                    $scope.capturaEmpresa = function () {                                        
                                        $scope.plantilla.codigoEmpresa = $scope.plantilla.empresaSelect.idEmpresa;
                                        $scope.plantilla.nombreEmpresa = $scope.plantilla.empresaSelect.nombreEmpresa;                                        
                                    }

                                    $scope.agregarDocumento = function () {

                                        var file = $scope.myFile2;
                                        if (file == null || file.name == null) {
                                            toastr.error("Debe elegir un archivo");
                                            return;
                                        } else {
                                            casoService.uploadFile(file).then(function (response) {
                                                if (response.status == "OK") {
                                                    var anexoTemp = {};
                                                    for (var i in $scope.arregloAnexo) {
                                                        if ($scope.arregloAnexo[i].IDTIPO_ANEXO == $scope.anexo.TIPO_ANEXO_DESC) {
                                                            anexoTemp.tipoPersona = $scope.arregloAnexo[i].tipoPersona;
                                                            anexoTemp.descripcion = $scope.arregloAnexo[i].TIPO_ANEXO_DESC;
                                                            anexoTemp.tipoAnexo = $scope.arregloAnexo[i].IDTIPO_ANEXO;
                                                            break;
                                                        }
                                                    }

                                                    anexoTemp.tipoPersona = $scope.plantilla.codigoPersona;
                                                    anexoTemp.idTipoPersona = $scope.plantilla.descripcionPersona
                                                    anexoTemp.idTipoDocumento = $scope.plantilla.codigoDocumento;
                                                    anexoTemp.tipoDocumento = $scope.plantilla.descripcionDocumento;
                                                    anexoTemp.descripcion = file.name;
                                                    //anexoTemp.tipoAnexo = $scope.anexo.TIPO_ANEXO_DESC;
                                                    anexoTemp.url = response.data[0].url;
                                                    anexoTemp.name = file.name;
                                                    anexoTemp.idSolicitud = 0;
                                                    anexoTemp.idPgfAnexo = 0;
                                                    anexoTemp.idDependenciaCrea = $scope.plantilla.codigoDependencia;
                                                    anexoTemp.rhDependenciaCrea = $scope.consulta.codigoDependencia;
                                                    var typeFile = response.data[0].url.split(".");
                                                    var lengthArrayFile = typeFile.length;
                                                    anexoTemp.typeFile = typeFile[lengthArrayFile - 1];

                                                    $scope.expediente.pgfAnexos.push(anexoTemp);
                                                    $scope.gridOptionsAnexos.data = [];
                                                    $scope.gridOptionsAnexos.data = $scope.expediente.pgfAnexos;
                                                    swal({
                                                        title: "¡Excelente!",
                                                        text: "Anexo agregado correctamente",
                                                        type: "success",
                                                        showConfirmButton: true
                                                    });
                                                } else {
                                                    toastr.error("Carga no completada. 0X0000CEA");

                                                }
                                            }, function (error) {
                                                toastr.error(error);
                                            });
                                        }
                                    }

                                    $scope.viewFileTemp = function (row) {
                                        var typeFile = row.url.split(".");
                                        if (typeFile[1] == 'PDF' || typeFile[1] == 'pdf') {
                                            var urlAnexo;
                                            urlAnexo = row.url.replace(/\//g, "$");
                                            urlAnexo = urlAnexo.replace(/ /, "%20");
                                            urlAnexo = appSettings.restApiServiceBaseUri + 'download/filetemp/' + urlAnexo;
                                            //$scope.sesion.path2=encodeURIComponent(urlReporteAgenda)
                                            $scope.path2 = "";
                                            $scope.path2 = encodeURIComponent(urlAnexo);
                                            urlAnexo = './web/viewer.html?file=' + $scope.path2;

                                            $scope.trustSrc = function (src) {
                                                return $sce.trustAsResourceUrl(src);
                                            }
                                            $scope.iframe = { src: urlAnexo };
                                            ngDialog.open({
                                                template: 'app/caso/anexo.tpl.html',
                                                className: 'ngdialog-theme-flat',
                                                closeByDocument: true,
                                                closeByEscape: true,
                                                width: '100%',
                                                height: '100%',
                                                scope: $scope
                                            });
                                        } else {
                                            var data = {
                                                imgBase: row.url
                                            }

                                            casoService.getImg(data).then(function (response) {
                                                $scope.imgSrc = response.dataA.imgBase;
                                                ngDialog.open({
                                                    template: 'app/caso/anexoImg.tpl.html',
                                                    className: 'ngdialog-theme-flat',
                                                    closeByDocument: false,
                                                    closeByEscape: true,
                                                    scope: $scope
                                                });
                                            });
                                        }
                                    }

                                    $scope.quitarAnexo = function (row) {
                                        swal({
                                            title: "¿Está seguro que desea eliminar el anexo?",
                                            text: "",
                                            showCancelButton: true,
                                            confirmButtonClass: "btn-success",
                                            confirmButtonText: "Confirmar",
                                            cancelButtonClass: "btn-danger",
                                            cancelButtonText: "Cancelar",
                                            closeOnConfirm: true
                                        },
                                            function () {
                                                var index = $scope.expediente.pgfAnexos.indexOf(row);
                                                $scope.expediente.pgfAnexos.splice(index, 1);
                                                $scope.gridOptionsAnexos.data = $scope.expediente.pgfAnexos;
                                            });
                                    }

                                    $scope.agregarInformacion = function(){
                                        if($scope.plantilla.noTelefono == "" || $scope.plantilla.noTelefono == undefined){
                                            toastr.warning("Debe de ingresar un número de telefóno valido.")
                                        }else{
                                          var adhesionTemp = {}
                                                
                                                        adhesionTemp.tipoPersona = $scope.plantilla.codigoPersonaAdhesion;
                                                        adhesionTemp.descPersona = $scope.plantilla.descripcionPersonaAdhesion;
                                                        adhesionTemp.idEmpresa = $scope.plantilla.codigoEmpresa;
                                                        adhesionTemp.nombreEmpresa = $scope.plantilla.nombreEmpresa;
                                                        adhesionTemp.tipoDocumento = $scope.plantilla.descripcionDocumento;
                                                        adhesionTemp.numeroTelefono = $scope.plantilla.noTelefono;
                                                        
                                                        adhesionTemp.idSolicitud = 0;
                                                                                                    
                                                        $scope.expediente.pgfAdhesiones.push(adhesionTemp);
                                                        $scope.gridOptionsAdhesion.data = [];
                                                        $scope.gridOptionsAdhesion.data = $scope.expediente.pgfAdhesiones;                                                        
                                                        $scope.plantilla.noTelefono = null;
                                        }
                                    }
                                    $scope.reg = function () {
                                        $scope.expediente.correlativo = 0,
                                            $scope.expediente.idSolicitud = 0,
                                            $scope.expediente.idtipoCaso = moneda.data[1].idTipoCaso,
                                            $scope.expediente.idmoneda = moneda.data[0].idMoneda,
                                            $scope.expediente.nombreCaso = $scope.plantilla.ben.toUpperCase(),
                                            $scope.expediente.nombreDepositante = $scope.plantilla.dep.toUpperCase(),
                                            $scope.expediente.numeroJuicio = $scope.plantilla.nojuicio,
                                            $scope.expediente.cuotaMensual = $scope.plantilla.cuota,
                                            $scope.expediente.usuarioCrea = $scope.loginData.usuario,
                                            $scope.expediente.iddependencia = $scope.plantilla.codigoDependencia,
                                            $scope.expediente.observacion = $scope.plantilla.observacion,
                                            $scope.expediente.rhDependencia = $scope.consulta.codigoDependencia,
                                            $scope.expediente.sede = $scope.consulta.sede,
                                            $scope.expediente.gafete = $scope.consulta.gafete,
                                            $scope.expediente.correo = $scope.loginData.correo,
                                            $scope.expediente.pgfAdhesiones = $scope.expediente.pgfAdhesiones,
                                            $scope.expediente.pgfAnexos = $scope.expediente.pgfAnexos 

                                            casoService.add($scope.expediente).then(function (response) {
                                                if (response.status == "OK") {
                                                    toastr.success("Pre apertura de Caso registrada exitosamente!.")
                                                    $state.go('index.caso.lista');
                                                    $scope.expediente = null;
                                                } else {
                                                    toastr.warning("Ocurrio un problema para el registro de la Preapertura de Caso.")
                                                }
                                            }, function (error) {
                                                toastr.error("Problema con el servicio de registro. 0x000RCPA1")
                                            })
                                    }


                                }
                            ]
                        }
                    }

                })

                .state('index.consulta-registro', {

                    url: 'registro',

                    params: {

                    },
                    views: {
                        '': {
                            templateUrl: 'app/caso/adhesion.tpl.html',
                            resolve: {
                                moneda: ['casoService',
                                    function (casoService) {
                                        return casoService.list();
                                    }],
                                dependencia: ['casoService',
                                    function (casoService) {
                                        return casoService.listDependence();
                                    }],
                                documento: ['casoService',
                                    function (casoService) {
                                        return casoService.listDocument();
                                    }],
                                persona: ['casoService',
                                    function (casoService) {
                                        return casoService.listPeople();
                                    }],
                                    empresa: ['casoService',
                                    function (casoService) {
                                        return casoService.getEmpresa();
                                    }]
                            },
                            controller: ['$scope', '$state', '$sce', 'toastr', 'ngDialog', 'moneda', 'dependencia', 'documento', 'persona','empresa','casoService', 'authService',
                                function ($scope, $state, $sce, toastr, ngDialog, moneda, dependencia, documento, persona, empresa, casoService, authService) {
                                                                                                   
                                    $scope.param = {
                                    }
                                    $scope.plantilla = {}
                                    $scope.consulta = {}

                                    $scope.plantilla.noSolicitud = 1;
                                    $scope.param.ins = "ORGANISMO JUDICIAL DE LA REPÚBLICA DE GUATEMALA";
                                    $scope.param.sistema = "PORTAL DE GESTIÓN DE APOYO JUDICIAL EN MATERIA DE FAMILIA"
                                    $scope.param.pantalla = "REGISTRO DE CASOS"

                                    $scope.plantilla.moneda = moneda.data[0].descMoneda;
                                    $scope.plantilla.tipoCaso = moneda.data[1].descTipoCaso;
                                    $scope.plantilla.dependence = dependencia.data;
                                    $scope.plantilla.document = documento.data;
                                    $scope.plantilla.people = persona.data[0];
                                    $scope.plantilla.peopleAdhesion = persona.data;
                                    
                                    $scope.plantilla.empresa = empresa.data;
                                    
                                    console.log($scope.plantilla.people)
                                    casoService.getInfoEmpleado($scope.loginData.codigoEmpleado).then(function (response) {

                                        if (response.status === "error") {
                                            toastr.warning("Gafete");
                                            $scope.gblDependencia = "null";
                                            $scope.paraNotificacion = 1;
                                            $scope.consulta.codigoDependencia = 5555;
                                            $scope.consulta.gafete = $scope.loginData.codigoEmpleado;
                                            $scope.consulta.sede = 'GT';
                                            $scope.consulta.nombreDependencia = "DEPENDENCIA";
                                        } else {
                                            if (response.data.length > 0) {
                                                $scope.consulta.gafete = response.data[0].empleadoId;
                                                $scope.consulta.nombreEmpleado = response.data[0].empleadoDesc;
                                                $scope.consulta.codigoDependencia = response.data[0].dependenciaFuncionesId;
                                                $scope.consulta.nombreDependencia = response.data[0].dependenciaFuncionesDesc;
                                            } else {
                                                toastr.info("Ocurrio un problema para consultar la dependencia de origen, del usuario en sesión.");
                                                $scope.gblDependencia = "null";
                                            }
                                        }

                                    })


                                    $scope.capturaDependence = function () {

                                        $scope.plantilla.codigoDependencia = $scope.plantilla.dependenceSelect.idDependencia;
                                        toastr.info($scope.plantilla.codigoDependencia)
                                    }
                                    $scope.refrescar = function () {
                                        $scope.plantilla.document = documento.data;
                                        $scope.plantilla.people = persona.data;
                                        $scope.plantilla.dependence = dependencia.data;
                                    }
                                    $scope.bandejaEdicion = angular.copy($scope.gridOptions);
                                    $scope.bandejaEdicion.enableFiltering = true;
                                    //$scope.getsolicitudes.onRegisterApi = function(gridApi){$scope.gridApi = gridApi};

                                    $scope.bandejaEdicion.columnDefs = [
                                        { name: "idcaso", displayName: "# de Caso", width: "8%" },
                                        { name: "noJuicio", displayName: "# de Juicio", width: "8%", cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },
                                        { name: "beneficiario", displayName: "Usuario", width: "8%" },

                                        {
                                            name: 'OPCIONES', enableFiltering: false, width: "8%",
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span>'
                                                + '<button type="button" class="btn btn-primary btn-sm" ng-click="grid.appScope.opcion(row.entity)" title="Opciones"><i class="fa fa-search fa-2x"></i></button>&#160'
                                            //+ '<button type="button" class="btn btn-success btn-sm" ng-click="grid.appScope.opcion2(row.entity)" title="Opciones"><i class="fa fa-flag fa-2x"></i></button>'                                                
                                        }
                                    ];

                                    $scope.casoRelacionado = angular.copy($scope.gridOptionsSelection);
                                    $scope.casoRelacionado.enableFiltering = true;
                                    //$scope.getsolicitudes.onRegisterApi = function(gridApi){$scope.gridApi = gridApi};

                                    $scope.casoRelacionado.columnDefs = [
                                        { name: "caso", displayName: "# de Caso", width: "18%", enableFiltering: false },
                                        { name: "estatus", displayName: "Apertura", width: "20%", enableFiltering: false },
                                        { name: "juzgado", displayName: "Juzgado", width: "22%", enableFiltering: false },
                                        { name: "depositante", displayName: "Depositante", width: "20%", enableFiltering: false },
                                        { name: "beneficiario", displayName: "Beneficiario", width: "20%", enableFiltering: false }
                                    ];



                                    //eventos entre cajas
                                    $scope.buscarDep = function (KeyEvent) {
                                        if (KeyEvent.which === 9) {
                                            if ($scope.plantilla.dep.lenght == 0 || $scope.plantilla.dep == "") {
                                                $scope.plantilla.dep.lenght = 0;
                                                toastr.warning("Información - Depositante - incompleta.");
                                            } else {
                                                var data = {
                                                    depositante: $scope.plantilla.dep.toUpperCase()
                                                }
                                                casoService.depAsociado(data).then(function (response) {
                                                    $scope.casoRelacionado.data = response.data;
                                                })
                                                //servicio                                                                                                
                                            }
                                        }
                                    }

                                    $scope.buscarBen = function (KeyEvent) {
                                        if (KeyEvent.which === 9) {
                                            if ($scope.plantilla.ben.lenght == 0 || $scope.plantilla.ben == "") {
                                                $scope.plantilla.ben.lenght = 0;
                                                toastr.warning("Información - Beneficiario - incompleta.");
                                            } else {
                                                var data = {
                                                    depositante: $scope.plantilla.dep.toUpperCase(),
                                                    beneficiario: $scope.plantilla.ben.toUpperCase()
                                                }

                                                casoService.benAsociado(data).then(function (response) {
                                                    $scope.casoRelacionado.data = response.data;
                                                })
                                                //servicio                                                                                                
                                            }
                                        }
                                    }

                                    $scope.gridOptionsAnexos = angular.copy($scope.gridOptionsSelection);
                                    $scope.gridOptionsAnexos.columnDefs = [
                                        //{ name: 'idTipoPersona', displayName: "Tipo Persona" },
                                        { name: 'idTipoPersona', displayName: "Descripción Persona", enableCellEdit: false },
                                        //{ name: 'idTipoDocumento', displayName: "Documento" },
                                        { name: 'tipoDocumento', displayName: "Tipo Documento", enableCellEdit: false },
                                        { name: 'documento', displayName: "# Documento", enableCellEdit: true },
                                        { name: 'descripcion', displayName: "Archivo", enableCellEdit: false },
                                        { name: 'typeFile', displayName: "Tipo Archivo", enableCellEdit: false },
                                        {
                                            name: 'Ver', enableFiltering: false,
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span><button type="button" class="btn btn-primary btn-sm" ng-click="grid.appScope.viewFileTemp(row.entity)" title="Ver anexo">Ver</button></span></div>',
                                            width: "10%"
                                        },
                                        {
                                            name: 'Opcion', enableFiltering: false,
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span><button type="button" class="btn btn-danger btn-sm" ng-click="grid.appScope.quitarAnexo(row.entity)" title="Eliminar anexo">Quitar</button></span></div>',
                                            width: "10%"
                                        }
                                    ];

                                    $scope.gridOptionsAdhesion = angular.copy($scope.gridOptionsSelection);
                                    $scope.gridOptionsAdhesion.columnDefs = [
                                        //{ name: 'idTipoPersona', displayName: "Tipo Persona" },
                                        { name: 'descPersona', displayName: "Descripción Persona", enableCellEdit: false },
                                        //{ name: 'idTipoDocumento', displayName: "Documento" },
                                        { name: 'nombreEmpresa', displayName: "Empresa telefónica", enableCellEdit: false },
                                        { name: 'numeroTelefono', displayName: "Número de telefóno", enableCellEdit: true },
                                        { name: 'numeroPrincipal', displayName: "Principal", enableCellEdit: false },                                                                                                                        
                                        { name: 'correo', displayName: "Correo electrónico", enableCellEdit: true },                                                                                                                        
                                        {
                                            name: 'Opcion', enableFiltering: false,
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span><button type="button" class="btn btn-danger btn-sm" ng-click="grid.appScope.quitarAdhesion(row.entity)" title="Eliminar anexo">Quitar</button></span></div>',
                                            width: "10%"
                                        }
                                    ];
                                    $scope.anexo = {
                                        tipoPersona: null,
                                        descripcion: null,
                                        url: null,
                                        typeFile: null
                                    }
                                    $scope.expediente = {
                                        correlativo: null,
                                        idSolicitud: null,
                                        idtipoCaso: null,
                                        idmoneda: null,
                                        nombreCaso: null,
                                        nombreDepositante: null,
                                        numeroJuicio: null,
                                        cuotaMensual: null,
                                        usuarioCrea: null,
                                        iddependencia: null,
                                        observacion: null,
                                        rhDependencia: null,
                                        sede: null,
                                        gafete: null,
                                        correo: null,
                                        pgfAnexos: [],
                                        pgfAdhesiones: []
                                    }


                                    $scope.submitFormAnexo = function () {

                                        var file = $scope.myFile2;
                                        toastr.success(file)
                                        if (file == null || file.name == null) {
                                            toastr.error("Debe elegir un archivo");
                                            return;
                                        } else {

                                        }
                                    }

                                    $scope.capturePeople = function () {
                                        $scope.plantilla.codigoPersona = $scope.plantilla.peopleSelect.idTipoPersona;
                                        $scope.plantilla.descripcionPersona = $scope.plantilla.peopleSelect.descripcionPersona;
                                    }
                                    $scope.captureDocument = function () {
                                        $scope.plantilla.codigoDocumento = $scope.plantilla.documentSelect.idDocumento;
                                        $scope.plantilla.descripcionDocumento = $scope.plantilla.documentSelect.idTipoDocumento;

                                    }

                                    $scope.capturePeopleAdhesion = function () {
                                        $scope.plantilla.codigoPersonaAdhesion = $scope.plantilla.peopleSelectAdhesion.idTipoPersona;
                                        $scope.plantilla.descripcionPersonaAdhesion = $scope.plantilla.peopleSelectAdhesion.descripcionPersona;
                                    }

                                    $scope.capturaEmpresa = function () {                                        
                                        $scope.plantilla.codigoEmpresa = $scope.plantilla.empresaSelect.idEmpresa;
                                        $scope.plantilla.nombreEmpresa = $scope.plantilla.empresaSelect.nombreEmpresa;                                        
                                    }

                                    $scope.agregarDocumento = function () {

                                        var file = $scope.myFile2;
                                        if (file == null || file.name == null) {
                                            toastr.error("Debe elegir un archivo");
                                            return;
                                        } else {
                                            casoService.uploadFile(file).then(function (response) {
                                                if (response.status == "OK") {
                                                    var anexoTemp = {};
                                                    for (var i in $scope.arregloAnexo) {
                                                        if ($scope.arregloAnexo[i].IDTIPO_ANEXO == $scope.anexo.TIPO_ANEXO_DESC) {
                                                            anexoTemp.tipoPersona = $scope.arregloAnexo[i].tipoPersona;
                                                            anexoTemp.descripcion = $scope.arregloAnexo[i].TIPO_ANEXO_DESC;
                                                            anexoTemp.tipoAnexo = $scope.arregloAnexo[i].IDTIPO_ANEXO;
                                                            break;
                                                        }
                                                    }

                                                    anexoTemp.tipoPersona = $scope.plantilla.codigoPersona;
                                                    anexoTemp.idTipoPersona = $scope.plantilla.descripcionPersona
                                                    anexoTemp.idTipoDocumento = $scope.plantilla.codigoDocumento;
                                                    anexoTemp.tipoDocumento = $scope.plantilla.descripcionDocumento;
                                                    anexoTemp.descripcion = file.name;
                                                    //anexoTemp.tipoAnexo = $scope.anexo.TIPO_ANEXO_DESC;
                                                    anexoTemp.url = response.data[0].url;
                                                    anexoTemp.name = file.name;
                                                    anexoTemp.idSolicitud = 0;
                                                    anexoTemp.idPgfAnexo = 0;
                                                    anexoTemp.idDependenciaCrea = $scope.plantilla.codigoDependencia;
                                                    anexoTemp.rhDependenciaCrea = $scope.consulta.codigoDependencia;
                                                    var typeFile = response.data[0].url.split(".");
                                                    var lengthArrayFile = typeFile.length;
                                                    anexoTemp.typeFile = typeFile[lengthArrayFile - 1];

                                                    $scope.expediente.pgfAnexos.push(anexoTemp);
                                                    $scope.gridOptionsAnexos.data = [];
                                                    $scope.gridOptionsAnexos.data = $scope.expediente.pgfAnexos;
                                                    swal({
                                                        title: "¡Excelente!",
                                                        text: "Anexo agregado correctamente",
                                                        type: "success",
                                                        showConfirmButton: true
                                                    });
                                                } else {
                                                    toastr.error("Carga no completada. 0X0000CEA");

                                                }
                                            }, function (error) {
                                                toastr.error(error);
                                            });
                                        }
                                    }

                                    $scope.viewFileTemp = function (row) {
                                        var typeFile = row.url.split(".");
                                        if (typeFile[1] == 'PDF' || typeFile[1] == 'pdf') {
                                            var urlAnexo;
                                            urlAnexo = row.url.replace(/\//g, "$");
                                            urlAnexo = urlAnexo.replace(/ /, "%20");
                                            urlAnexo = appSettings.restApiServiceBaseUri + 'download/filetemp/' + urlAnexo;
                                            //$scope.sesion.path2=encodeURIComponent(urlReporteAgenda)
                                            $scope.path2 = "";
                                            $scope.path2 = encodeURIComponent(urlAnexo);
                                            urlAnexo = './web/viewer.html?file=' + $scope.path2;

                                            $scope.trustSrc = function (src) {
                                                return $sce.trustAsResourceUrl(src);
                                            }
                                            $scope.iframe = { src: urlAnexo };
                                            ngDialog.open({
                                                template: 'app/caso/anexo.tpl.html',
                                                className: 'ngdialog-theme-flat',
                                                closeByDocument: true,
                                                closeByEscape: true,
                                                width: '100%',
                                                height: '100%',
                                                scope: $scope
                                            });
                                        } else {
                                            var data = {
                                                imgBase: row.url
                                            }

                                            casoService.getImg(data).then(function (response) {
                                                $scope.imgSrc = response.dataA.imgBase;
                                                ngDialog.open({
                                                    template: 'app/caso/anexoImg.tpl.html',
                                                    className: 'ngdialog-theme-flat',
                                                    closeByDocument: false,
                                                    closeByEscape: true,
                                                    scope: $scope
                                                });
                                            });
                                        }
                                    }

                                    $scope.quitarAnexo = function (row) {
                                        swal({
                                            title: "¿Está seguro que desea eliminar el anexo?",
                                            text: "",
                                            showCancelButton: true,
                                            confirmButtonClass: "btn-success",
                                            confirmButtonText: "Confirmar",
                                            cancelButtonClass: "btn-danger",
                                            cancelButtonText: "Cancelar",
                                            closeOnConfirm: true
                                        },
                                            function () {
                                                var index = $scope.expediente.pgfAnexos.indexOf(row);
                                                $scope.expediente.pgfAnexos.splice(index, 1);
                                                $scope.gridOptionsAnexos.data = $scope.expediente.pgfAnexos;
                                            });
                                    }

                                    $scope.agregarInformacion = function(){
                                        if($scope.plantilla.noTelefono == "" || $scope.plantilla.noTelefono == undefined){
                                            toastr.warning("Debe de ingresar un número de telefóno valido.")
                                        }else{
                                          var adhesionTemp = {}
                                                
                                                        adhesionTemp.tipoPersona = $scope.plantilla.codigoPersonaAdhesion;
                                                        adhesionTemp.descPersona = $scope.plantilla.descripcionPersonaAdhesion;
                                                        adhesionTemp.idEmpresa = $scope.plantilla.codigoEmpresa;
                                                        adhesionTemp.nombreEmpresa = $scope.plantilla.nombreEmpresa;
                                                        adhesionTemp.tipoDocumento = $scope.plantilla.descripcionDocumento;
                                                        adhesionTemp.numeroTelefono = $scope.plantilla.noTelefono;
                                                        
                                                        adhesionTemp.idSolicitud = 0;
                                                                                                    
                                                        $scope.expediente.pgfAdhesiones.push(adhesionTemp);
                                                        $scope.gridOptionsAdhesion.data = [];
                                                        $scope.gridOptionsAdhesion.data = $scope.expediente.pgfAdhesiones;                                                        
                                                        $scope.plantilla.noTelefono = null;
                                        }
                                    }
                                    $scope.reg = function () {
                                        $scope.expediente.correlativo = 0,
                                            $scope.expediente.idSolicitud = 0,
                                            $scope.expediente.idtipoCaso = moneda.data[1].idTipoCaso,
                                            $scope.expediente.idmoneda = moneda.data[0].idMoneda,
                                            $scope.expediente.nombreCaso = $scope.plantilla.ben.toUpperCase(),
                                            $scope.expediente.nombreDepositante = $scope.plantilla.dep.toUpperCase(),
                                            $scope.expediente.numeroJuicio = $scope.plantilla.nojuicio,
                                            $scope.expediente.cuotaMensual = $scope.plantilla.cuota,
                                            $scope.expediente.usuarioCrea = $scope.loginData.usuario,
                                            $scope.expediente.iddependencia = $scope.plantilla.codigoDependencia,
                                            $scope.expediente.observacion = $scope.plantilla.observacion,
                                            $scope.expediente.rhDependencia = $scope.consulta.codigoDependencia,
                                            $scope.expediente.sede = $scope.consulta.sede,
                                            $scope.expediente.gafete = $scope.consulta.gafete,
                                            $scope.expediente.correo = $scope.loginData.correo,
                                            $scope.expediente.pgfAdhesiones = $scope.expediente.pgfAdhesiones,
                                            $scope.expediente.pgfAnexos = $scope.expediente.pgfAnexos 

                                            casoService.add($scope.expediente).then(function (response) {
                                                if (response.status == "OK") {
                                                    toastr.success("Pre apertura de Caso registrada exitosamente!.")
                                                    $state.go('index.caso.lista');
                                                    $scope.expediente = null;
                                                } else {
                                                    toastr.warning("Ocurrio un problema para el registro de la Preapertura de Caso.")
                                                }
                                            }, function (error) {
                                                toastr.error("Problema con el servicio de registro. 0x000RCPA1")
                                            })
                                    }


                                }
                            ]
                        }
                    }

                })
        }
    ])