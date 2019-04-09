/////////////////////////////
// Parametros del sistema //
/////////////////////////////
var appSettings = {
  isDevelopment: false,
  restApiServiceBaseUri: 'http://localhost:8080/portalgestionfamilia/',
  //restApiServiceBaseUri: 'http://wsdesacit.oj.gob.gt:8080/portalgestionfamilia/',
  //restApiServiceBaseUri: 'http://servicioscit.oj.gob.gt:8080/portalgestionfamilia/',

  //restApiServiceBaseRh: 'http://localhost:8080/rrhh/',
  //restApiServiceRh: 'http://wsdesacit.oj.gob.gt:8080/rrhh/',
  restApiServiceRh: 'http://servicioscit.oj.gob.gt:8080/rrhh/',
  
  restActiveDirectory: 'http://wsdesacit.oj.gob.gt:8080/oauth/',
  //restActiveDirectory: 'http://servicioscit.oj.gob.gt:8080/oauth/',
  timeOuttoastrNotifications: '15000',
  paginationPageSizes: [20, 25, 50],
  paginationMinPageSizes: [15, 25, 25],
  paginationPageSize: 15,
  smartTable: {
    itemsByPage: 5,
    displayedPages: 5
  },
  appVersion: '1071',
  sistemaId: 25 //dev
  //sistemaId: 11
};

/////////////////////////////
// Inicializacion de modulo//
// principal del sistema   //
/////////////////////////////
angular.module('app', [
  'templates-app',
  'ngSanitize',
  'ui.bootstrap',
  'ui.grid',
  'ui.grid.pagination',
  'ui.grid.selection',
  'ui.grid.edit',
  'ui.grid.autoResize',
  'ui.grid.grouping',
  'ui.grid.treeView',
  'ui.router',
  'ui.select',
  'ui.calendar',
  'LocalStorageModule',
  'chieffancypants.loadingBar',
  'toastr',
  'ngDialog',
  'ui.mask',
  'base64',
  'textAngular',
  'ui.uploader',
  'ngFileUpload',
  'chart.js',
  //'app.utilsService',
  'app.authService',
  'app.authInterceptorService',
  'app.directives',
  'app.login',
  'app.consulta',
  'app.consultaService',
  'app.gestion',
  'app.gestionService',
  'app.solicitudService',
  'app.solicitud',
  'mwl.calendar',
  'app.estadistica',
  'app.estadisticaService',
  'app.caso',
  'app.casoService',
  'app.penal',
  'app.penalService'//,
  //'app.proceso',
  //'app.procesoService'

])
  .directive('isNumber', ['$compile', function ($compile) {
    return {
      restrict: 'E',
      scope: {
        myNgModel: '='
      },
      compile: function (element, attrs) {

        var e = angular.element('<input class="form-control" placeholder="Número" ng-model="' + attrs.myNgModel + '" size="20" />');
        element.append(e);

        return function (scope, element, attrs) {
          $compile(e)(scope);

          var maxLength = 6;
          // var hasDecimal = false;
          var enableNegative = false;

          if (attrs.enableNegative) {
            enableNegative = (attrs.enableNegative === 'true');
          }

          if (attrs.max) {
            maxLength = attrs.max;
          }

          if (attrs.value) {
            if (maxLength < attrs.value.length) {
              attrs.value = attrs.value.substring(0, maxLength);
            }
            scope.myNgModel = attrs.value;
          }


          scope.$watch('myNgModel', function (newValue, oldValue) {
            if (newValue !== undefined) {

              var arr = String(newValue).split('');

              if (arr.length === 0) {
                return;
              }

              if (enableNegative && arr.length === 1 && arr[0] === '-') {
                return;
              }

              if (isNaN(newValue) || (arr.length > maxLength) || (arr.indexOf('.') !== -1)) {
                scope.myNgModel = oldValue;
              }
            }
          });
        };

      }
    };
  }])
  .filter('dateFilter', ['$filter', function ($filter) {
    return function (input) {
      if (!input) {
        return '';
      } else {
        return $filter('date')(new Date(input), 'dd/MM/yyyy');
      }
    };
  }])

  .filter('mapRol', [function () {
    var genderHash = {
      1: 'Solicitante',
      2: 'Conformidad',
      3: 'Autorizador'
    };

    return function (input) {
      if (!input) {
        return '';
      } else {
        return genderHash[input];
      }
    };
  }])

  .filter('propsFilter', [function () {
    return function (items, props) {
      var out = [];

      if (angular.isArray(items)) {
        items.forEach(function (item) {
          var itemMatches = false;

          var keys = Object.keys(props);
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var text = props[prop].toLowerCase();
            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              itemMatches = true;
              break;
            }
          }

          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }

      return out;
    };
  }])

  .run(
    ['$rootScope', '$state', '$stateParams', 'appSettings', 'toastr', 'ngDialog',
      function ($rootScope, $state, $stateParams, appSettings, toastr, ngDialog) {

        // add references to $state and $stateParams to the $rootScope
        // For example <li ng-class="{ active: $state.includes( 'contacts.list' ) }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
          // prevenir accion por default
          event.preventDefault();
          // cerrar todos los dialogos abiertos si hay
          ngDialog.close();

          if (error && error.status == 401) {
            $state.go('login');
          } else {
            if (error && error.status == 403) {
              $state.go('index.forbidden.show');
            } else {
              location.href = '#/';
            }
          }
        });
      }
    ]
  )

  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
  }])

  .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.spinnerTemplate = '<div class="spinner"> <div id="loading-bar-spinner"><div class="preloader pl-lg"> <svg class="pl-circular" viewBox="25 25 50 50"><circle class="plc-path" cx="50" cy="50" r="20"></circle></svg> </div></div> </div>';
  }])

  .config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
      className: 'ngdialog-theme-flat',
      showClose: true,
      closeByDocument: true,
      closeByEscape: true,
      cache: true,
      overlay: true
    });
  }])

  .config(['toastrConfig', function (toastrConfig) {
    angular.extend(toastrConfig, {
      autoDismiss: false,
      containerId: 'toast-container',
      maxOpened: 0,
      newestOnTop: true,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      preventOpenDuplicates: false,
      target: 'body'
    });
  }])

  /* .config( function (calendarConfig) {
    calendarConfig.showTimesOnWeekView = true; //Make the week view more like the day view, with the caveat that event end times are ignored.
  })*/

  .config(
    ['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {

        var authenticated = ['$location', '$q', 'authService', function ($location, $q, authService) {
          var deferred = $q.defer();
          if (authService.isLoggedIn()) {
            deferred.resolve();
          } else {
            deferred.reject({
              status: 401
            });
          }
          return deferred.promise;
        }];

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////

        $urlRouterProvider

          // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
          .otherwise('/');


        //////////////////////////
        // State Configurations //
        //////////////////////////

        // Use $stateProvider to configure your states.
        $stateProvider

          //////////
          // Home //
          //////////

          .state("index", {

            abstract: true,

            url: "/",

            templateUrl: 'app/index.tpl.html',

            resolve: {
              // descomentar para que tenga seguridad la ruta
              authenticated: authenticated,
            },

            controller: ['$scope', 'toastr', 'appSettings', 'utilsService', 'authService', '$state', '$sce',
              function ($scope, toastr, appSettings, utilsService, authService, $state, $sce) {
                $scope.loginData = authService.getLocalData('loginData' + appSettings.sistemaId);
                $scope.gblNotificacion = {}

                //authService.saveLocalData('dataTipoMovimiento' + appSettings.sistemaId, dataTipoMovimiento.data);
                //$scope.gblDataTipoMovimiento = authService.getLocalData( 'dataTipoMovimiento' + appSettings.sistemaId );
                $scope.gblEmpleado = {};


                $scope.arregloNotificaciones = [7, 8, 9, 10, 11, 12, 13, 14];

                listaContactos = function () {
                  for (var i = 1; i < $scope.arregloNotificaciones.length; i++) {
                    if ($scope.paraNotificacion == $scope.arregloNotificaciones[i]) {
                      $scope.sedeParaNotificacion = 'QZ';
                    } else {

                      $scope.sedeParaNotificacion = 'GT';
                    }
                  }
                }

                // authService.getInfoEmpleado($scope.loginData.codigoEmpleado).then(function (response) {
               
                //   if (response.status === "error") {
                //     toastr.error("Usuario no registrado.");
                //     $scope.gblDependencia = "null";
                //     $scope.paraNotificacion = 1;
                //   }
                //   if (response.data.length > 0) {
                //     $scope.gblDependencia = response.data[0].dependenciaFuncionesDesc;
                //     $scope.paraNotificacion = response.data[0].departamentoId;

                //     for (var i = 0; i < $scope.arregloNotificaciones.length; i++) {
                //       if ($scope.paraNotificacion == $scope.arregloNotificaciones[i]) {
                //         $scope.sedeParaNotificacion = 'QZ';
                //         break;
                //       } else {

                //         $scope.sedeParaNotificacion = 'GT';
                //       }
                //     }
                //     $scope.gblNotificacion.sede = $scope.sedeParaNotificacion;


                //   } else {
                //     toastr.info("Ocurrio un problema para consultar la dependencia de origen, del usuario en sesión.");
                //     $scope.gblDependencia = "null";
                //   }
                // });

                /*authService.datosEmp($scope.loginData.codigoEmpleado).then(function(response) {
                  if (response.status == 'OK') {
                    authService.saveLocalData('datosEmpleado', response.data[0]);
                    $scope.gblEmpleado = authService.getLocalData('datosEmpleado');
                  } else {
                    toastr.error(response.message);
                  }
                }, function(error) {
                  toastr.error(error);
                });*/
                /*authService.getEstructuras($scope.loginData.codigoEmpleado).then(function(response) {
                  if (response.status == 'OK') {
                    authService.saveLocalData('estructuras', response.data);
                    $scope.gblEmpleado.estructuras = authService.getLocalData('estructuras');
                  } else {
                    toastr.error(response.message);
                  }
                }, function(error) {
                  toastr.error(error);
                });*/


                // inicializar la plantilla AdminLTE
                _initAdminLTETemplate();

                var dataMenu = authService.getLocalData('menu' + appSettings.sistemaId);
                $scope.getNombreMenu = function (id) {
                  var strNombre = 'Menu ' + id;
                  for (var i = 0; i < dataMenu.length; i++) {
                    if (id == dataMenu[i].codigoPantalla) {
                      strNombre = dataMenu[i].menuNombre;
                      break;
                    }
                  }
                  return strNombre;
                  //console.log(strNombre);
                }

                $scope.getDataMenu = function (id) {
                  var hijos = [];
                  for (var i = 0; i < dataMenu.length; i++) {
                    if (id == dataMenu[i].codigoPantalla) {
                      hijos = dataMenu[i].hijos;
                      break;
                    }
                  }
                  return hijos;
                }

                // dateOptions
                $scope.dateOptions = {
                  formatYear: 'yy',
                  startingDay: 0,
                  format: 'dd/MM/yyyy',
                  formatDateTime: 'dd/MM/yyyy HH:mm',
                  showMeridian: false
                };

                $scope.showDate = function (value) {
                  return new Date(value);
                }

                // objeto fechas que contiene todas las fechas de los forms
                $scope.openedDates = {};

                // funcion que muestra el datepicker
                $scope.openDate = function ($event, field) {
                  $event.preventDefault();
                  $event.stopPropagation();
                  $scope.openedDates[field] = true;
                };

                $scope.smartTable = appSettings.smartTable;

                // grid
                $scope.gridOptions = {
                  enableRowSelection: true,
                  multiSelect: true,
                  enableSelectAll: true,
                  enableRowSelection: true,
                  enableRowHeaderSelection: false,
                  selectionRowHeaderWidth: 35,
                  groupingRowHeaderWidth: 50,
                  paginationPageSizes: appSettings.paginationPageSizes,
                  paginationPageSize: appSettings.paginationPageSize,
                  onRegisterApi: function (gridApi) { $scope.gridApi = gridApi; },
                  data: []
                };

                $scope.gridOptionsBandeja = {
                  enableRowSelection: true,
                  multiSelect: true,
                  enableSelectAll: true,
                  enableRowSelection: true,
                  enableRowHeaderSelection: false,
                  selectionRowHeaderWidth: 5,
                  groupingRowHeaderWidth: 10,
                  
                  paginationPageSizes: appSettings.paginationPageSizes,
                  paginationPageSize: appSettings.paginationPageSize,
                  onRegisterApi: function (gridApi) { $scope.gridApi = gridApi; },
                  data: []
                };

                $scope.gridOptionsSelection = {
                  enableRowSelection: true,
                  rowHeight: 10,
                  enableFiltering: false,
                  multiSelect: false,
                  enableSelectAll: false,
                  enableRowHeaderSelection: false,
                  paginationPageSizes: appSettings.paginationPageSizes,
                  paginationPageSize: appSettings.paginationPageSize,
                  data: []
                };

                $scope.gridOptionsImpreso = {
                  enableRowSelection: true,
                  rowHeight: 15,
                  enableFiltering: false,
                  multiSelect: false,
                  enableSelectAll: false,
                  enableRowHeaderSelection: false,
                  paginationPageSizes: appSettings.paginationPageSizes,
                  paginationPageSize: appSettings.paginationPageSize,
                  data: []
                };

                $scope.gridOptionsModificacion = {
                  enableRowSelection: true,
                  rowHeight: 7,
                  selectionRowHeaderWidth: 7,
                  groupingRowHeaderWidth: 7,
                  enableFiltering: false,
                  multiSelect: false,
                  enableSelectAll: false,
                  enableRowHeaderSelection: false,
                  paginationPageSizes: appSettings.paginationPageSizes,
                  paginationPageSize: appSettings.paginationPageSize,
                  data: []
                };
                
                $scope.gridOptionsSelectionList = {
                  enableRowSelection: true,
                  rowHeight: 5,
                  enableFiltering: false,
                  multiSelect: false,
                  enableSelectAll: false,
                  enableRowHeaderSelection: false,
                  paginationPageSizes: appSettings.paginationPageSizes,
                  paginationPageSize: appSettings.paginationPageSize,
                  data: []
                };
                //graphs
                $scope.chartOptionsNormal = {
                  legend: {
                    display: false
                  }
                };

                $scope.chartOptionsLegend = {
                  legend: {
                    display: true
                  }
                };

                $scope.chartOptionsLegendPolar = {
                  legend: {
                    display: true,
                    position: 'top',
                    reverse: true,
                    labels: {
                      fontSize: 9,
                      boxWidth: 10
                    }
                  }
                };

                $scope.goTab = function (event) {
                  event.preventDefault();
                };

                $scope.typeof = function (value, type) {
                  return typeof value === type
                };

                $scope.logout = function (isValid) {
                  authService.logOut();
                  $state.go('login');
                };
                $scope.tituloMenu = 'Bienvenidas (os)';
                $scope.current = {
                  reload: true,
                  dataParticipante: {},
                  dataConvocatoria: {},
                  dataEvaluacionParticipante: {}
                }

                /*************************************************************/
                // NumeroALetras
                // @author   Rodolfo Carmona
                /*************************************************************/
                /*$scope.Unidades = function (num){
  
                  switch(num)
                  {
                    case 1: return "UN";
                    case 2: return "DOS";
                    case 3: return "TRES";
                    case 4: return "CUATRO";
                    case 5: return "CINCO";
                    case 6: return "SEIS";
                    case 7: return "SIETE";
                    case 8: return "OCHO";
                    case 9: return "NUEVE";
                  }
  
                  return "";
                }
  
                $scope.Decenas = function (num){
  
                  decena = Math.floor(num/10);
                  unidad = num - (decena * 10);
  
                  switch(decena)
                  {
                    case 1:
                      switch(unidad)
                      {
                        case 0: return "DIEZ";
                        case 1: return "ONCE";
                        case 2: return "DOCE";
                        case 3: return "TRECE";
                        case 4: return "CATORCE";
                        case 5: return "QUINCE";
                        default: return "DIECI" + $scope.Unidades(unidad);
                      }
                    case 2:
                      switch(unidad)
                      {
                        case 0: return "VEINTE";
                        default: return "VEINTI" + $scope.Unidades(unidad);
                      }
                    case 3: return $scope.DecenasY("TREINTA", unidad);
                    case 4: return $scope.DecenasY("CUARENTA", unidad);
                    case 5: return $scope.DecenasY("CINCUENTA", unidad);
                    case 6: return $scope.DecenasY("SESENTA", unidad);
                    case 7: return $scope.DecenasY("SETENTA", unidad);
                    case 8: return $scope.DecenasY("OCHENTA", unidad);
                    case 9: return $scope.DecenasY("NOVENTA", unidad);
                    case 0: return $scope.Unidades(unidad);
                  }
                }//Unidades()
  
                $scope.DecenasY = function (strSin, numUnidades){
                  if (numUnidades > 0)
                    return strSin + " Y " + $scope.Unidades(numUnidades)
  
                  return strSin;
                }//DecenasY()
  
                $scope.Centenas = function (num){
  
                  centenas = Math.floor(num / 100);
                  decenas = num - (centenas * 100);
  
                  switch(centenas)
                  {
                    case 1:
                      if (decenas > 0)
                        return "CIENTO " + $scope.Decenas(decenas);
                      return "CIEN";
                    case 2: return "DOSCIENTOS " + $scope.Decenas(decenas);
                    case 3: return "TRESCIENTOS " + $scope.Decenas(decenas);
                    case 4: return "CUATROCIENTOS " + $scope.Decenas(decenas);
                    case 5: return "QUINIENTOS " + $scope.Decenas(decenas);
                    case 6: return "SEISCIENTOS " + $scope.Decenas(decenas);
                    case 7: return "SETECIENTOS " + $scope.Decenas(decenas);
                    case 8: return "OCHOCIENTOS " + $scope.Decenas(decenas);
                    case 9: return "NOVECIENTOS " + $scope.Decenas(decenas);
                  }
  
                  return $scope.Decenas(decenas);
                }//Centenas()
  
                $scope.Seccion = function (num, divisor, strSingular, strPlural){
                  cientos = Math.floor(num / divisor)
                  resto = num - (cientos * divisor)
  
                  letras = "";
  
                  if (cientos > 0)
                    if (cientos > 1)
                      letras = $scope.Centenas(cientos) + " " + strPlural;
                    else
                      letras = strSingular;
  
                  if (resto > 0)
                    letras += "";
  
                  return letras;
                }//Seccion()
  
                $scope.Miles = function (num){
                  divisor = 1000;
                  cientos = Math.floor(num / divisor)
                  resto = num - (cientos * divisor)
  
                  strMiles = $scope.Seccion(num, divisor, "UN MIL", "MIL");
                  strCentenas = $scope.Centenas(resto);
  
                  if(strMiles == "")
                    return strCentenas;
  
                  return strMiles + " " + strCentenas;
  
                  //return Seccion(num, divisor, "UN MIL", "MIL") + " " + Centenas(resto);
                }//Miles()
  
                $scope.Millones = function (num){
                  divisor = 1000000;
                  cientos = Math.floor(num / divisor)
                  resto = num - (cientos * divisor)
  
                  strMillones = $scope.Seccion(num, divisor, "UN MILLON", "MILLONES");
                  strMiles = $scope.Miles(resto);
  
                  if(strMillones == "")
                    return strMiles;
  
                  return strMillones + " " + strMiles;
  
                  //return Seccion(num, divisor, "UN MILLON", "MILLONES") + " " + Miles(resto);
                }//Millones()
  
                $scope.numeroALetras = function (num){
                  var data = {
                    numero: num,
                    enteros: Math.floor(num),
                    centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
                    letrasCentavos: "",
                    letrasMonedaPlural: "QUETZALES",
                    letrasMonedaSingular: "QUETZAL"
                  };
  
                  if (data.centavos > 0)
                    data.letrasCentavos = "CON " + data.centavos + "/100";
  
                  if(data.enteros == 0)
                    return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
                  if (data.enteros == 1)
                    return $scope.Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
                  else
                    return $scope.Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
                }//NumeroALetras()
  */
              }
            ]

          })
          .state("index.home", {

            url: "",

            views: {
              '': {
                templateUrl: 'app/home/home.tpl.html',
                resolve: {},
                controller: ['$scope', 'toastr', '$sce',
                  function ($scope, toastr, $sce) {


                  }
                ]
              },
              'hint@index': {
                template: '<h1></h1>'
              }
            }

          })

      }
    ]
  )

  .constant('appSettings', appSettings);
