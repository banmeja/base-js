angular.module( 'app.login', [
  'ui.router',
  'toastr',
  'app.authService'
])

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        //////////////
        // Login //
        //////////////
        .state( 'login', {

          url: '/login',

          templateUrl: 'app/login/login.tpl.html',
          controller: ['$scope', '$state', '$timeout', 'toastr', 'authService', '$base64',
            function (  $scope,   $state,   $timeout,   toastr,   authService,  $base64) {
              $scope.submitForm = function (isValid) {
               if (isValid) {
                 var data = {
                   usuario: $scope.loginData.usuario,
                   password: '',
                   dominio: ''
                 };
                 data.password = $base64.encode($scope.loginData.password);
                 data.usuario = data.usuario.replace("\\", "/");
                 var partes = data.usuario.split("/");
                 if (partes.length > 1) {
                   data.usuario = partes[1];
                   data.dominio = partes[0];
                 } else {
                   data.usuario = partes[0];
                   data.dominio = 'OJ';
                 }
                 authService.login(data).then( function ( response ) {
                   $scope.response = response;
                   if ( response.status == 'OK' ) {
                     $state.go( 'index.home' );
                   } else {
                     toastr.error( response.message );
                     $timeout( function () {$scope.form.$submitted = false;}, 1300);
                   }
                 }, function ( error ) {
                   toastr.error( error );
                 });
               }
             }
           }]
        })
    }
  ]
);
