angular.module('app.estadistica',[
    'ui.router',
    'toastr',    
    'app.estadisticaService',
    'chart.js'
    
    
])
.config(
    ['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('index.estadistica',{                
                url: 'estadistica',
                params : {

                },
                views: {
                    '':{
                        templateUrl: 'app/estadistica/estadistica.tpl.html',                  
                controller: ['$scope', '$state', 'toastr','authService','estadisticaService',
                function($scope,$state,toastr,authService,estadisticaService){ 
                     $scope.estadistica = {
                        pines: null,
                        estadosCuenta: null,
                        solicitudes: null
                    };
                //otras graficas
                $scope.data1 = [];
                $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
                $scope.data1 = [300, 500, 100];

                console.log($scope.data1)
                
                    estadisticaService.estadisticaGeneral().then(function(response){
                        if(response.data == undefined){
                            toastr.error("Ex005tica");                            
                        }
                        else{
                            $scope.estadistica.pines = response.data[0].totalPin;
                            $scope.estadistica.estadosCuenta = response.data[0].totalEstadoCuenta;   
                            $scope.estadistica.solicitudes = response.data[0].totalSolicitudReimp;                                
                        }
                    });
                    estadisticaService.estadisticaTotalUsuario().then(function(response){
                        if(response.data == undefined){
                            toastr.error("Ex005tica");                            
                        }
                        else{
                            $scope.estadistica.usuariosAsignados = response.data[0].totalConfigurado;
                        }
                    });
                    
                    $scope.usr = null;
                    estadisticaService.estadisticaAsignado().then(function(response){
                        if(response.data == undefined){
                            toastr.error("Ex005tica");                            
                        }
                        else{
                            $scope.usr = response.data;                            
                            var usuarios = [];
                            for (var i = 0; i <= $scope.usr.length-1; i++){
                                var usuario = {};
                                usuario = $scope.usr[i].codigoEmpleado;
                                usuarios.push(usuario);
                                
                            }
                            
                            var listadoUsr = {
                                codigoEmpleado :0,
                                totalConfigurado : 0,
                                totalJuzgado : 0,
                                identificadoUsr : usuarios.toString()
                            }
                            //modificiar el total de usuarios
                            console.log(listadoUsr)
                           estadisticaService.totalDependencia(listadoUsr).then(function(response){
                               if(response.data == undefined){
                                toastr.warning("Fallo en estadistica. Ex005eJds");
                               }else{
                                $scope.estadistica.totalJuzgado = response.data[0].totalJuzgado;
                               }
                                
                            });

                           //otras graficas
              
           
                        }
                    }); 
                    
                }
            ]
        }
    }
})
}])