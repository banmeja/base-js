angular.module('app.estadisticaService',[

])
.factory('estadisticaService',['$http','$q','appSettings',function($http,$q,appSettins){
    return{
        estadisticaGeneral : function(){
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceBaseUri + 'estadistica/general/getConsulta').success(function(data){
                deferred.resolve(data);
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
                
        },
    estadisticaEnDependencia : function(id){
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceBaseUri + 'estadistica/getAll/' + id ).success(function(data){
                deferred.resolve(data);
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
                
        },
        estadisticaTotalUsuario : function(){
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceBaseUri + 'asignado/total').success(function(data){
                deferred.resolve(data);
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
                
        },
        estadisticaAsignado : function(){
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceBaseUri + 'asignado/lista').success(function(data){
                deferred.resolve(data);
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
                
        },
        totalDependencia : function(data){
            var deferred = $q.defer();
            $http.post(appSettings.restApiServiceBaseUri + 'asignado/total/dependencia/',data).success(function(data){
              deferred.resolve(data);                
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;  
        }
        
    }
}])