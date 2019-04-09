angular.module('app.alerta', [
  'ui.router',
  'toastr',
  'app.alertaService',
  'app.entidadService'
])

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.alerta', {

          abstract: true,

          url: 'alerta',

          params: {

          },

          views: {
            '': {
              templateUrl: 'app/alerta/alerta.tpl.html',
              resolve: {

              },
              controller: ['$scope', '$state', 'toastr',
                function (  $scope,   $state,   toastr) {

                  $scope.alerta={

                    idAlerta: null,
                     frEntidad:{
                        idEntidad: null
                     },
                    descripcion: null,
                    valor: null,
                    estado: 1
                    }

                }]

            }
          }

        })


        .state( 'index.alerta.list', {

          url: '',

          views: {
            '': {
              templateUrl: 'app/alerta/alerta.list.tpl.html',
              resolve: {
                alerta: ['alertaService',
                  function( alertaService){
                    return alertaService.list();

                  }],
              },
              controller: ['$scope', '$state', 'toastr', 'alerta', 'alertaService',
                function (  $scope,   $state,   toastr,   alerta, alertaService) {

                  $scope.gridOptionsalerta = angular.copy( $scope.gridOptions );
                  $scope.gridOptionsalerta.enableFiltering = true;
                  $scope.gridOptionsalerta.columnDefs = [
                    { name: 'idAlerta', displayName: "No.", width: "5%", enableFiltering: false},
                    { name: 'frEntidad.nombre', displayName: "Descripción Entidad", enableFiltering: true},
                    { name: 'valor', displayName: "Valor", enableFiltering: true},
                    { name: 'descripcion', displayName: "Descripción", enableFiltering: true},
                    { name: 'estado', displayName: "Estado", field: 'estado', width: "6%", enableFiltering:false, cellTemplate:'<div class="ui-grid-cell-contents text-center">{{grid.appScope.etiquetaEstado(row.entity.estado)}}</div>'},
                    { name: 'OPCIONES', enableFiltering: false, width: "10%",
                      cellTemplate: '<div class="ui-grid-cell-contents text-center col-options"><span><button type="button" class="btn btn-primary btn-xs" ng-click="grid.appScope.edit(row.entity)" title="Editar"><i class="fa fa-edit"></i></button> <button type="button" class="btn btn-danger btn-xs" ng-click="grid.appScope.delete(row.entity)" title="Eliminar"><i class="fa fa-remove"></i></button></span></div>' },
                  ];

                  $scope.etiquetaEstado = function(valor){
                    var mensaje = null;
                     if (valor == 1){
                        mensaje = 'Activo';
                     }else{
                       mensaje = 'Inactivo';
                     }
                     return mensaje;
                  }


                  $scope.gridOptionsalerta.data = alerta.data;

                  $scope.edit = function( row ) {
                  $state.go("index.alerta.edit", { id: row.idAlerta })
                  }

                  $scope.delete = function ( row ) {
                    swal({
                      title: "¿Está seguro que desea eliminar?",
                      text: "",
                      showCancelButton: true,
                      confirmButtonClass: "btn-success",
                      confirmButtonText: "Confirmar",
                      cancelButtonClass: "btn-danger",
                      cancelButtonText: "Cancelar",
                      closeOnConfirm: true,
                    },
                    function () {
                      alertaService.delete( row.idAlerta ).then( function ( response ) {
                        if (response.status == 'OK') {
                          /*var index = $scope.gridOptionsalerta.data.indexOf( row );
                          $scope.gridOptionsalerta.data.splice(index, 1);*/
                          toastr.success( response.message );
                          alertaService.list().then( function ( response ) {
                            if (response.status == 'OK') {
                                $scope.gridOptionsalerta.data = response.data;
                            }
                          });
                        } else {
                          toastr.error( response.message );
                        }
                      }, function ( error ) {
                        toastr.error( error );
                      });
                    });
                  }

                }]
            }
          }
        })
        .state( 'index.alerta.add', {

          url: '/add',

          views: {
            '': {
              templateUrl: 'app/alerta/alerta.add.tpl.html',
              resolve: {
                dataEstado: ['alertaService',
                  function( alertaService){
                    dataalerta = alertaService.listEstado();
                    return dataalerta;
                  }],

                  dataEntidad: ['entidadService',
                    function( entidadService){
                      dataentidad = entidadService.list();
                      return dataentidad;
                    }]
              },
              controller: ['$scope', '$state', 'toastr', 'alertaService', 'dataEstado', 'dataEntidad',
                function (  $scope,   $state,   toastr,   alertaService, dataEstado, dataEntidad) {
                  $scope.dataEstado = dataEstado.data;
                  $scope.dataEntidad = dataEntidad.data;
                  $scope.alerta = { estado : 1};
                  $scope.submitForm = function ( isValid ) {
                    if ( isValid ) {
                      $scope.alerta.usuarioCrea = $scope.loginData.codigoEmpleado;
                      alertaService.add( $scope.alerta ).then( function ( response ) {
                        if (response.status == 'OK') {
                          toastr.success( response.message );
                          $state.go('^.list');
                        } else {
                          toastr.error( response.message );
                        }
                      }, function ( error ) {
                        toastr.error( error );
                      });
                    }
                  }


                }]
            }
          }


        })
        .state( 'index.alerta.edit', {

          url: '/:id/edit',

          views: {
            '': {
              templateUrl: 'app/alerta/alerta.add.tpl.html',
              resolve: {

                alerta: ['alertaService', '$stateParams',
                  function( alertaService, $stateParams){
                    dataalerta = alertaService.get( $stateParams.id );
                    return dataalerta;
                  }],

                dataEstado: ['alertaService',
                  function( alertaService){
                    dataalerta = alertaService.listEstado();
                    return dataalerta;
                  }],

                  dataEntidad: ['entidadService',
                    function( entidadService){
                      dataentidad = entidadService.list();
                      return dataentidad;
                    }]
              },
              controller: ['$scope', '$state', 'toastr', 'alertaService', 'alerta', 'dataEstado','dataEntidad',
                function (  $scope,   $state,   toastr,   alertaService,   alerta, dataEstado, dataEntidad) {

                  $scope.alerta = alerta.data[0];
                  $scope.dataEstado = dataEstado.data;
                  $scope.dataEntidad = dataEntidad.data;

                  $scope.submitForm = function ( isValid ) {
                    if ( isValid ) {
                      $scope.alerta.usuarioModifica = $scope.loginData.codigoEmpleado;
                      alertaService.update( $scope.alerta ).then( function ( response ) {
                        if (response.status == 'OK') {
                          toastr.success( response.message );
                          $state.go('^.list');
                        } else {
                          toastr.error( response.message );
                        }
                      }, function ( error ) {
                        toastr.error( error );
                      });
                    }
                  }

                }]
            }
          }
        })
    }
  ]
);
