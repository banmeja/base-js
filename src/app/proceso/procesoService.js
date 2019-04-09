angular.module('app.procesoService', [

])
    .factory('procesoService', ['$http', '$q', 'appSettings', function ($http, $q, appSettins) {
        return {  
            update : function (data){
                var deferred = $q.defer();
                $http.put(appSettings.restApiServiceBaseUri + 'preapertura/proceso/' + data.correlativo, data).success(function(data){
                    deferred.resolve(data);                    
                }).error(function(error){
                    deferred.reject(error);
                })
                return deferred.promise;
            },
            modificar : function (data){
                var deferred = $q.defer();
                $http.put(appSettings.restApiServiceBaseUri + 'preapertura/proceso/modificar/' + data.correlativo, data).success(function(data){
                    deferred.resolve(data);                    
                }).error(function(error){
                    deferred.reject(error);
                })
                return deferred.promise;
            }
        }
    }]);