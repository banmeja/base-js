angular.module('app.penalService', [

])
    .factory('penalService', ['$http', '$q', 'appSettings', function ($http, $q, appSettins) {
        return {
            reporteEc: function (data) {
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'consulta/getEstado/', data).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            consultaImpresion: function (caso, recibo, anio) {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'consulta/dependencia/estado/lista/' + caso + '/' + recibo + '/' + anio).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },          
            getInfoEmpleado: function (idEmpleado) {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceRh + 'catalogo/empleado/' + idEmpleado + '/sinfoto').success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            contactoLista: function (sede) {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'mail/contacto/' + sede + '/getLista').success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            bitacoraConsulta: function (data) {
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'bitacora/agregar/', data).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            }
        }
    }]);