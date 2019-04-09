angular.module('app.proceso', [
    'ui.router',
    'toastr'
])
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $stateProvider

                    .state('index.proceso', {

                        abstract: true,

                        url: 'proceso',

                        params: {

                        },

                        views: {
                            '': {
                                templateUrl: 'app/proceso/proceso.tpl.html',
                                resolve: {

                                },
                                controller: ['$scope', '$state', 'toastr',
                                    function ($scope, $state, toastr) {
                                        $scope.bandera = { valor: null }


                                    }]
                            }
                        }

                    })

                    .state('index.proceso.caso', {

                        url: '/lista-proceso',

                        params: {

                        },
                        views: {
                            '': {
                                templateUrl: 'app/proceso/bandeja.lista.tpl.html',
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
                                },
                                controller: ['$scope', '$state', '$sce', 'toastr', 'ngDialog', 'moneda', 'dependencia', 'persona', 'documento', 'casoService', 'authService', '$filter','procesoService',
                                    function ($scope, $state, $sce, toastr, ngDialog, moneda, dependencia, persona, documento, casoService, authService, $filter,procesoService) {
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

                                        $scope.bandejaEdicion = angular.copy($scope.gridOptionsBandeja);
                                        $scope.bandejaEdicion.enableFiltering = true;
                                        $scope.bandejaEdicion.columnDefs = [
                                            { name: "correlativo", displayName: "# Correlativo", width: "7%" },
                                            { name: "anio", displayName: "Año", width: "4%" },
                                            { name: "nombreCaso", displayName: "Nombre Beneficiario", width: "12%" },
                                            { name: "nombreDepositante", displayName: "Nombre Depositante", width: "12%" },
                                            { name: "numeroJuicio", displayName: "# de Juicio", width: "12%" },
                                            { name: "usuarioCrea", displayName: "Usuario Crea", width: "7%" },
                                            { name: "fechaCrea", displayName: "Fecha creación", width: "11%", cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },
                                            { name: "usuarioModifica", displayName: "Usuario Modifica", width: "7%" },
                                            { name: "fechaModifica", displayName: "Fecha modificación", width: "11%", cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },
                                            { name: "estado", displayName: "Estado", width: "9%", enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents text-center">{{grid.appScope.etiquetaEstado(row.entity.estado)}}</div>' },
                                            {
                                                name: 'OPCIÓN', enableFiltering: false, width: "8%",
                                                cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span>'
                                                    //+ '<button type="button" class="btn btn-info btn-sm" ng-click="grid.appScope.opcionVer(row.entity)" title="Ver" ng-show={{grid.appScope.validaEstadoOp1(row.entity.estado)}} ><i class="fa fa-search fa-2x"></i></button>'
                                                    + '<button type="button" class="btn btn-primary btn-sm" ng-click="grid.appScope.opcionVer(row.entity)" title="Ver" ><i class="fa fa-eye fa-2x"></i></button>'
                                                    //+ '<button type="button" class="btn btn-primary btn-sm" ng-click="grid.appScope.opcionVer(row.entity)" title="Editar" ng-show={{grid.appScope.validaEstadoOp2(row.entity.estado)}}><i class="fa fa-edit fa-2x"></i></button>&#160'

                                            }
                                        ];

                                        //$scope.getsolicitudes.onRegisterApi = function(gridApi){$scope.gridApi = gridApi};
                                        function lista() {
                                            casoService.getInfoEmpleado($scope.loginData.codigoEmpleado).then(function (response) {

                                                if (response.status === "error") {
                                                    //toastr.warning("Gafete");
                                                    $scope.gblDependencia = "null";
                                                    $scope.paraNotificacion = 1;
                                                    $scope.consulta.codigoDependencia = 5555;
                                                    $scope.consulta.gafete = $scope.loginData.codigoEmpleado;
                                                    $scope.consulta.sede = 'GT';
                                                    $scope.consulta.nombreDependencia = 'CIT PRUEBAS';
                                                    //toastr.info($scope.consulta.codigoDependencia)
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
                                                        //toastr.info($scope.consulta.codigoDependencia)
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
                                            }
                                            return mensaje;
                                        }
                                        $scope.validaEstadoOp2 = function (valor) {
                                            var mensaje = false;
                                            if (valor == 1) {
                                                mensaje = false;//mensaje = 'FORMULARIO CREADO'
                                            } else if (valor == 2) {
                                                mensaje = true;
                                                //mensaje = 'PENDIENTE DE MODIFICACIÓN'
                                            }
                                            return mensaje;
                                        }
                                        $scope.gridOptionsAnexos = angular.copy($scope.gridOptionsSelection);
                                        $scope.gridOptionsAnexos.columnDefs = [
                                            //{ name: 'tipoPersona', displayName: "Tipo Persona" },
                                            { name: 'descTipoPersona', displayName: "Descripción Persona", enableCellEdit: false },
                                            //{ name: 'idTipoDocumento', displayName: "Documento" },
                                            { name: 'descIdTipoDoc', displayName: "Tipo Documento", enableCellEdit: false },
                                            { name: 'documento', displayName: "# Documento", enableCellEdit: false },
                                            { name: 'descripcion', displayName: "Archivo", enableCellEdit: false },
                                            {
                                                name: 'Opción', enableFiltering: false,
                                                cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span><button type="button" class="btn btn-primary btn-block" ng-click="grid.appScope.viewFileTemp(row.entity)" title="Ver anexo">VER</button></span></div>',
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
                                        

                                        $scope.gblExpediente = {};
                                        $scope.opcionVer = function (row) {
                                            //si es igual a 1 y el permiso es de operador, consulta
                                            //si es igual a 1 y el permiso es de juez, validar
                                            //si es igual a 2 y el permiso es de operador, editar
                                            //si es igual a 3 y el permiso es de financiero {sede}, autorizar
                                            //si es igual a 4 para todos los permisos, autorizado
                                            if (row.estado == 1) {
                                                $scope.param.condicion = 1;
                                            } else if (row.estado == 3) {
                                                $scope.param.condicion = 3;
                                            } else {
                                                $scope.param.condicon = 0;
                                            }

                                            $scope.plantilla.seleccion = row.correlativo;
                                            casoService.getConsultaCreado(row.correlativo, $scope.consulta.codigoDependencia).then(function (response) {
                                                $scope.bandera.valor = 0;

                                                ngDialog.open({
                                                    template: 'app/proceso/consulta-proceso.tpl.html',
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
                                                //$scope.expedienteAnexoTemp = $scope.clonarArray($scope.gblExpediente[0].pgfAnexos);
                                                if (!response.data[0].pgfAnexos) {
                                                    response.data[0].pgfAnexos = [];
                                                    $scope.gridOptionsAnexos.data = response.data[0].pgfAnexos;
                                                } else {
                                                    $scope.gridOptionsAnexos.data = response.data[0].pgfAnexos;
                                                }
                                            });
                                        }


                                        $scope.hoy = function () {
                                            var dt = new Date();
                                            dt.setHours(dt.getHours() + 1);
                                            dt.setMinutes(0);
                                            return dt;
                                        };
                                    
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

                                       
                                       //upd unicamente estado
                                      
                                        $scope.tramite = function () {
                                            $scope.gblExpediente[0].rhNombreSolicita =  $scope.consulta.nombreDependencia;
                                            $scope.gblExpediente[0].rhSolicitud =  $scope.consulta.codigoDependencia;
                                            $scope.gblExpediente[0].gafete = $scope.loginData.codigoEmpleado;
                                            $scope.gblExpediente[0].correo = $scope.loginData.correo;
                                            $scope.gblExpediente[0].correlativo = $scope.plantilla.seleccion;                                                                                          
                                            $scope.gblExpediente[0].usuarioModifica = $scope.loginData.usuario;
                                            procesoService.update($scope.gblExpediente[0]).then(function (response) {                                                
                                                
                                                //validacion *
                                                ngDialog.close();
                                                toastr.success("*Actualización realizada.");
                                                $state.go("index.proceso.caso");
                                                lista();
                                            });                                                                     
                                        }
                                        
                                        $scope.modificacion = function(){                                            
                                            $scope.plantilla.valor = true;
                                        }
                                        $scope.enviarModificacion = function(){  
                                            
                                            if ($scope.plantilla.modificar == "" || $scope.plantilla.modificar == null){
                                                toastr.warning("Es necesario ingresar el motivo de la modificación.");
                                            }else{
                                                $scope.gblExpediente[0].rhNombreSolicita =  $scope.consulta.nombreDependencia;
                                                $scope.gblExpediente[0].rhSolicitud =  $scope.consulta.codigoDependencia;
                                                $scope.gblExpediente[0].gafete = $scope.loginData.codigoEmpleado;
                                                $scope.gblExpediente[0].correo = $scope.loginData.correo;
                                                $scope.gblExpediente[0].correlativo = $scope.plantilla.seleccion;
                                                $scope.gblExpediente[0].obsModificacion = $scope.plantilla.modificar;                                                
                                                procesoService.modificar($scope.gblExpediente[0]).then(function (response) {                                                
                                                    //lista();
                                                    ngDialog.close();
                                                    toastr.success("*Modificación enviada correctamente.");
                                                    $state.go("index.proceso.caso");        
                                                    lista();
                                                });
                                                
                                            }
                                            
                                            //upd estado
                                            //set modificacion
                                        }
                                        $scope.cancelarModificacion = function(){
                                            $scope.plantilla.modificar= null;                                            
                                            $scope.plantilla.valor = false;
                                        }
                                    }
                                ]
                            }
                        }

                    })
            }

        ]
    )



