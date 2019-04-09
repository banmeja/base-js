angular.module('app.usuario', [
  'ui.router',
  'toastr',
  'app.usuarioService',
  'app.tipousuarioService'
])

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        .state('index.usuario', {

          abstract: true,

          url: 'usuario',

          params: {

          },

          views: {
            '': {
              templateUrl: 'app/usuario/usuario.tpl.html',
              resolve: {
              },
              controller: ['$scope', '$state', 'toastr',
                function (  $scope,   $state,   toastr) {

                  $scope.usuario = {
                     idUsuario : 0,
                     codigoEmpleado: 0,
                     frTipoUsuario:{
                       idTipousuario: 0
                     },
                     estado: 1,
                     usuarioCrea: 0,
                     usuarioModifica: 0
                  }

                }]
            }
          }

        })


        .state( 'index.usuario.list', {

          url: '',

          views: {
            '': {
              templateUrl: 'app/usuario/usuario.list.tpl.html',
              resolve: {
                usuario: ['usuarioService',
                  function( usuarioService){
                    return usuarioService.list();

                  }],
              },
              controller: ['$scope', '$state', 'toastr', 'usuario', 'usuarioService',
                function (  $scope,   $state,   toastr,   usuario, usuarioService) {

                  $scope.gridOptionsusuario = angular.copy( $scope.gridOptions );
                  $scope.gridOptionsusuario.enableFiltering = true;
                  $scope.gridOptionsusuario.columnDefs = [

                    { name: 'idUsuario', displayName: "No.", width: "5%", enableFiltering: false},
                    { name: 'frTipoUsuario.descripcion', displayName: "Tipo Usuario", enableFiltering: true},
                    { name: 'codigoEmpleado', displayName: "Empleado", enableFiltering: true},
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


                  $scope.gridOptionsusuario.data = usuario.datos;

                  $scope.edit = function( row ) {
                  $state.go("index.usuario.edit", { id: row.idUsuario })
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
                      usuarioService.delete( row.idUsuario).then( function ( response ) {
                        if (response.status == 'OK') {
                          /*var index = $scope.gridOptionsusuario.data.indexOf( row );
                          $scope.gridOptionsusuario.data.splice(index, 1);*/
                          toastr.success( response.message );
                          usuarioService.list().then( function ( response ) {
                            if (response.status == 'OK') {
                                $scope.gridOptionsusuario.data = response.data;
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
        .state( 'index.usuario.add', {

          url: '/add',

          views: {
            '': {
              templateUrl: 'app/usuario/usuario.add.tpl.html',
              resolve: {
                dataEstado: ['usuarioService',
                  function( usuarioService){
                    dataestado = usuarioService.listEstado();
                    return dataestado;
                    }],

                dataTipoUsuario: ['tipousuarioService',
                  function( tipousuarioService){
                    datatipousuario = tipousuarioService.list();
                    return datatipousuario;
                    }]

              },
              controller: ['$scope', '$state', 'toastr', 'usuarioService', 'dataEstado', 'dataTipoUsuario',
                function (  $scope,   $state,   toastr,   usuarioService, dataEstado, dataTipoUsuario) {
                  $scope.dataEstado = dataEstado.data;
                  $scope.dataTipoUsuario = dataTipoUsuario.data;
                  $scope.submitForm = function ( isValid ) {
                    if ( isValid ) {
                      $scope.usuario.usuarioCrea = $scope.loginData.codigoEmpleado;
                      usuarioService.add($scope.usuario).then( function ( response ) {
                       console.log($scope.usuario);
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
        .state( 'index.usuario.edit', {

          url: '/:id/edit',

          views: {
            '': {
              templateUrl: 'app/usuario/usuario.add.tpl.html',
              resolve: {

                usuario: ['usuarioService', '$stateParams',
                  function( usuarioService, $stateParams){
                    datausuario = usuarioService.get( $stateParams.id );
                    return datausuario;
                  }],

                dataEstado: ['usuarioService',
                  function( usuarioService){
                    dataestado = usuarioService.listEstado();
                    return dataestado;
                  }],

                  dataTipoUsuario: ['tipousuarioService',
                    function( tipousuarioService){
                      datatipousuario = tipousuarioService.list();
                      return datatipousuario;
                      }]

              },
              controller: ['$scope', '$state', 'toastr', 'usuarioService', 'usuario', 'dataEstado', 'dataTipoUsuario',
                function (  $scope,   $state,   toastr,   usuarioService,   usuario, dataEstado, dataTipoUsuario) {
                  $scope.usuario = usuario.datos[0];
                  $scope.dataEstado = dataEstado.data;
                  $scope.dataTipoUsuario = dataTipoUsuario.data;
                  $scope.submitForm = function ( isValid ) {
                    if ( isValid ) {
                      $scope.usuario.usuarioModifica = $scope.loginData.codigoEmpleado;
                      usuarioService.update( $scope.usuario ).then( function ( response ) {
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
