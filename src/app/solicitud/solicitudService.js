angular.module('app.solicitudService',[

])
.factory('solicitudService', ['$http','$q','appSettings',function($http,$q,appSettings){
    return{
        //lista de nuevas solicitudes
        lista : function(filtro){
            var deferred = $q.defer();
            $http.post(appSettings.restApiServiceBaseUri + 'solicitudes/lista/',filtro).success(function(data){
              deferred.resolve(data);                
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;  
        },//historial de las solicitudes atendidas, aprobadas y rechazadas
        listaHistorial : function(filtro){
            var deferred = $q.defer();
            $http.post(appSettings.restApiServiceBaseUri + 'solicitudes/lista/historial/', filtro).success(function(data){
              deferred.resolve(data);                
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;  
        },
        verifica : function(anio,id){
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceBaseUri + 'verificar/solicitud/'+anio+'/'+id).success(function(data){
              deferred.resolve(data);                
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;   
        },
        aprobar: function(data) {
            var deferred = $q.defer();
            $http.post(appSettings.restApiServiceBaseUri + 'solicitudes/atencion', data).success(function(data) {
              deferred.resolve(data);
            }).error(function(error) {
              deferred.reject(error);
            });
            return deferred.promise;
          },
          sendMail : function(message){
            var deferred = $q.defer();
            $http.post( appSettings.restApiServiceBaseUri + 'mail/enviarMensaje/respuesta',message).success( function ( data ) {
              deferred.resolve( data );
            }).error( function ( error ) {
              deferred.reject( error );
            });
            return deferred.promise;
        },
        update : function(data){
            var deferred = $q.defer();
            $http.put( appSettings.restApiServiceBaseUri + 'solicitudes/' + data.idSolicitud + '/actualizar', data).success( function (data){
                deferred.resolve(data);
            }).error(function (error){
                deferred.reject (error);
            })
            return deferred.promise;
        },
        Dependencia : function(id){
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceRh + 'catalogo/empleado/'+id+'/sinfoto').success(function(data){
              deferred.resolve(data);                
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;  
        },
        cantidad : function(recibo,anio){
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceBaseUri + 'solicitudes/cantidad/'+ recibo + "/"+anio).success(function(data){
              deferred.resolve(data);                
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;  
        },
        getInfoEmpleado : function(idEmpleado){
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceRh + 'catalogo/empleado/'+idEmpleado+'/sinfoto').success(function(data){
              deferred.resolve(data);                
            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;  
        },
        getSolicitudApertura: function () {
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceBaseUri + 'preapertura/lista/solicitud').success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            })
            return deferred.promise;
        }
        ,
        getListaApertura: function () {
            var deferred = $q.defer();
            $http.get(appSettings.restApiServiceBaseUri + 'preapertura/lista/apertura/').success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            })
            return deferred.promise;
        }   ,
        updSolicitudApertura: function (data) {
            var deferred = $q.defer();
            $http.put(appSettings.restApiServiceBaseUri + 'preapertura/proceso/autorizacion/'+ data.correlativo,data).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            })
            return deferred.promise;
        }    
    }
}]);