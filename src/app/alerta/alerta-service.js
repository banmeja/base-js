angular.module('app.alertaService', [

])

.factory('alertaService', ['$http', '$q', 'appSettings', function ( $http, $q, appSettings ) {

    return {
      listEstado: function() {
        var deferred = $q.defer();
        data = {
          status: 'OK',
          message: 'Proceso completado con éxito',
          data: [
            {
              estado: 0,
              estadoDesc: 'Inactivo'
            },
            {
              estado: 1,
              estadoDesc: 'Activo'
            }
          ]
        }
        deferred.resolve( data );
        return deferred.promise;
      },
      list: function() {
        var deferred = $q.defer();
        $http.get( appSettings.restApiServiceBaseUri + 'alerta/' + 0 + '/lista' ).success( function ( data ) {
          deferred.resolve( data );
        }).error( function ( error ) {
          deferred.reject( error );
        });
        return deferred.promise;
      },
      add: function( data ) {
        var deferred = $q.defer();
        $http.post( appSettings.restApiServiceBaseUri + 'alerta/agregar', data ).success( function ( data ) {
          deferred.resolve( data );
        }).error( function ( error ) {
          deferred.reject( error );
        });
        return deferred.promise;
      },

      get: function( id ) {
        var deferred = $q.defer();
        $http.get( appSettings.restApiServiceBaseUri + 'alerta/' + id + '/listar').success( function ( data ) {
        deferred.resolve( data );
        }).error( function ( error ) {
        deferred.reject( error );
        });
        return deferred.promise;
      },
      update: function( data ) {
        var deferred = $q.defer();
        $http.put( appSettings.restApiServiceBaseUri + 'alerta/' + data.idAlerta + '/actualizar',   data ).success( function ( data ) {
          deferred.resolve( data );
        }).error( function ( error ) {
          deferred.reject( error );
        });
        return deferred.promise;
      },
      delete: function( id ) {
        var deferred = $q.defer();
        $http.delete( appSettings.restApiServiceBaseUri + 'alerta/' + id + '/desactivar' ).success( function ( data ) {
          deferred.resolve( data );
        }).error( function ( error ) {
          deferred.reject( error );
        });
        return deferred.promise;
      }
  }

}]);
