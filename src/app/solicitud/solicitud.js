angular.module('app.solicitud', [
    'ui.router',
    'toastr',
    'ui.grid.autoResize',
    'app.solicitudService'
])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('index.solicitud', {
                    url: 'solicitudes-nuevas',
                    params: {

                    },
                    views: {
                        '': {
                            templateUrl: 'app/solicitud/solicitud.tpl.html',
                            /*resolve: {      
                            historia : ['solicitudService','authService',
                            function (solicitudService){
                                var addDays = function(date, days) {
                                    var result = new Date(date);
                                    result.setDate(result.getDate() + days);
                                    return result;
                                  }
                
                
                                  var now = new Date();
                                  var begin = addDays(now, -7);
                                  var filtro = {
                                    id : 0,
                                    fechaIni : begin,
                                    fechaFin : now,
                                    texto : null,
                                    usuarioId : 0,
                                    sede: $scope.gblNotificacion.sede
                                  }
                                }]
                            }*/
                            controller: ['$scope', '$state', 'toastr', 'authService', 'solicitudService', 'ngDialog',
                                function ($scope, $state, toastr, authService, solicitudService, ngDialog) {

                                    $scope.arregloNotificaciones = [7, 8, 9, 10, 11, 12, 13, 14];

                                    listaContactos = function (depto) {

                                        for (var i = 0; i < $scope.arregloNotificaciones.length; i++) {
                                            //console.log(depto,' - ',$scope.arregloNotificaciones[i])
                                            if (depto == $scope.arregloNotificaciones[i]) {
                                                $scope.sedeParaNotificacion = 'QZ';
                                                break;
                                            } else {
                                                $scope.sedeParaNotificacion = 'GT';
                                            }
                                        }
                                    }

                                    authService.getInfoEmpleado($scope.loginData.codigoEmpleado).then(function (response) {

                                        if (response.status === "error") {
                                            toastr.error("Usuario no registrado.");
                                            $scope.gblDependencia = "null";
                                            $scope.paraNotificacion = 1;
                                        }
                                        if (response.data.length > 0) {
                                            $scope.gblDependencia = response.data[0].dependenciaFuncionesDesc;
                                            $scope.paraNotificacion = response.data[0].departamentoId;
                                            listaContactos($scope.paraNotificacion);
                                        } else {
                                            toastr.info("Ocurrio un problema para consultar la dependencia de origen, del usuario en sesión.");
                                            $scope.gblDependencia = "null";
                                        }
                                    });

                                    $scope.motivos = {
                                    }
                                    $scope.c = {}

                                    var addDays = function (date, days) {
                                        var result = new Date(date);
                                        result.setDate(result.getDate() + days);
                                        return result;
                                    }
                                    var now = new Date();
                                    var begin = addDays(now, -7);
                                    $scope.calendar = {
                                        id: 0,
                                        fechaIni: begin,
                                        fechaFin: now
                                    }
                                    $scope.ini = new Date($scope.calendar.fechaIni);
                                    $scope.fin = new Date($scope.calendar.fechaFin);

                                    var filtro = {
                                        id: 0,
                                        fechaIni: $scope.ini,
                                        fechaFin: $scope.fin,
                                        texto: null,
                                        usuarioId: 0,
                                        sede: $scope.gblNotificacion.sede
                                    }


                                    retri = function () {

                                        solicitudService.lista(filtro).then(function (response) {
                                            if (response.data) {
                                                $scope.getsolicitudes.data = response.data;
                                            }
                                        });
                                    }


                                    retri();

                                    $scope.filtrarFecha = function () {
                                        $scope.ini = new Date($scope.calendar.fechaIni);
                                        $scope.fin = new Date($scope.calendar.fechaFin);

                                        var filtro = {
                                            id: 0,
                                            fechaIni: $scope.ini,
                                            fechaFin: $scope.fin,
                                            texto: null,
                                            usuarioId: 0,
                                            sede: $scope.sedeParaNotificacion
                                        }
                                        solicitudService.lista(filtro).then(function (response) {
                                            if (response.data) {
                                                $scope.getsolicitudes.data = response.data;
                                            }
                                        });
                                    }

                                    //$scope.solicitudes = dataSolicitud.data;
                                    $scope.paanio = null;
                                    $scope.parecibo = null;
                                    $scope.pabanco = null;
                                    $scope.patransaccion = null;
                                    $scope.patipoTransaccion = null;
                                    $scope.pafecha = null;
                                    $scope.pamonto = null;
                                    $scope.pamontoImp = null;
                                    $scope.pausuario = null;
                                    $scope.panombreUsuario = null;

                                    $scope.checked = null;
                                    $scope.getsolicitudes = null;
                                    $scope.getsolicitudes = angular.copy($scope.gridOptions);
                                    $scope.getsolicitudes.enableFiltering = true;
                                    //$scope.getsolicitudes.onRegisterApi = function(gridApi){$scope.gridApi = gridApi};

                                    $scope.getsolicitudes.columnDefs = [
                                        { name: "idSolicitud", displayName: "No. de Solicitud", width: "8%" },
                                        { name: "fechaSolicita", displayName: "Fecha Solicitud", width: "8%", cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },
                                        { name: "usuarioSolicitaAbr", displayName: "Usuario", width: "8%" },
                                        { name: "usuarioSolicita", displayName: "Usuario Solicita", width: "10%" },
                                        { name: "dependenciaSolicita", displayName: "Dependencia Solicita", width: "18%" },
                                        { name: "razonSolicitud", displayName: "Jutificacion Solicitud", width: "15%" },
                                        { name: "anioRecibo", displayName: "Año de Recibo", width: "12%" },
                                        { name: "recibo", displayName: "Número de Recibo", width: "12%" },
                                        {
                                            name: 'OPCIONES', enableFiltering: false, width: "8%",
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span>'
                                                + '<button type="button" class="btn btn-primary btn-sm" ng-click="grid.appScope.opcion(row.entity)" title="Opciones"><i class="fa fa-search fa-2x"></i></button>&#160'
                                            //+ '<button type="button" class="btn btn-success btn-sm" ng-click="grid.appScope.opcion2(row.entity)" title="Opciones"><i class="fa fa-flag fa-2x"></i></button>'                                                
                                        }
                                    ];
                                    $scope.getsolicitudes.data = $scope.solicitudes;
                                    function borrado() {
                                        $scope.paanio = null;
                                        $scope.parecibo = null;
                                        $scope.pabanco = null;
                                        $scope.patransaccion = null;
                                        $scope.patipoTransaccion = null;
                                        $scope.pafecha = null;
                                        $scope.pamonto = null;
                                        $scope.pamontoImp = null;
                                        $scope.pausuario = null;
                                        $scope.panombreUsuario = null;
                                        $scope.noSolicitud = null;
                                        $scope.copyUser = null;
                                        $scope.copyMotivo = null;
                                        $scope.copyDependencia = null;
                                        $scope.delRechazo = null;
                                        $scope.motivoRechazo = null;
                                    }



                                    $scope.opcion = function (row) {
                                        solicitudService.cantidad(row.recibo, row.anioRecibo).then(function (res) {
                                            if (res.status == 'OK') {
                                                $scope.c.cantSolNuevas = res.data[0].cantSolicitudes;
                                                $scope.c.cantSolAtendidas = res.data[0].cantSolatendidas;
                                                $scope.c.cantSolRechazadas = res.data[0].cantSolr;
                                                $scope.c.cantSolTotal = res.data[0].cantTotalsol;
                                            }

                                        }, function (error) {
                                            toastr.error("Fallo de comunicación del servicio. Sx0001C")
                                        })



                                        $scope.destinatario = row.correoUsuariosolicita;
                                        $scope.regFechaSolicitudParse = row.fechaSolicita;
                                        var d = moment(new Date($scope.regFechaSolicitudParse)).format("DD-MM-YYYY hh:mm a")
                                        $scope.regFechaSolicitud = d;
                                        $scope.desNoRecibo = row.recibo;
                                        $scope.desAnioRecibo = row.anioRecibo;
                                        $scope.copyipSolicita = row.ipSolicita;
                                        $scope.copyEstadoSolicita = row.estadoSolicia;
                                        $scope.copyFechaSolicita = row.fechaSolicita;
                                        $scope.copyCodigoEmpleado = row.codigoEmpleado;
                                        $scope.copyCorreoSolicitante = row.correoUsuariosolicita;

                                        borrado();

                                        solicitudService.verifica(row.anioRecibo, row.recibo).then(function (response) {

                                            if (response.data.length > 0) {
                                                if (response.data[0].reversionAplicada == 'S') {
                                                    toastr.warning("ESTE RECIBO FUE ANULADO. REPORTE EL INTENTO DE IMPRESIÓN.");
                                                    //desactivar boton autorizacion
                                                    $scope.checked = 1;
                                                }
                                                if (response.data[0].impecsaldo == 0) {
                                                    //desactivar boton autorizacion
                                                    toastr.info("ESTE RECIBO NO HA SIDO INTENTADO IMPRIMIR.");
                                                    $scope.checked = 1;
                                                }
                                                if (response.data[0].reversionAplicada != 'S' && response.data[0].impecsaldo == 0) {
                                                    //pa = para aprobar
                                                    $scope.paanio = row.anioRecibo;
                                                    $scope.parecibo = row.recibo;
                                                    $scope.pabanco = response.data[0].identidad;
                                                    $scope.patransaccion = response.data[0].idtransaccion;
                                                    $scope.patipoTransaccion = response.data[0].descripcionTransaccion;
                                                    $scope.pafecha = response.data[0].fechaHoraTransaccion;
                                                    $scope.pamonto = response.data[0].monto;
                                                    $scope.pamontoImp = response.data[0].impecsaldo;
                                                    $scope.pausuario = row.usuarioSolicitaAbr;
                                                    $scope.panombreUsuario = row.usuarioSolicita;
                                                    $scope.noSolicitud = row.idSolicitud;
                                                    $scope.copyUser = $scope.panombreUsuario;
                                                    $scope.copyMotivo = row.razonSolicitud;
                                                    $scope.copyDependencia = row.dependenciaSolicita;
                                                    $scope.checked = 1;
                                                    //activar boton autorizacion

                                                }
                                                if (response.data[0].reversionAplicada != 'S' && response.data[0].impecsaldo > 24) {
                                                    //pa = para aprobar
                                                    $scope.paanio = row.anioRecibo;
                                                    $scope.parecibo = row.recibo;
                                                    $scope.pabanco = response.data[0].identidad;
                                                    $scope.patransaccion = response.data[0].idtransaccion;
                                                    $scope.patipoTransaccion = response.data[0].descripcionTransaccion;
                                                    $scope.pafecha = response.data[0].fechaHoraTransaccion;
                                                    $scope.pamonto = response.data[0].monto;
                                                    $scope.pamontoImp = response.data[0].impecsaldo;
                                                    $scope.pausuario = row.usuarioSolicitaAbr;
                                                    $scope.panombreUsuario = row.usuarioSolicita;
                                                    $scope.noSolicitud = row.idSolicitud;
                                                    $scope.copyUser = $scope.panombreUsuario;
                                                    $scope.copyMotivo = row.razonSolicitud;
                                                    $scope.copyDependencia = row.dependenciaSolicita;
                                                    $scope.checked = null;
                                                    //activar boton autorizacion

                                                }

                                            } else {
                                                $scope.checked = 1;
                                                $scope.paanio = row.anioRecibo;
                                                $scope.parecibo = row.recibo;
                                                //$scope.pabanco = response.data[0].identidad;
                                                //$scope.patransaccion = response.data[0].idtransaccion;
                                                //$scope.patipoTransaccion = response.data[0].descripcionTransaccion;
                                                //$scope.pafecha = response.data[0].fechaHoraTransaccion;
                                                //$scope.pamonto = response.data[0].monto;
                                                //$scope.pamontoImp = response.data[0].impecsaldo;
                                                $scope.pausuario = row.usuarioSolicitaAbr;
                                                $scope.panombreUsuario = row.usuarioSolicita;
                                                $scope.noSolicitud = row.idSolicitud;
                                                $scope.copyUser = $scope.panombreUsuario;
                                                $scope.copyMotivo = row.razonSolicitud;
                                                $scope.copyDependencia = row.dependenciaSolicita;
                                                toastr.warning("Solicitud incorrecta. El número de Recibo no es valido en SDJ.")
                                            }
                                        }, function (error) {
                                            toastr.error("Error de conexión a base de datos");
                                        })


                                        ngDialog.open({
                                            template: 'app/solicitud/aprobar.tpl.html',
                                            closeByDocument: true,
                                            closeByEscape: true,
                                            width: '70%',
                                            height: 600,
                                            showClose: true,
                                            scope: $scope

                                        })
                                    }
                                    $scope.validar = function () {
                                        var data = {};
                                        data = {
                                            idSolicitud: $scope.noSolicitud,
                                            anioRecibo: $scope.paanio,
                                            recibo: $scope.parecibo,
                                            usuarioSolicitaAbr: $scope.pausuario,
                                            usuarioAtencion: $scope.loginData.usuario


                                        }
                                        var mensaje = {};
                                        mensaje = {
                                            mensaje: "Por este medio se informa que el número de solicitud:" + $scope.noSolicitud + ", realizada con fecha: " + $scope.regFechaSolicitud + " del Recibo número: " + $scope.desNoRecibo + ", del año: " + $scope.desAnioRecibo + " ha sido autorizado correctamente. No responder correo de alertasoj@oj.gob.gt.",
                                            asunto: "Autorización de la solicitud de reimpresión de recibo.",
                                            destinatario: $scope.destinatario
                                        }
                                        solicitudService.aprobar(data).then(function (response) {
                                            if (response.status == 'OK') {
                                                toastr.success("La autorización se realizo correctamente");
                                                solicitudService.sendMail(mensaje).then(function (response) {
                                                    if (response.status == 'OK') {
                                                        toastr.success("Notificación electronica enviada correctamente");
                                                    } else { toastr.warning("Fallo al enviar la notificación electrónica vía correo interno."); }
                                                }, function (error) {
                                                    toastr.error("Fallo de la notificación, servidor de correo. Sx0001NE");
                                                })

                                            } else {
                                                toastr.warning("La autorización no se realizo correctamente");
                                            }
                                        }, function (error) {
                                            toastr.error("Fallo de comunicación con el servicio.")
                                        })
                                        //alert('*');
                                        $scope.gridApi.core.refresh();

                                        //retri();
                                        ngDialog.close();

                                    }

                                    $scope.rechazar = function () {
                                        //$scope.motivoRechazo = null;   
                                        $scope.checked = 1;
                                        $scope.delRechazo = 1;

                                        //$scope.motivoRechazo = "si funciona";

                                    }

                                    $scope.cancelarRechazo = function () {
                                        $scope.checked = null;
                                        //$scope.motivoRechazo = null;
                                        $scope.delRechazo = 0;

                                    }


                                    $scope.procesaRechazo = function () {
                                        //toastr.error($scope.noSolicitud);   
                                        var data = {};
                                        data = {
                                            idSolicitud: $scope.noSolicitud,
                                            recibo: $scope.parecibo,
                                            anioRecibo: $scope.paanio,
                                            usuarioSolicita: $scope.panombreUsuario,
                                            dependenciaSolicita: $scope.copyDependencia,
                                            ipSolicita: $scope.copyipSolicita,
                                            fechaSolicita: $scope.copyFechaSolicita,
                                            estadoSolicita: $scope.copyEstadoSolicita,
                                            usuarioAtencion: $scope.loginData.usuarioNombre,
                                            dependenciaAtencion: $scope.gblDependencia,
                                            estadoAtencion: 1,
                                            estadoSolicita: 1,
                                            usuarioSolicitaAbr: $scope.pausuario,
                                            codigoEmpleado: $scope.copyCodigoEmpleado,
                                            razonSolicitud: $scope.copyMotivo,
                                            resRazonSolicitud: $scope.motivos.describeRechazo,
                                            correoUsuariosolicita: $scope.copyCorreoSolicitante,
                                            rechazado: 1

                                        }

                                        var mensaje = {};
                                        mensaje = {
                                            mensaje: "Por este medio se informa que el número de solicitud:" + $scope.noSolicitud + ", realizada con fecha: " + $scope.regFechaSolicitud + " para el número de Recibo: " + $scope.desNoRecibo + ", del año: " + $scope.desAnioRecibo + " ha sido rechazada: " + $scope.motivos.describeRechazo,
                                            asunto: "Autorización denegada de la solicitud de reimpresión de recibo.",
                                            destinatario: $scope.copyCorreoSolicitante
                                        }

                                        if ($scope.motivos.describeRechazo.length > 0) {
                                            solicitudService.update(data).then(function (response) {
                                                if (response.status == 'OK') {
                                                    toastr.success(response.message);
                                                    solicitudService.sendMail(mensaje).then(function (response) {
                                                        if (response.status == 'OK') {
                                                            toastr.success("Notificación electronica enviada correctamente");
                                                        } else { toastr.warning("Fallo al enviar la notificación electrónica vía correo interno."); }
                                                    }, function (error) {
                                                        toastr.error("Fallo de la notificación, servidor de correo. Sx0001NE");
                                                    })
                                                } else {
                                                    toastr.error(response.message);
                                                }
                                            }, function (error) {
                                                toastr.error(error);
                                            })


                                            //retri();
                                            retri();
                                            ngDialog.close();
                                            $scope.getsolicitudes.core.refresh();
                                            //$scope.gridApi.core.refresh();
                                            //$scope.gridApi.

                                        }


                                        if ($scope.motivos.describeRechazo.length <= 0) {
                                            toastr.info("Indicar descripción del rechazo.");
                                        }

                                    }

                                }]//end controlador

                        }
                    }
                })
                //end state
                .state('index.solicitud-historial', {
                    url: 'solicitudes-atendidas',
                    views: {
                        '': {
                            templateUrl: 'app/solicitud/solicitud-historial.tpl.html',
                            controller: ['$scope', '$state', 'toastr', 'authService', 'solicitudService', 'ngDialog',
                                function ($scope, $state, toastr, authService, solicitudService, ngDialog) {

                                    var addDays = function (date, days) {
                                        var result = new Date(date);
                                        result.setDate(result.getDate() + days);
                                        return result;
                                    }
                                    var now = new Date();
                                    var begin = addDays(now, -7);
                                    $scope.calendar = {
                                        id: 0,
                                        fechaIni: begin,
                                        fechaFin: now
                                    }

                                    $scope.ini = new Date($scope.calendar.fechaIni);
                                    $scope.fin = new Date($scope.calendar.fechaFin);

                                    var filtro = {
                                        id: 0,
                                        fechaIni: $scope.ini,
                                        fechaFin: $scope.fin,
                                        texto: null,
                                        usuarioId: 0
                                    }

                                    retri = function () {

                                        solicitudService.listaHistorial(filtro).then(function (response) {
                                            if (response.data) {
                                                $scope.getsolicitudesHistorial.data = response.data;
                                            }
                                        });
                                    }

                                    retri();

                                    $scope.filtrarFecha = function () {
                                        $scope.ini = new Date($scope.calendar.fechaIni);
                                        $scope.fin = new Date($scope.calendar.fechaFin);

                                        var filtro = {
                                            id: 0,
                                            fechaIni: $scope.ini,
                                            fechaFin: $scope.fin,
                                            texto: null,
                                            usuarioId: 0
                                        }
                                        solicitudService.listaHistorial(filtro).then(function (response) {
                                            if (response.data) {
                                                $scope.getsolicitudesHistorial.data = response.data;
                                            }
                                        });
                                    }
                                    //$scope.solicitudesHistorico = dataSolicitud.data;

                                    $scope.getsolicitudesHistorial = null;
                                    $scope.getsolicitudesHistorial = angular.copy($scope.gridOptions);
                                    $scope.getsolicitudesHistorial.enableFiltering = true;
                                    //$scope.getsolicitudes.onRegisterApi = function(gridApi){$scope.gridApi = gridApi};

                                    $scope.getsolicitudesHistorial.columnDefs = [
                                        { name: "idSolicitud", displayName: "No. de Solicitud", width: "6%" },
                                        { name: "fechaSolicita", displayName: "Fecha Solicitud", width: "8%", cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },
                                        //{name:"usuarioSolicitaAbr",displayName:"Usuario",width: "10%"},
                                        { name: "usuarioSolicita", displayName: "Usuario Solicita", width: "10%" },
                                        { name: "dependenciaSolicita", displayName: "Dependencia Solicita", width: "15%" },
                                        { name: "razonSolicitud", displayName: "Jutificacion Solicitud", width: "15%" },
                                        { name: "anioRecibo", displayName: "Año de Recibo", width: "8%" },
                                        { name: "recibo", displayName: "Número de Recibo", width: "5%" },
                                        { name: "fechaAtencion", displayName: "Fecha Atención", width: "8%", cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },
                                        { name: "usuarioAtencion", displayName: "Usuario Atención", width: "12%" },
                                        { name: "resRazonSolicitud", displayName: "Rechazo", width: "12%" },
                                        /*{ name: 'OPCIONES', enableFiltering: false, width: "8%",
                                      cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span>'
                                        + '<button type="button" class="btn btn-primary btn-sm" ng-click="grid.appScope.opcion(row.entity)" title="Opciones"><i class="fa fa-search fa-2x"></i></button>'                                                
                                        }*/
                                    ];
                                    $scope.getsolicitudesHistorial.data = $scope.solicitudesHistorico;

                                }]

                        }
                    }
                })

                .state('index.solicitud-caso', {

                    url: '/lista-proceso',

                    params: {

                    },
                    views: {
                        '': {
                            templateUrl: 'app/solicitud/bandeja.lista.tpl.html',
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
                            controller: ['$scope', '$state', '$sce', 'toastr', 'ngDialog', 'moneda', 'dependencia', 'persona', 'documento', 'casoService', 'authService', '$filter','solicitudService','procesoService',
                                function ($scope, $state, $sce, toastr, ngDialog, moneda, dependencia, persona, documento, casoService, authService, $filter,solicitudService,procesoService) {
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
                                        { name: "anio", displayName: "Año", width: "5%" },
                                        { name: "nombreCaso", displayName: "Nombre Beneficiario", width: "18%" },
                                        { name: "nombreDepositante", displayName: "Nombre Depositante", width: "18%" },
                                        { name: "numeroJuicio", displayName: "# de Juicio", width: "14%" },
                                        { name: "usuarioCrea", displayName: "Usuario Crea", width: "8%" },
                                        { name: "fechaCrea", displayName: "Fecha creación", width: "12%", cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },
                                        { name: "estado", displayName: "Estado", width: "8%", enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents text-center">{{grid.appScope.etiquetaEstado(row.entity.estado)}}</div>' },
                                        {
                                            name: 'OPCIÓN', enableFiltering: false, width: "10%",
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span>'
                                                //+ '<button type="button" class="btn btn-info btn-sm" ng-click="grid.appScope.opcionVer(row.entity)" title="Ver" ng-show={{grid.appScope.validaEstadoOp1(row.entity.estado)}} ><i class="fa fa-search fa-2x"></i></button>'
                                                + '<button type="button" class="btn btn-info btn-sm" ng-click="grid.appScope.opcionVer(row.entity)" title="Ver" ><i class="fa fa-search fa-2x"></i></button>'
                                                + '<button type="button" class="btn btn-primary btn-sm" ng-click="grid.appScope.opcionVer(row.entity)" title="Editar" ng-show={{grid.appScope.validaEstadoOp2(row.entity.estado)}}><i class="fa fa-edit fa-2x"></i></button>&#160'

                                        }
                                    ];

                                    $scope.bandejaApertura = angular.copy($scope.gridOptionsBandeja);
                                    $scope.bandejaApertura.enableFiltering = true;
                                    $scope.bandejaApertura.columnDefs = [
                                        { name: "idcaso", displayName: "# Correlativo", width: "7%" },
                                        { name: "anio", displayName: "Año", width: "5%" },
                                        { name: "nombreCaso", displayName: "Nombre Beneficiario", width: "18%" },
                                        { name: "nombreDepositante", displayName: "Nombre Depositante", width: "18%" },
                                        { name: "numeroJuicio", displayName: "# de Juicio", width: "14%" },
                                        { name: "usuarioModifica", displayName: "Usuario Crea", width: "8%" },
                                        { name: "fechaModifica", displayName: "Fecha creación", width: "12%", cellFilter: 'date:\'dd-MM-yyyy hh:mm a\'' },
                                        { name: "estado", displayName: "Estado", width: "8%", enableFiltering: false, cellTemplate: '<div class="ui-grid-cell-contents text-center">{{grid.appScope.etiquetaEstado(row.entity.estado)}}</div>' },
                                        {
                                            name: 'OPCIÓN', enableFiltering: false, width: "10%",
                                            cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span>'
                                                //+ '<button type="button" class="btn btn-info btn-sm" ng-click="grid.appScope.opcionVer(row.entity)" title="Ver" ng-show={{grid.appScope.validaEstadoOp1(row.entity.estado)}} ><i class="fa fa-search fa-2x"></i></button>'
                                                + '<button type="button" class="btn btn-info btn-sm" ng-click="grid.appScope.opcionVer(row.entity)" title="Ver" ><i class="fa fa-search fa-2x"></i></button>'
                                                + '<button type="button" class="btn btn-success btn-sm" ng-click="grid.appScope.impresionCaso(row.entity)" title="Constancia" ><i class="fa fa-print fa-2x"></i></button>'
                                                

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
                                                //enviar sede
                                                solicitudService.getSolicitudApertura().then(function (response) {
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
                                                    //casoService.getCreado($scope.consulta.codigoDependencia).then(function (response) {
                                                    solicitudService.getSolicitudApertura().then(function (response) {
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
                                    //reciba lista de aperturados
                                    solicitudService.getListaApertura().then(function(response){
                                        //validacion
                                        $scope.bandejaApertura.data = response.data;
                                    })
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
                                            //$scope.bandera.valor = 0;

                                            ngDialog.open({
                                                template: 'app/solicitud/consulta-proceso.tpl.html',
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
                                        //enviar datos del beneficiario - documentos para pkg
                                        for( var i = 0; i < $scope.gblExpediente[0].pgfAnexos.length; i++){
                                            if ($scope.gblExpediente[0].pgfAnexos[i].tipoPersona == 1){
                                                //console.log("Beneficiario encontrado");
                                                //$scope.gblExpediente[0].tempIdTipoPersona =$scope.gblExpediente[0].pgfAnexos[i].tipoPersona;
                                                $scope.gblExpediente[0].tempIdTipoDocumento = $scope.gblExpediente[0].pgfAnexos[i].idTipoDocumento;
                                                $scope.gblExpediente[0].tempNumeroDocumento = $scope.gblExpediente[0].pgfAnexos[i].documento;
                                                if ($scope.gblExpediente[0].tempNumeroDocumento == null || $scope.gblExpediente[0].tempNumeroDocumento == undefined){
                                                    $scope.plantilla.desactivar = 1;
                                                    toastr.warning("Información del beneficiario incompleta");
                                                    break;
                                                }else{
                                                    $scope.plantilla.desactivar = 0;    
                                                }
                                                $scope.plantilla.desactivar = 0;
                                            }else{
                                                console.log($scope.gblExpediente[0].tempIdTipoDocumento, $scope.gblExpediente[0].tempNumeroDocumento)
                                                toastr.warning("Información incompleta");
                                                $scope.plantilla.desactivar = 1;
                                            }
                                        }
                                        if ($scope.plantilla.desactivar >= 1){ 
                                            toastr.error("Información incompleta. No es posible aperturar el caso. *");
                                        }else{
                                            $scope.gblExpediente[0].correlativo = $scope.plantilla.seleccion;                                                                                          
                                            $scope.gblExpediente[0].usuarioModifica = $scope.loginData.usuario;
                                            solicitudService.updSolicitudApertura($scope.gblExpediente[0]).then(function (response) {                                                
                                                //lista();
                                                //ngDialog.close();
                                                console.log(response);
                                                //if(response.data.)
                                                toastr.success("El Caso ha sido creado.",response.id);
                                                $scope.plantilla.btn = 1;
                                                //$state.go("index.proceso.caso");
                                            });
                                            $scope.plantilla.desactivar = 0;
                                        }
                                                                                                      
                                    }
                                    
                                    $scope.impresionCaso = function(row){
                                        //generar pdf
                                        var docDefinition = {
                                            info: {
                                                title: 'Impresión',
                                                author: 'CIT, Organismo Judicial',
                                                subject: 'Consulta Caso',
                                                keywords: 'estado,caso'
                                            },
                                            watermark: { text: 'PORTAL DE GESTIÓN Y APOYO JUDICIAL EN MATERIA DE FAMILIA. USO INTERNO. ORGANISMO JUDICIAL', opacity: 0.2 },
                                            pageSize: 'LETTER',//cg cons pin
                                            pageOrientation: 'landscape',
                                            pageMargins: [75, 50, 50, 50],
                                            //pageMargins:[->,top,down,<-],

                                            header: function () {
                                                return {
                                                    columns: [
                                                        {

                                                        }
                                                    ]
                                                }
                                            },

                                            footer: function (currentPage, pageCount) {
                                                return {
                                                    stack: [{ canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595, y2: 5, lineWidth: 1, lineColor: '#000000', style: ['lineSpacing'] }] },
                                                    //{ text: 'Uso exclusivo de Recursos Humanos' + '\n'+'del Organismo Judicial', alignment: 'center',fontSize:'8' },
                                                    { text: '', margin: [50, 0, 0, 0] },
                                                    //
                                                    {margin: [50, 0, 0, 0],
                                                        columns: [
                                                            { text: 'Uso exclusivo del Organismo Judicial', alignment: 'center', fontSize: '8' },
                                                            {},
                                                            { text: "Página " + currentPage.toString() + ' de ' + pageCount, alignment: 'center', fontSize: '8' },
                                                            { text: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"), alignment: 'left', fontSize: '8', margin: [0, 0, 20, 0] }, { text: 'Usuario Imprime: ' + '\n' + $scope.loginData.usuario, fontSize: '9' }
                                                        ]
                                                    }]

                                                };
                                            },

                                            content: [
                                                {
                                                    image: 'data:image/jpg;base64,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',
                                                    width: 50,
                                                    height: 50,
                                                    margin: [40, 00, 00, 00],
                                                },
                                                { text: 'ORGANISMO JUDICIAL', alignment: 'center', fontSize: '14' },
                                                { text: 'SISTEMA DE DESCUENTOS JUDICIALES -SDJ-', alignment: 'center', fontSize: '13' },
                                                { text: 'CONSTANCIA DE CREACIÓN DE CASO DE PENSIÓN ALIMENTICIA', alignment: 'center', fontSize: '13' },
                                                { text: '\n', alignment: 'justify', fontSize: '10' },
                                                { text: 'Generado: ' + moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"), alignment: 'left', fontSize: '9' },
                                                { text: 'Usuario Imprime: ' + $scope.loginData.usuario, aligment: 'right', fontSize: '9' },
                                                //{text: "Página "+ currentPage.toString() + ' de ' + pageCount, alignment: 'left', fontSize:'8'},
                                                { text: '_____________________________________________________________________________________________', alignment: 'center', fontSize: '10' },
                                                { text: '\n', alignment: 'justify', fontSize: '10' },
                                                { text: '\n', alignment: 'justify', fontSize: '10' },
                                                { text: 'La unidad de Control Bancario de la Gerencia Financiera del Organismo Judicial extiende la siguiente constancia de apertura de caso de pensión alimenticia, para el uso que corresponda '
                                                + 'el siguiente número de caso: ' + row.idcaso + ' .', alignment: 'justify', fontSize: '10' },
                                                { text: '\n', alignment: 'justify', fontSize: '10' },
                                                { text: 'Se detalla la siguiente información:', alignment: 'justify', fontSize: '10' },
                                                { text: '\n', alignment: 'justify', fontSize: '10' },
                                                {
                                                    table: {
                                                        border: 0,
                                                        //headerRows: 1,
                                                        //heights: ['1%','1%','1%','1%','1%','1%','1%'],
                                                        widths: ['15%', '40%', '5%', '20%', '20%'],

                                                        body: [
                                                            [{ text: 'No. Caso:', bold: true, fontSize: '12' }, { text: row.idcaso, bold: true, fontSize: '12' }, { text: '' }, { text: '' }, { text: '' }],
                                                            [{ text: 'Depositante:', bold: true, fontSize: '10' }, { text: row.nombreDepositante, fontSize: '9' }, { text: '' }, { text: '', bold: true, fontSize: '11' }, { text: '', bold: true, fontSize: '11' }],
                                                            [{ text: 'Beneficiario:', bold: true, fontSize: '10' }, { text: row.nombreCaso, fontSize: '9' }, { text: '' }, { text: '', bold: true, fontSize: '10' }, { text: '', fontSize: '9', alignment: 'left' }],
                                                            //[{ text: 'Tipo Caso:', bold: true, fontSize: '10' }, { text: data[0].tsTipoCaso.nombreTipoCaso, fontSize: '9' }, { text: '' }, { text: 'Total de Egresos', bold: true, fontSize: '10' }, { text: data[0].tsCaso.idmoneda + ". " + data[0].tbsaldo.hab, fontSize: '9', alignment: 'left' }],
                                                            [{ text: 'Numero Juicio:', bold: true, fontSize: '10' }, { text: row.numeroJuicio, fontSize: '9' }, { text: '' }, { text: '', bold: true, fontSize: '10', align: 'left' }, { text: '', fontSize: '9', alignment: 'left' }],
                                                            //[{ text: 'Dependencia:', bold: true, fontSize: '10' }, { text: data[0].tbDependencia.nombreDependencia, fontSize: '9' }, { text: '' }, { text: '' }, { text: '' }],
                                                            [{ text: 'Fecha Apertura: ', bold: true, fontSize: '9' }, {
                                                                text:
                                                                    moment(new Date(row.fechaModifica)).format("DD-MM-YYYY"), fontSize: '9'
                                                            }, { text: '' }, { text: '' }, { text: '' }],
                                                        ]
                                                    },
                                                    layout: 'noBorders'
                                                },

                                                { text: '\n', alignment: 'justify', fontSize: '10' },
                                                
                                                
                                                { text: '\n', alignment: 'justify', fontSize: '10' },
                                                //{text :'Pase atentamente a: ' ,alignment: 'justify',fontSize:'10'},
                                                { text: '\n', alignment: 'justify', fontSize: '10' },
                                                { text: '\n', alignment: 'center', fontSize: '10' },
                                                { text: 'Firma y sello________________________________________________', alignment: 'center', fontSize: '10' },
                                                { text: '\n', alignment: 'justify', fontSize: '10' },
                                                { text: '\n', alignment: 'center', fontSize: '10' },
                                                { text: '-', alignment: 'center', fontSize: '10' }

                                            ]


                                        };//end docDefinition
                                        pdfMake.createPdf(docDefinition).print();
                                    }
                                    $scope.modificacion = function(){                                            
                                        $scope.plantilla.valor = true;
                                    }
                                    $scope.enviarModificacion = function(){
                                               if ($scope.plantilla.modificar == "" || $scope.plantilla.modificar == null){
                                                toastr.warning("Es necesario ingresar el motivo de la modificación.");
                                            }else{
                                                $scope.gblExpediente[0].rhNombreSolicita = $scope.consulta.nombreDependencia;
                                                $scope.gblExpediente[0].rhSolicitud =  $scope.consulta.codigoDependencia;
                                                $scope.gblExpediente[0].gafete = $scope.loginData.codigoEmpleado;
                                                $scope.gblExpediente[0].correo = $scope.loginData.correo;
                                                $scope.gblExpediente[0].correlativo = $scope.plantilla.seleccion;
                                                $scope.gblExpediente[0].obsModificacion = $scope.plantilla.modificar;                                                
                                                procesoService.modificar($scope.gblExpediente[0]).then(function (response) {                                                
                                                    
                                                    ngDialog.close();
                                                    toastr.success("*Modificación enviada correctamente.");
                                                    $state.go("index.solicitud-caso");
                                                    lista();
                                                });
                                            }       
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