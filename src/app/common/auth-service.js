angular.module( 'app.authService', [
  'LocalStorageModule',
  'app.utilsService'
])

.factory( 'authService', ['$http', '$q', 'localStorageService', 'utilsService', 'appSettings',  function ($http, $q, localStorageService, utilsService, appSettings) {

  var auth = {};

  auth.saveLocalData = function ( dataName, data ) {
    localStorageService.set( dataName, data);
  };

  auth.getLocalData = function ( dataName ) {
    return localStorageService.get( dataName );
  };

  var obtenerHijos = function (data, padreId) {
    var hijos = [];
    var dataNew = [];
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var hijo = data[i];
        if (padreId == data[i].padreId) {
          hijos.push(hijo);
        } else {
          dataNew.push(hijo);
        }
      }
    }
    if (hijos.length > 0) {
      for (var i = 0; i < hijos.length; i++) {
        var nietos = obtenerHijos(dataNew, hijos[i].menuId);
        hijos[i].hijos = nietos;
      }
    }
    return hijos;
  }

  auth.getInfoEmpleado = function (idEmpleado){ 
    var deferred = $q.defer();
    $http.get(appSettings.restApiServiceRh + 'catalogo/empleado/'+idEmpleado+'/sinfoto').success(function(data){
      deferred.resolve(data);                
    }).error(function(error){
        deferred.reject(error);
    })
    return deferred.promise;  
}

  auth.datosEmp = function(id){
    var deferred = $q.defer();
    $http.get( appSettings.restApiServiceBaseUri + 'usuario/' + id).success(function (data) {
      deferred.resolve( data );
    }).error( function ( error ) {
      deferred.reject( error );
    });
    return deferred.promise;
  }
  // Obtiene las estructuras del empleado
  auth.getEstructuras = function(id){
    var deferred = $q.defer();
    $http.get( appSettings.restApiServiceBaseUri + 'usuario/fondo/' + id).success(function (data) {
      deferred.resolve( data );
    }).error( function ( error ) {
      deferred.reject( error );
    });
    return deferred.promise;
  }

  auth.login = function ( data ) {
    var deferred = $q.defer();
    $http.post( appSettings.restActiveDirectory + 'usuario/validar', data).success(function ( res ) {
      if ( res.status == 'OK' ) {
            $http.get( appSettings.restActiveDirectory + 'usuario/' + res.data[0].usuarioId + '/sistema/' + appSettings.sistemaId + '/permiso/lista').success(function ( resp ) {
              if (resp.status == 'OK') {
                if (resp.data[0].permiso.length > 0) {
                  var menu = obtenerHijos(resp.data[0].menu, 0);
                  auth.saveLocalData('loginData' + appSettings.sistemaId, res.data[0]);
                  auth.saveLocalData('permiso' + appSettings.sistemaId, resp.data[0].permiso);
                  auth.saveLocalData('menu' + appSettings.sistemaId, menu);
                } else {
                  res.status = 'error';
                  res.message = 'No tiene permisos para ingresar al sistema';
                }
                deferred.resolve(res);
              }
            }).error(function( error ) {
              deferred.reject( error );
            });
          } else {
            deferred.resolve( res );
          }
        }).error(function( error ) {
          deferred.reject( error );
        });
    return deferred.promise;
  };

  auth.logOut = function () {
    localStorageService.remove( 'loginData' + appSettings.sistemaId );
    localStorageService.remove( 'permiso' + appSettings.sistemaId );
    localStorageService.remove( 'menu' + appSettings.sistemaId );
    localStorageService.remove( 'datosEmpleado');
    localStorageService.remove( 'dataTipoMovimiento' + appSettings.sistemaId );
  };

  auth.isLoggedIn = function () {
    return auth.getLocalData( 'loginData' + appSettings.sistemaId) ? true : false;
  };

  auth.loginPermission = function ( pantallaId ) {
    var deferred = $q.defer();
    var data = auth.getLocalData( 'permiso' + appSettings.sistemaId );
    var permiso = false;
    for (var i = 0; i < data.length; i++) {
      if (data[i].codigoPantalla == pantallaId && data[i].sistemaId == appSettings.sistemaId) {
        permiso = true;
        break;
      }
    }
    if ( !permiso ) {
      deferred.reject( {status : 403 });
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  };

  return auth;

}]);
