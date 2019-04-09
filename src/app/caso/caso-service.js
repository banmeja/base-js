angular.module('app.casoService', [

])

    .factory('casoService', ['$http', '$q', 'appSettings', function ($http, $q, appSettings) {
        return {
            list: function () {
                var deferred = $q.defer();
                //$http.get(appSettings.restApiServiceBaseUri + 'apertura/lista/getPlantilla').success(function(data){
                $http.get(appSettings.restApiServiceBaseUri + 'apertura/lista/getPlantilla').success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            listDependence: function () {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'apertura/lista/getDependencia').success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            listDocument: function () {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'apertura/lista/getDocumento').success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            listPeople: function () {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'apertura/lista/getPersona').success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            depAsociado: function (data) {
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'apertura/dep/asociado', data).success(function (response) {
                    deferred.resolve(response);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            benAsociado: function (data) {
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'apertura/ben/asociado', data).success(function (response) {
                    deferred.resolve(response);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            uploadFile: function (file) {
                //var file = ... // get from file input;
                //var backendUrl = ...
                var fd = new FormData();
                fd.append('file', file, file.name);
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'upload/add', fd, {
                    // this cancels AngularJS normal serialization of request
                    transformRequest: angular.identity,
                    // this lets browser set `Content-Type: multipart/form-data`
                    // header and proper data boundary
                    headers: { 'Content-Type': undefined }
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getCreado: function (id) {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'preapertura/lista/' + id).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            add: function (data) {
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'preapertura/agregar', data).success(function (data) {
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
            getConsultaCreado: function (id, dependencia) {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'preapertura/consulta/' + id + '/' + dependencia).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            getImg: function (data) {
                var deferred = $q.defer();
                $http.post(appSettings.restApiServiceBaseUri + 'apertura/getSrc', data).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            update: function (data) {
                var deferred = $q.defer();
                $http.put(appSettings.restApiServiceBaseUri + 'preapertura/' + data.correlativo, data).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            getEmpresa: function () {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'empresa/getListaEmpresa').success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            getMovimiento: function (id) {
                var deferred = $q.defer();
                $http.get(appSettings.restApiServiceBaseUri + 'preapertura/getBitacoraModificacion/' + id).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            }
        }
    }])