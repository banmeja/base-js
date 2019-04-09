angular.module( 'app.catalogosService', [
  'LocalStorageModule',
  'app.authService',
  'app.utilsService'
])

.factory( 'catalogosService', ['$http', '$q', 'appSettings', 'localStorageService', 'authService', 'utilsService',  function ($http, $q, appSettings, localStorageService, authService, utilsService) {  

  return {
    constantes: function () {
      return localStorageService.get( 'constantes' );
    },
    setConstantes: function ( data ) {
      localStorageService.set( 'constantes', data );
    },
    representaciones: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Sujeto/Representacion' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    // p_inc_adicional se esta enviando siempre cadena vacia
    tiposVinculacion: function ( p_id_materia, p_id_tipo_proceso, p_id_etapa ) {
      var deferred = $q.defer();
      var p_inc_adicional = '0';
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/TipoVinculacion/' + p_id_materia + '/' + p_id_tipo_proceso+ '/' + p_id_etapa +'/' + p_inc_adicional ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    tiposDocumento: function () {
       var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/TipoDocumento' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    nivelesAcademicos: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/NivelAcademico' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    etnias: function (idgrupo) {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/EtniaSujeto/' + idgrupo ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    gruposEtnicos: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/GrupoEtnico' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    profesiones: function () {
       var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Profesion' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    estadosCiviles: function (i) {
       var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/EstadoCivil' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    municipios: function (idDepartamento) {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Municipio/' + idDepartamento ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    departamentos: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Departamento' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    nacionalidades: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Nacionalidad' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    generos: function () {
       var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/GeneroSujeto' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    ocupaciones: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Ocupacion' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    monedas: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'lista_moneda' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    estadosExpediente: function ( idMateria, idTipoExpediente ) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Materia/'+ idMateria +'/TipoExpediente/' + idTipoExpediente + '/GetEstadoExpediente' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    fiscalias: function (id) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Tipo_Fiscalia/' + id).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    instituciones: function (idmateria, tipo) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Materia/'+ idmateria + '/TipoExpediente/' + tipo +'/getInstituciones' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
     },
    documentosOrigen: function (idmateria,tipo) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Materia/' + idmateria + '/TipoExpediente/' + tipo + '/getActosIntroductorios' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise; 
    },
    clases: function (idmateria,idtproceso,idcompetencia, tipo) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Despacho/' + loginData.id_despacho + '/TipoExpediente/' + tipo + '/TipoProceso/'+ idtproceso + '/GetClase'  ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    subclases: function (idmateria,idtproceso,clase, tipo) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Despacho/' + loginData.id_despacho + '/TipoExpediente/' + tipo + '/Clase/' + clase + '/GetSubClase'  ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    etapas: function (idmateria, tipo) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Materia/'+ idmateria + '/TipoExpediente/'+ tipo +'/getEtapas' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    tiposProceso: function (id, tipo) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Despacho/' + loginData.id_despacho + '/TipoExpediente/' + tipo + '/Materia/' + id + '/GetTipoProceso'  ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    competencias: function (tipoProceso) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Despacho/' + loginData.id_despacho + '/TipoExpediente/' + tipoProceso + '/GetCompetencia' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    materias: function (competencia, tipo) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Despacho/' + loginData.id_despacho + '/TipoExpediente/' + tipo + '/Competencia/' + competencia + '/GetMateria' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    formas: function (materia, tipo) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/Materia/' + materia  + '/TipoExpediente/' + tipo + '/GetFormaExpediente' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    entidades: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Catalogo/TipoEntidad ' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    despachos: function ( idMunicipio ) {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'ObtenerDespachosPorUbicacionGeografica/' + idMunicipio ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    despachosxubicacion: function ( idCompetencia, idMunicipio ) {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'competencia/' + idCompetencia + '/ubicaciongeografica/' + idMunicipio + '/despachos' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    tipoCentroDetencion: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Sujeto/TipoCentroDetencion' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    }, 
    centroDetencion: function (tcentro) {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'CentroDetencion/' + tcentro ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    tiposCentros: function () {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'tiposcentro' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    centros: function ( idTipoCentro ) {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'tiposcentro/' + idTipoCentro + '/centros' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    calendario: function (idDespacho,mes,anio) {
      var deferred = $q.defer();
      $http.get( appSettings.restApiServiceBaseUri + 'Despacho/' + idDespacho + '/GetCalendario/mes/' +  mes + '/anio/' + anio ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    lugarDespacho: function () {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'Despacho/' + loginData.id_despacho + '/GetUbicacion' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    upLoadFile: function ( data ) {
      var deferred = $q.defer();
      $http.post( appSettings.restApiServiceBaseUri + 'archivos/uploadFile', data).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    downLoadFile: function (idArchivo) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'archivos/' + idArchivo +'/' + loginData.id_usuario + '/' + loginData.id_despacho + '/downloadFile' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    archivosHuerfanos: function (modulo, idExpediente) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.get( appSettings.restApiServiceBaseUri + 'archivos/' + loginData.id_despacho +'/' + loginData.id_usuario + '/' + idExpediente+ '/'+ modulo + '/getArchivosHuerfanos' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    deleteFile: function (idArchivo) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      console.log( 'eliminando',appSettings.restApiServiceBaseUri + 'archivos/' + loginData.id_despacho +'/' + loginData.id_usuario + '/' + idArchivo + '/DeleteArchivo' )
      $http.put( appSettings.restApiServiceBaseUri + 'archivos/' + loginData.id_despacho +'/' + loginData.id_usuario + '/' + idArchivo + '/DeleteArchivo' ).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    },
    ValidaExtension: function ( data ) {
      var deferred = $q.defer();
      var loginData = authService.getLoginData();
      $http.post( appSettings.restApiServiceBaseUri + 'archivos/ValidaExtension',data).success( function ( data ) {
        deferred.resolve( data );
      }).error( function ( error ) {
        deferred.reject( error );
      });
      return deferred.promise;
    }
  }
}]);