angular.module('app.gestionService',[

])
.factory('gestionService',['$http','$q','appSettings',function($http,$q,appSettins){
    return{
        consultaEnDependencia : function(id){
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceBaseUri + 'admon/caso/' + id ).success(function(data){
                deferred.resolve(data);
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
                
        },
        consultaCaso : function(id){
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceBaseUri + 'admon/consulta/' + id ).success(function(data){
                deferred.resolve(data);
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;                
        },
        add: function(data) {
            var deferred = $q.defer();
            $http.post(appSettings.restApiServiceBaseUri + 'enDependencia/registro', data).success(function(data) {
              deferred.resolve(data);
            }).error(function(error) {
              deferred.reject(error);
            });
            return deferred.promise;
          },
          Dependencia : function(id){
              var deferred = $q.defer();
              $http.get(appSettings.restApiServiceBaseUri + 'empleado/'+ id).success(function(data){
                deferred.resolve(data);                
              }).error(function(error){
                  deferred.reject(error);
              })
              return deferred.promise;  
          } 
    }
}]);