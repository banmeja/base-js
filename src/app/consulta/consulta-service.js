angular.module('app.consultaService', [

])
    .factory('consultaService', ['$http', '$q', 'appSettings', function ($http, $q, appSettins) {
        return {
            consultaEnDependencia: function (opcion, texto) {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'caso/consulta/' + opcion + '/' + texto + '/getConsulta').success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;

            },
            consultaEstado: function (caso) {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'consulta/estado/' + caso + '/getConsulta').success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            reporteEc: function (data) {
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'consulta/getEstado/sinCosto/', data).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            reporte: function (data) {
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'consulta/getReporte/', data).success(function (data) {
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
            add: function (data) {
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'solicitudes/agregar', data).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            previaSolicitud: function (id, anio) {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'solicitudes/previa/' + id + '/' + anio).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            sendMail: function (message) {
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'mail/enviarMensaje', message).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            Dependencia: function (id) {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'empleado/' + id).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            listaHistorialEmpleado: function (empleado, filtro) {
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'solicitudes/historial/' + empleado + '/lista', filtro).success(function (data) {
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