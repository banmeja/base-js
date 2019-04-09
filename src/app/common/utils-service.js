angular.module( 'app.utilsService', [

])

.factory( 'utilsService', ['$filter', '$compile', '$templateCache', '$timeout',  function ( $filter, $compile, $templateCache, $timeout ) {
  return {
    findById: function (a, id) {
      if ( typeof a !== "undefined" ) {
        for (var i = 0; i < a.length; i++) {
          if (a[i].id == id) return a[i];
        }
      }
      return null;
    },

    findFieldById: function (a, field, id) {
      var obj = this.findById(a,id);
      return obj !== null ? obj[field] : null;
    },

    findByField: function (a, field, value) {
      if ( typeof a !== "undefined" ) {
        for (var i = 0; i < a.length; i++) {
          if (a[i][field] == value) return a[i];
        }
      }
      return null;
    },

    filterByField: function (a, field, value) {
      var newArray = [];
      if ( typeof a !== "undefined" ) {
        for (var i = 0; i < a.length; i++) {
          if (a[i][field] == value) newArray.push(a[i]);
        }
      }
      return newArray;
    },

    existInArray: function (a, field, value) {
      if ( typeof a !== "undefined" ) {
        for (var i = a.length - 1; i >= 0; i--) {
          if ( a[i][field] == value ) {
            return true;
          }
        }
      }
      return false;
    },

    existInArrayTwoFields: function (a, fielda, valuea, fieldb, valueb) {
      if ( typeof a !== "undefined" ) {
        for (var i = a.length - 1; i >= 0; i--) {
          if ( a[i][fielda] == valuea && a[i][fieldb] == valueb ) {
            return true;
          }
        }
      }
      return false;
    },

    existInArrayThreeFields: function (a, fielda, valuea, fieldb, valueb, fieldc, valuec) {
      if ( typeof a !== "undefined" ) {
        for (var i = a.length - 1; i >= 0; i--) {
          if ( a[i][fielda] == valuea && a[i][fieldb] == valueb && a[i][fieldc] == valuec ) {
            return true;
          }
        }
      }
      return false;
    },

    compareAndDeleteRepeatedItems: function (a1, a2, field) {
      var newArray = [];
      for (var i = 0; i < a1.length; i++) {
        if ( !this.existInArray( a2, field, a1[i][field]) ) {
          newArray.push( a1[i] );
        }
      }
      return newArray;
    },

    formatPadString: function ( pad, str ) {
      return pad.substring(0, pad.length - str.length) + str;
    },

    formatNumeroUnicoExp: function (numeroUnico) {
      // formateando digitos
      var pad = "00000";
      var padOptional = "00000";
      var arrayNumeroUnico = numeroUnico.split( '-' );
      console.log(arrayNumeroUnico);
      var result = pad.substring(0, pad.length - arrayNumeroUnico[0].length) + arrayNumeroUnico[0] + '-' +
                  arrayNumeroUnico[1] + '-' + pad.substring(0, pad.length - arrayNumeroUnico[2].length) + arrayNumeroUnico[2];

      if ( arrayNumeroUnico.length > 3 ) {
        var literal=arrayNumeroUnico[3].substring(0,1);
        result += '-' + literal.toUpperCase() + padOptional.substring(0, padOptional.length - ( arrayNumeroUnico[3].length -1 ) ) + arrayNumeroUnico[3].substring(1, arrayNumeroUnico[3].length);
      }

      return result;
    },

    xml2json: function (a) {

      try {
        var result = a.replace("<?xml version=\"1.0\" encoding=\"utf-8\"?>\r","").replace("<string xmlns=\"http://tempuri.org/\">", "").replace("</string>","");
        return ( result === '' ) ? [] : JSON.parse( result );
      } catch ( error ) {
        return undefined;
      }
    },

    normalizarArraySujetos: function (a) {

      var nuevoArray = a, nombre = '', indentificacion = '';

      if ( typeof a !== "undefined" ) {

        for (var i = 0; i < a.length; i++) {
          if ( a[i].NUMERO_IDENTIFICACION || a[i].NOMBRE_CONCATENADO ) {
            nombre = 'NOMBRE_CONCATENADO';
            indentificacion = 'NUMERO_IDENTIFICACION';
          } else {
            nombre = 'RAZON_SOCIAL';
            indentificacion = 'NIT';
          }
          nuevoArray[i].NOMBRE = nuevoArray[i][nombre];
          nuevoArray[i].IDENTIFICACION = nuevoArray[i][indentificacion];
        }
      }

      return nuevoArray;
    },

    goTab: function ( event ) {
      event.preventDefault();
    },

    typeof: function ( value, type ) {
      return typeof value === type;
    },

    // Util for returning a random key from a collection that also isn't the current key
    newRandomKey: function (coll, key, currentKey) {
      var randKey;
      do {
        randKey = coll[Math.floor(coll.length * Math.random())][key];
      } while (randKey == currentKey);
      return randKey;
    },

    /**
   *
   * Verifica si 'value' esta vacio.
   *
   */
    isEmpty: function(value) {
        return (typeof value === "undefined" || value === null);
    },

    /*
      Funcion que abre una nueva ventana con el cotenido de una plantilla
      Esta funcion compila el html de la plantilla a html puro, es decir si tiene ng-repeat o cualquier directiva angular aqui se compila
      de otra forma se mostraria tal cual aparece el html
      Parametros:
      templateUrl: La url de la plantilla
      scope: El $scope del controlador, util para la compilacion
      title: El titulo de la ventana
    */
    openWindow: function ( templateUrl, scope, title ) {
      var markup = '<!DOCTYPE HTML>' +
        '<html>' +
          '<head>' +
            '<title>' + title + '</title></head>' +
            '<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">' +
          '<body>';

      var tpl = $templateCache.get( templateUrl );
      var compile = $compile( '<div>' + tpl + '</div>' )(scope);

      $timeout( function () {
        markup += '<div class="container">' + compile.html() + '</div>';
        markup += "</body></html>";
        var newwindow = window.open("", title, "resizable,scrollbars,status");
        newwindow.document.write( markup );
        newwindow.document.close();
        $timeout( function () {
          // newwindow.print();
          // newwindow.close();
        }, 0);
      }, 0);
    },

    reporteTabla: function (columns,rows,orientacion,tamanio, titulo) { //orientacion puede ser 'l'=landscape, 'p'= portrait, tamaño puede ser 'letter' o 'legal'
      if (orientacion=='p' ) {value=400;} else {value=850;}
      var headerImgData = 'data:image/jpg;base64,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';
      var doc = new jsPDF(orientacion, 'pt', tamanio );
      var fecha_hora = $filter( 'date' )(new Date(),'dd/MM/yyyy HH:mm' );
              var header = function ( data ) {
                    doc.setFontSize(14);
                    doc.setTextColor(40);
                    doc.setFontStyle( 'normal' );
                    doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 10, 40, 40, 40);
                    doc.text(titulo, data.settings.margin.left + 45, 35);
                    doc.setFontSize(7);
                    doc.text("Sistema de Gestión de tribunales", data.settings.margin.left+45, 45);
                    doc.text("Fecha de Reporte: " + fecha_hora, data.settings.margin.left+value, 45);

                };

                var totalPagesExp = "{total_pages_count_string}";
                var footer = function ( data ) {
                    var str = "Página " + data.pageCount;
                    // Total page number plugin only available in jspdf v1.0+<
                    if (typeof doc.putTotalPages === 'function' ) {
                        str = str + " de " + totalPagesExp;
                    }
                    doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
                };

                var options = {
                    theme: 'striped',
                    beforePageContent: header,
                    afterPageContent: footer,
                    margin: {top: 55, left:5, right:5, button: 10},
                    styles: {overflow: 'linebreak',
                            font: 'times',
                            fontSize:9,
                            rowHeight: 15},
                    headerStyles: {
                            overflow: 'linebreak',
                            font: 'times',
                            fontSize: 8,
                            rowHeight: 19},
                };
                doc.autoTable(columns, rows, options);

                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function' ) {
                    doc.putTotalPages(totalPagesExp);
                }

                doc.save( 'reporte.pdf' );


    },

    crearPDF : function ( idexpediente, datosCaratula  ) {
      var consolidado= datosCaratula.cabecera[0].COMPETENCIA + ' - ' + datosCaratula.cabecera[0].MATERIA + ' - '  +  datosCaratula.cabecera[0].TIPO_PROCESO;
      var content = [
        {
          columns: [
            {
              width: 'auto',
              stack: [{
                image: 'data:image/jpg;base64,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',
                width:50
              }]
            },
            {
              width: '*',
              style: 'header',
              text: datosCaratula.cabecera[0].DESPACHO + ' - ' + datosCaratula.cabecera[0].DEPARTAMENTO ,
            }
          ]
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 2 }]
        },
        {
          style: 'normal',
          text: '                       ',
          fontSize:16
        },
        {
          style: 'normal',
          text: consolidado
        },
        {
          style: 'normal',
          text: '                       ',
          fontSize:16
        },
        {
          style: 'expediente',
          text: 'Número Único'
        },
        {
          style: 'expediente',
          text:  datosCaratula.cabecera[0].TIPO_EXPEDIENTE + ' ' +  datosCaratula.cabecera[0].NUMERO_UNICO
        },
        {
          style: 'normal',
          text: '                       ',
          fontSize:16
        },
        {
          style: 'segundo',
          text: 'Cargo'
        },
        {
          style: 'segundo',
          text: datosCaratula.cabecera[0].CARGO_SORTEADO
        },
        {
          style: 'normal',
          text: '                       ',
          fontSize:16
        },
        {
          style: 'segundo',
          text: 'Fecha Creación'
        },
        {
          style: 'segundo',
          text: datosCaratula.cabecera[0].FECHA_REGISTRO
        },
        {
          style: 'normal',
          text: '                       ',
          fontSize:16
        },
      ];
      for (var i = 0; i < datosCaratula.sujetos.length; i++) {
         content.push({
            style: 'normal',
            text: '                       ',
            fontSize: 6
          });
          content.push({
            style: 'actor1',
            text: datosCaratula.sujetos[i].TIPO_VINCULACION
          });
          content.push({
            style: 'actor',
            text: '                   '+ datosCaratula.sujetos[i].NOMBRES
          });
      };
      content.push({
        style: 'normal',
        text: '                       ',
        fontSize: 16
      });

      content.push({
        style: 'actor1',
        text: 'Referencias:'
      });

      for (var i = 0; i < datosCaratula.referencias.length; i++) {
          content.push({
              style: 'actor',
              text: datosCaratula.referencias[i].INSTITUCION  + ' ' + datosCaratula.referencias[i].CODIGO + ' '  +  datosCaratula.referencias[i].REF_ANIO + ' '  +  datosCaratula.referencias[i].REF_NUMERO
            });
      };
      // agregar informacion de observaciones
      content.push({
        style: 'normal',
        text: '                       ',
        fontSize: 22
      });

      content.push({
        style: 'actor1',
        text: 'Observaciones: '
      });

      content.push({
        style: 'actor',
        text: datosCaratula.cabecera[0].OBSERVACIONES ? datosCaratula.cabecera[0].OBSERVACIONES : ''
      });

      content.push({
        style: 'normal',
        text: '                       ',
        fontSize: 22
      });

      content.push({
        style: 'normal',
        text: '                       ',
        fontSize: 22
      });

      content.push({
        style: 'normal',
        text: '                       ',
        fontSize: 22
      });

      content.push({
        style: 'normal',
        text: '                       ',
        fontSize: 22
      });

      content.push({
        style: 'normal',
        text: '                       ',
        fontSize: 22
      });

      content.push({
        style: 'normal',
        text: '                       ',
        fontSize: 22
      });

      content.push({
        style: 'normal',
        text: '                       ',
        fontSize: 22
      });

      var docDefinition = {
        pageSize: 'legal',

        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'portrait',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 60, 30, 40, 20 ],

        footer: {
          columns: [
            { style: 'foot', text: 'Fecha y hora de Asignación: ' + datosCaratula.cabecera[0].FECHA_REGISTRO},
            { style: 'foot', text: 'Ingresado por: ' + datosCaratula.cabecera[0].DESPACHO_CREACION }
          ]
        },

        content: content,

        styles: {
          header: {
            fontSize: 20,
            bold: true,
            alignment: 'center'
          },
          expediente: {
            fontSize: 22,
            bold: true,
            alignment: 'center'
          },
          normal: {
            fontSize: 16,
            alignment: 'center'
          },
          segundo: {
            fontSize: 13,
            bold:true,
            alignment: 'center'
          },
          actor1: {
            fontSize: 12,
            bold:true,
            alignment: 'left'
          },
          actor: {
            fontSize: 12,
            alignment: 'left'
          },
          foot: {
            fontSize: 7,
            bold: true,
            alignment: 'left'
          }
        }
      };

      pdfMake.createPdf(docDefinition).download( idexpediente + '.pdf' );
    },

    crearPDF2 : function () {
      var titulo1 = [
        { text: 'SECRETARIA EJECUTORA DEL CONSEJO DE LA CARRERA JUDICIAL: Unidad de ingreso y movilidad judicial',
          style: 'tableHeader2', colSpan: 4, alignment: 'center' },
        {}, {}, {},
        { text: 'CRITERIO 1: PERTINENCIA REGIONAL Y CULTURAL',
          style: 'tableHeader', colSpan: 5, alignment: 'center' },
        {}, {}, {}, {},
        { text: 'CRITERIO 2: ANTIGUEDAD Y EXPERIENCIA',
          style: 'tableHeader', colSpan: 3, alignment: 'center' },
        {}, {},
        { text: 'CRITERIO 3: ACADEMIA Y CAPACITACIÓN',
          style: 'tableHeader', colSpan: 5, alignment: 'center' },
        {}, {}, {}, {},
        { text: 'CRITERIO 4: DISCIPLINA Y CONDUCTA',
          style: 'tableHeader', colSpan: 2, alignment: 'center' },
        {},
        { text: 'OTROS',
          style: 'tableHeader', colSpan: 2, alignment: 'center' },
        {}
      ];
      var titulo2 = [
        { text: 'No.', style: 'tableHeader', alignment: 'center' }, //1
          { text: 'Foto', style: 'tableHeader', alignment: 'center' }, //2
          { text: 'Apellidos', style: 'tableHeader2', alignment: 'center' }, //3
          { text: 'Nombres', style: 'tableHeader2', alignment: 'center' }, //4
          { text: 'Cargo actual', style: 'tableHeader2', alignment: 'center' }, //5
          { text: 'Región del cargo actual', style: 'tableHeader2', alignment: 'center' }, //6
          { text: 'Lugar de nacimiento', style: 'tableHeader2', alignment: 'center' }, //7
          { text: 'Residencia de su nucleo familiar', style: 'tableHeader2', alignment: 'center' }, //8
          { text: 'Idiomas Mayas', style: 'tableHeader2', alignment: 'center' }, //9
          { text: 'Tiempo como Juez', style: 'tableHeader2', alignment: 'center' }, //10
          { text: 'Tiempo Judicatura actual', style: 'tableHeader2', alignment: 'center' }, //11
          { text: 'Juzgados donde ha ejercido el cargo', style: 'tableHeader2', alignment: 'center' }, //12
          { text: 'No. PROFI/PROFINS', style: 'tableHeader2', alignment: 'center' }, //13
          { text: 'Año egreso PROFI/PROFINS', style: 'tableHeader2', alignment: 'center' }, //14
          { text: 'Nota PROFI/PROFINS', style: 'tableHeader2', alignment: 'center' }, //15
          { text: 'Horas/UCI', style: 'tableHeader2', alignment: 'center' }, //16
          { text: 'Estudios de postgrado', style: 'tableHeader2', alignment: 'center' }, //17
          { text: 'Historial Disciplinario JDJ', style: 'tableHeader2', alignment: 'center' }, //18
          { text: 'Antejuicios', style: 'tableHeader2', alignment: 'center' }, //19
          { text: 'Nota de evaluación del desempeño', style: 'tableHeader2', alignment: 'center' }, //20
          { text: 'Colegiado activo', style: 'tableHeader2', alignment: 'center' } //21
      ];
      var tituloConcurso = [
        { text: 'Concurso interno CCJ-27-2016', style: 'tableHeader3', colSpan: 21, alignment: 'center' },
        {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
      ];
      var tituloPlaza = [
        { text: '1. PLAZA A PROVEER: JUEZ DE INSTANCIA DEL MUNICIPIO DE SAN MARTIN SACATEPEQUEZ, DEPARTAMENTO DE QUETZALTENANGO - SUR-OCCIDENTE -', style: 'tableHeader', colSpan: 21, alignment: 'center' },
        {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
      ];
      var filaUno = [
        {text: '1', style: 'font8'},
        { image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAAEAlgCWAAD//gAfTEVBRCBUZWNobm9sb2dpZXMgSW5jLiBWMS4wMQD/2wCEABgREhUSDxgVFBUcGhgdJT4oJSIiJUw2OS0+Wk9fXVhPV1VjcI95Y2qHa1VXfKp+h5SYoKKgYHiwvK6cu4+doJoBGhwcJSAlSSgoSZpmV2aampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqamv/EAaIAAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKCwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+foRAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/AABEIAawBrAMBEQACEQEDEQH/2gAMAwEAAhEDEQA/ANWgAoAKAFoAKAEoAWgAoASgBaACgAoAKACgAoAKACgAoAKACgAoASgBaACgBKAELgUCFXkcUBdC/hQAUDCgAoAKACgAoAKACgAoAKAEoAWgAoASgBaACgAoASgAoAKACgAoAKACgAoASgBaAFoAKACgAoAKACgAoASgBaACgAoAKACgAoAKACgBKAFoAKACgBsjqi7mIAoE2QG/tgCfMye2BQF2U31gg/LDj6mmKzI31Z3QqqhGPegLFR7ucnmUnFIdhnnyB96SOD9adxkq384bPmt+dFxWRYTVZlxuwwB9KQWLa6pFn5lZfpzQLUsw3EU67onB9u9A79yXtQMWgAoAKACgAoAKACgBKAFoASgAoAWgBMUAFABQAUAFABigAoAKACgAoAKAFoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoASgBaAIJruCE4Zxn0HWiwr9iq+qxnKxK271bpRYNTPuLt5eJDmgLFXfjocUDEL5oAZmgAyaADOKADNAChjQA/cfWgBUkZDlSQfagDQi1SYABsOP1oFY0ra7juchcqw7GgL23J6Bi0AJQAtABQAUAFABQAUAJQAtABQAUAJQAUALQAlABQAUAFABQAUALQAUAFABQAUAFABQAUAFABQAUAFABQAUAFACGgAJAGScCgNjHv76R3KRDCDv60ybGdljzSKEJIoAYWJoAbQAUAFABQAUAFAC0AGaADNADgaAHCQg5BIPtQBft9TljZQ/7xO+etArGvDMk6b42yKAuSUDCgBaACgAoAKACgAoAKACgAoAKAEoAWgAoASgAoAWgBKAFoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAilkWJCzHAoEzIu715PlHC+nrQFikzk0DGFqAG5oAQigA7UAJQAtABQAuKAFxQAhFABtoAMUAFABQAZoAtWtw8EgZDj1HrQBvwTpcJvQ/UelAiWgYUAFABQAUAFABQAUAFABQAUAJQAtABQAUAFACUAFAC0AFABQAUAFABQAUAFABQAUAFABQAUAFABQBHLIsSF2PAoE2Yl5dyTnkAKOgphYps5PWkMYTQAlAAKAA0AFAC4oASgBRQAoGaAHAZoAXbQMCOOlADWoENNACUAFACg4oAt2dybeQMOncUAdBHIsqB0IKnvQJMfQMKACgAoAKACgAoAKACgAoAKACgAoAKACgBKACgBaACgAoAKACgAoAKACgAoAKACgAoAKACgBjsEQsTgAUCZiXd000h5+XsKYJFJmJpDGE0AJQAdqAAdKAFoAUCgB+zIyKBjStAhQM0AP2EUh2FCZoCwu3FFx2F25HFICMgD60xWGEUxDSKAEoAXigBVOAaAL2n3v2Z8N/q26+1ArG6rBlBByKB3HUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAlAC0AFABQAUAFABQAUAFABQAUAFABQAUAJQBj6hdl3KKflHpTEjNZqQxtACUAJQAUAFAD1UmgCZU45pXGO8sjkUrlWFxnrQFg8sUXCw4J2pXCwuygdhCntQFhooEDLu+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",
          width: 40, height: 40
        },
        {text: 'GONZALEZ ANDRINO', style: 'font7'},
        {text: 'SULMA YOVANA', style: 'font7'},
        {text: 'SECRETARIO DE INSTANCIA DEL MUNICIPIO DE ANTIGUA GUATEMALA, DEPARTAMENTO DE IZABAL', style: 'font7'},
        {text: 'CENTRAL', style: 'font7'},
        {text: '03/08/1972 ANTIGUA GUATEMALA, SACATEPEQUEZ', style: 'font7'},
        {text: 'MUNICIPIO DE SANTA LUCIA COTZUMALGUAPA, DEPARTAMENTO DE ESCUINTLA', style: 'font7'},
        {stack: [{text : 'No indica', style: 'font7'}, {text : 'No indica2', style: 'font7'}]},
        {text: 'Años: 1, meses: 11', style: 'font7'},
        {text: 'Años: 1, meses: 11', style: 'font7'},
        {text: 'SECRETARIA  DE LA CORTE SUPREMA DE JUSTICIA', style: 'font7'},
        {text: 'PFIJP-14-15', style: 'font7'},
        {text: '2015', style: 'font7'},
        {text: '90.88', style: 'font7'},
        {text: '324', style: 'font7'},
        {text: 'Maestria en Criminología', style: 'font7'},
        {text: 'No tiene denucnias ni sanciones vigentes en JDJ', style: 'font7'},
        {text: 'No tiene Antejuicios', style: 'font7'},
        {text: '100', style: 'font7'},
        {text: '4565', style: 'font7'}
      ];

      var dataBody = [];
      dataBody.push(titulo1);
      dataBody.push(titulo2);
      dataBody.push(tituloConcurso);
      dataBody.push(tituloPlaza);
      dataBody.push(filaUno);
      console.log(dataBody);
      var content = [
				{
						style: 'tableExample',
						color: '#444',
						table: {
            //size column 1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20  21
								widths: [ 15, 40, 45, 45, 50, 50, 50, 50, 50, 25, 25, 60, 25, 20, 20, 20, 60, 50, 50, 25, 30 ],
								headerRows: 2,
								body: dataBody
						}
				}
      ];

      var docDefinition = {
        pageSize: 'legal',

        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'landscape',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 5, 50, 5, 20 ],

        footer: {
          columns: [
            { style: 'foot', text: 'Fecha y hora de generación: ' + new Date()}
          ]
        },

        content: content,

        styles: {
          header: {
            fontSize: 20,
            bold: true,
            alignment: 'center'
          },
          font7: {
            fontSize: 7,
            bold: true,
            alignment: 'center'
          },
          font8: {
            fontSize: 8,
            bold: true,
            color: 'black'
          },
          font9: {
            fontSize: 9,
            bold: true,
            color: 'black'
          },
          font10: {
            fontSize: 10,
            bold: true,
            color: 'black'
          },
          font11: {
            fontSize: 11,
            bold: true,
            color: 'black'
          },
          font12: {
            fontSize: 12,
            bold: true,
            color: 'black'
          },
          font13: {
            fontSize: 16,
            bold: true,
            color: 'black'
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableHeader: {
            bold: true,
            fontSize: 8,
            color: 'black'
          },
          tableHeader2: {
            bold: true,
            fontSize: 7,
            color: 'black'
          },
          tableHeader3: {
            bold: true,
            fontSize: 12,
            color: 'black'
          }
        }
      };

      pdfMake.createPdf(docDefinition).download( 'test.pdf' );
    },

    generarReporteParticipantes : function ( convocatoriaId, dataConvocatoria ) {
      var titulo1 = [
        { text: 'SECRETARIA EJECUTORA DEL CONSEJO DE LA CARRERA JUDICIAL: Unidad de ingreso y movilidad judicial',
          style: 'tableHeader2', colSpan: 4, alignment: 'center' },
        {}, {}, {},
        { text: 'CRITERIO 1: PERTINENCIA REGIONAL Y CULTURAL',
          style: 'tableHeader', colSpan: 5, alignment: 'center' },
        {}, {}, {}, {},
        { text: 'CRITERIO 2: ANTIGUEDAD Y EXPERIENCIA',
          style: 'tableHeader', colSpan: 3, alignment: 'center' },
        {}, {},
        { text: 'CRITERIO 3: ACADEMIA Y CAPACITACIÓN',
          style: 'tableHeader', colSpan: 5, alignment: 'center' },
        {}, {}, {}, {},
        { text: 'CRITERIO 4: DISCIPLINA Y CONDUCTA',
          style: 'tableHeader', colSpan: 2, alignment: 'center' },
        {},
        { text: 'OTROS',
          style: 'tableHeader', colSpan: 2, alignment: 'center' },
        {}
      ];
      var titulo2 = [
          { text: 'No.', style: 'tableHeader', alignment: 'center' }, //1
          { text: 'Foto', style: 'tableHeader', alignment: 'center' }, //2
          { text: 'Apellidos', style: 'tableHeader2', alignment: 'center' }, //3
          { text: 'Nombres', style: 'tableHeader2', alignment: 'center' }, //4
          { text: 'Cargo actual', style: 'tableHeader2', alignment: 'center' }, //5
          { text: 'Región del cargo actual', style: 'tableHeader2', alignment: 'center' }, //6
          { text: 'Lugar de nacimiento', style: 'tableHeader2', alignment: 'center' }, //7
          { text: 'Residencia de su nucleo familiar', style: 'tableHeader2', alignment: 'center' }, //8
          { text: 'Idiomas Mayas', style: 'tableHeader2', alignment: 'center' }, //9
          { text: 'Tiempo como Juez', style: 'tableHeader2', alignment: 'center' }, //10
          { text: 'Tiempo Judicatura actual', style: 'tableHeader2', alignment: 'center' }, //11
          { text: 'Juzgados donde ha ejercido el cargo', style: 'tableHeader2', alignment: 'center' }, //12
          { text: 'No. PROFI/PROFINS', style: 'tableHeader2', alignment: 'center' }, //13
          { text: 'Año egreso PROFI/PROFINS', style: 'tableHeader2', alignment: 'center' }, //14
          { text: 'Nota PROFI/PROFINS', style: 'tableHeader2', alignment: 'center' }, //15
          { text: 'Horas/UCI', style: 'tableHeader2', alignment: 'center' }, //16
          { text: 'Estudios de postgrado', style: 'tableHeader2', alignment: 'center' }, //17
          { text: 'Historial Disciplinario JDJ', style: 'tableHeader2', alignment: 'center' }, //18
          { text: 'Antejuicios', style: 'tableHeader2', alignment: 'center' }, //19
          { text: 'Nota de evaluación del desempeño', style: 'tableHeader2', alignment: 'center' }, //20
          { text: 'Colegiado activo', style: 'tableHeader2', alignment: 'center' } //21
      ];
      var dataBody = [];
      dataBody.push(titulo1);
      dataBody.push(titulo2);
      var i = 0;
      var j = 0;
      for (i = 0; i < dataConvocatoria.length; i++) {
        var tituloConcurso = [
          { text: dataConvocatoria[i].concurso, style: 'tableHeader3', colSpan: 21, alignment: 'center' },
          {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
        ];
        dataBody.push(tituloConcurso);
        var tituloPlaza = [
          { text: dataConvocatoria[i].plazaSolicitada, style: 'tableHeader3', colSpan: 21, alignment: 'center' },
          {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
        ];
        dataBody.push(tituloPlaza);
        for (j = 0; j < dataConvocatoria[i].participantes.length; j++) {
          var item = [];
          item.push({text: '' + (j + 1), style: 'font7', alignment: 'left'});
          item.push(
            {
              image: "data:image/png;base64," + dataConvocatoria[i].participantes[j].foto,
              width: 40, height: 40
            }
          );
          item.push({
            text: dataConvocatoria[i].participantes[j].apellidos,
            style: 'font7', alignment: 'left'
          });
          item.push({
            text: dataConvocatoria[i].participantes[j].nombres,
            style: 'font7', alignment: 'left'
          });
          item.push({
            text: dataConvocatoria[i].participantes[j].cargoActual,
            style: 'font7', alignment: 'left'
          });
          item.push({
            text: dataConvocatoria[i].participantes[j].regionActual,
            style: 'font7', alignment: 'left'
          });
          item.push({
            text: dataConvocatoria[i].participantes[j].lugarFechaNacimiento,
            style: 'font7', alignment: 'left'
          });
          item.push({
            text: dataConvocatoria[i].participantes[j].residenciaFamiliar,
            style: 'font7', alignment: 'left'
          });

          var stack = [];
          for (var k = 0; k < dataConvocatoria[i].participantes[j].idiomas.length; k++) {
            stack.push({
              text: dataConvocatoria[i].participantes[j].idiomas[k].idiomaDesc,
              style: 'font7', alignment: 'left'
            });
          }
          item.push({ stack : stack });
          item.push({
            text: 'Años: ' + dataConvocatoria[i].participantes[j].aniosJuez + ', meses: ' + dataConvocatoria[i].participantes[j].mesesJuez,
            style: 'font7', alignment: 'left'
          });
          item.push({
            text: 'Años: ' + dataConvocatoria[i].participantes[j].aniosJudicatura + ', meses: ' + dataConvocatoria[i].participantes[j].mesesJudicatura,
            style: 'font7', alignment: 'left'
          });
          stack = [];
          for (var k = 0; k < dataConvocatoria[i].participantes[j].lugaresEjercido.length; k++) {
            stack.push({
              text: dataConvocatoria[i].participantes[j].lugaresEjercido[k].dependenciaDesc,
              style: 'font7', alignment: 'left'
            });
          }
          item.push({ stack : stack });
          item.push({
            text: dataConvocatoria[i].participantes[j].noProfi,
            style: 'font7', alignment: 'left'
          });
          item.push({
            text: '' + dataConvocatoria[i].participantes[j].anioProfi,
            style: 'font7', alignment: 'left'
          });
          item.push({
            text: '' + dataConvocatoria[i].participantes[j].notaProfi,
            style: 'font7', alignment: 'left'
          });
          item.push({
            text: '' + dataConvocatoria[i].participantes[j].horasUCI,
            style: 'font7', alignment: 'left'
          });
          stack = [];
          for (var k = 0; k < dataConvocatoria[i].participantes[j].postgrado.length; k++) {
            stack.push({
              text: dataConvocatoria[i].participantes[j].postgrado[k].gradoAcademicoDesc + ': ' + dataConvocatoria[i].participantes[j].postgrado[k].descripcion,
              style: 'font7', alignment: 'left'
            });
          }
          item.push({ stack : stack });
          stack = [];
          for (var k = 0; k < dataConvocatoria[i].participantes[j].denuncias.length; k++) {
            stack.push({
              text: dataConvocatoria[i].participantes[j].denuncias[k].denuncia,
              style: 'font7', alignment: 'left'
            });
          }
          item.push({ stack : stack });
          stack = [];
          for (var k = 0; k < dataConvocatoria[i].participantes[j].antejuicios.length; k++) {
            stack.push({
              text: dataConvocatoria[i].participantes[j].antejuicios[k].anio + ': ' + dataConvocatoria[i].participantes[j].antejuicios[k].estatusAntejuicio,
              style: 'font7', alignment: 'left'
            });
          }
          item.push({ stack : stack });
          item.push({
            text: '' + dataConvocatoria[i].participantes[j].notaEvaluacion,
            style: 'font7', alignment: 'left'
          });
          item.push({
            text: '' + dataConvocatoria[i].participantes[j].colegiado,
            style: 'font7', alignment: 'left'
          });
          dataBody.push(item);
        }
      }
      var content = [
				{
						style: 'tableExample',
						color: '#444',
						table: {
            //size column 1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20  21
								widths: [ 15, 40, 45, 45, 50, 50, 50, 50, 50, 25, 25, 60, 25, 20, 20, 20, 60, 50, 50, 25, 30 ],
								headerRows: 2,
								body: dataBody
						}
				}
      ];

      var docDefinition = {
        pageSize: 'legal',

        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: 'landscape',

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [ 5, 50, 5, 20 ],

        footer: {
          columns: [
            {
              style: 'foot',
              text: 'Fecha y hora de generación: ' + new Date()
            }
          ]
        },

        content: content,

        styles: {
          header: {
            fontSize: 20,
            bold: true,
            alignment: 'center'
          },
          font7: {
            fontSize: 7,
            bold: true,
            alignment: 'center'
          },
          font8: {
            fontSize: 8,
            bold: true,
            color: 'black'
          },
          font9: {
            fontSize: 9,
            bold: true,
            color: 'black'
          },
          font10: {
            fontSize: 10,
            bold: true,
            color: 'black'
          },
          font11: {
            fontSize: 11,
            bold: true,
            color: 'black'
          },
          font12: {
            fontSize: 12,
            bold: true,
            color: 'black'
          },
          font13: {
            fontSize: 16,
            bold: true,
            color: 'black'
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableHeader: {
            bold: true,
            fontSize: 8,
            color: 'black'
          },
          tableHeader2: {
            bold: true,
            fontSize: 7,
            color: 'black'
          },
          tableHeader3: {
            bold: true,
            fontSize: 12,
            color: 'black'
          }
        }
      };

      pdfMake.createPdf(docDefinition).download( convocatoriaId + '.pdf' );
    },




    reporteNombramiento : function (item){
      var fechaImpresion = $filter('date')(new Date(),'dd/MM/yyyy HH:mm');
      var comisionados = item.frDetNombramientos;
      var lugares = item.frLugarNombramientos;

      var imgCheck='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAXCAYAAAD+4+QTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAF/SURBVEhLvZUrk4MwFIX7n1BROBQKh8KtQuGqVtVF7R9A4VAoXBUOhcKhULgq3NnLO6VJlrAzZIZhpgW+c8993XDBuV3AwBukKxPcv3z4vuEVcRSdWu4KabMQzLJgWTY8I4gHJ8zQjowOBffB7Aj59MN4JkibIiAAWx8+YyIBHh6JHITSJYBGSJeH9IeLuD7z8TkCEbCAvp94LZF0ZJVlhcg0vqrxuwgWAAtIdL/ZdR7yN2DNiQzS1wkiP0Iyq/mM5BhACenrGAGbEyiEvYGOAxSQCj8LQOLvWKayJEvFCCX8blePigulKIKqxhigyYlC7QIU70IEfZ1LO3/qE2kJHwCJFg0NTTbz6rNENBBNkw2R7HNQ8bHTT0AUIFmS/wfZgVRVdAziI210s+uFOk+RN9Oo2J++eOjtAjWfS366vBwHmvlpkYWMIHc8JR+Y98nWG8wxXFi0ezx7mA4MYSYsEUGpsBnJjuyBwBkUzSPl4N32IsSleoRfv+PNc3HsjV+D0UQWmAU7dQAAAABJRU5ErkJggg==';
      var imgNoCheck='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAYAAADafVyIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAD4SURBVEhL7VWtDoMwGOSdqqrqUKi6KtxUFY4HwPUdUHOoKtzUXBUKN4XCoXC3si3jbxuUBLGEJnXfd3e9NHcedj7eFL82Z8QnASEcb6SQl81M7oig0hKUEBDCwJ0IONhrL8rrEUlPUGUI7RCVGtUW2xoDxa04msC0PcCboM6lVR4gLbegP3faa2IxCFTxicDaQ4iEHr/Qja1QB8GCY4dFi1/qsOgfLBLIbos6vw78zCKUKQIbVIEymKf6GtIKWlKbRTEuA4BBH7QoFH+EFfUdy8Z2B2ddj1BIPQ77SaM1KHWC0O+UdAvrL+MRUjOP4lllrjHDZWZ3gjuN4EXD8NqWJAAAAABJRU5ErkJggg==';

      var img1='';
      var img2='';
      if (item.vehPropio==true){
        img1=imgCheck;
        img2=imgNoCheck;
      }else {
        img1=imgNoCheck;
        img2=imgCheck;
      }

      var placa='';

      if (item.placaoj!=null){
        placa=item.placaoj;
      }

      var footer ='NOTAS:';
          footer+='\n1. Los viáticos y gastos derivados de la comisión serán realizados con cargo a la partida presupuestaria de esta dependencia.'
          footer+='\n2. para dar trámite a la presente solicitud, debe adjuntar fotocopia de NIT.'
      var textoBaja='';
      
      if (item.ESTADO=='0'){
        textoBaja='Dio de baja: '  + item.MODIFICADOR +', con fecha y hora: '+ $filter('date')(new Date(item.FECHA_MODIFICA),'dd/MM/yyyy HH:mm');
        footer=textoBaja;
      }

      function buildTableBody(data,columns,titles,header) {
          var body = [];

          if (header==1)
          body.push(titles);

          data.forEach(function(row) {
              var dataRow = [];
              //.toString()
              columns.forEach(function(column) {
                if (Array.isArray(row[column])){
                  var hijo=table (
                          row[column],
                          ['abreviado','noFormulario'],
                          ['Documento','Formulario'],
                          ['auto','auto'],
                          1
                  );
                  dataRow.push(hijo)
                }else{
                  dataRow.push(row[column]);
                }
              })
              body.push(dataRow);
          });

          return body;
      }

      function table(data, columns,titles,widths,header) {
          return {
              style: 'tabla',
              table: {
                  widths: widths,
                  headerRows: 1,
                  body: buildTableBody(data,columns,titles,header)
              }
          };
      }

    var tablaComisionados =

      table  (
                comisionados,
                ['empleadoDsc','cargoDesc','renglon','sueldo','nit','frDetFormularios','firma'],
                ['Nombre','Cargo','Renglon','Sueldo','NIT','Fomularios Entragados','Firma'],
                ['auto','auto','auto','auto','auto','auto',100],
                1
             );


      var caratula = {

        //          left   up     rigth   donw
        //border: [false, false, false, false]

         content: [
           {
      			style: 'tabla',
      			table: {
      				widths: [100, 200, 190],
      				//headerRows: 2,
      				// keepWithHeaderRows: 1,
      				body: [

                [
                    {
                      border: [true, true, true, true],
                      rowSpan: 3,
                      image: 'data:image/jpg;base64,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',
                      width:70,
                      height: 70,
                      style: 'header'
                    },
                    {
                        text:'',border: [false, true, false, false],
                    },
                    {
                        text:'',border: [true, true, true, false],
                    }
                ],
      					[
                  {
                    text:'', border: [true, true, true, true],
                  },
                  {
                    text:'ORGANISMO JUDICIAL',border: [false, false, true, false],
                  },
                  {
                    text:'Nombramiento No.\n'+item.anioCorrelativo, style:'textc' ,border: [true, false, true, false],
                  },
                ],
                [
                  {
                    text:'', border: [true, true, false, false],
                  },
                  {
                    text:'NOMBRAMIENO DE COMISIÓN',border: [false, false, false, true],
                  },
                  {
                    text:'Dependencia\n'+item.dependenciaDsc, style:'textc'  ,border: [true, true, true, true],
                  },
                ],
      				]
      			}
      		},
          {
            text:'\nSe nombra a:',style:'textl'
          },

          tablaComisionados,
           {
             text:'\nPara realizar comisión en :',style:'textl'
           },
           table  (
                     lugares,
                     ['departamentoDsc','municipioDsc'],
                     ['',''],
                     ['50%','50%'],
                     0
                  ),
            {
              text:'\nPor el peíodo comprendido: del ' +moment(item.fechaInicial).format("DD/MM/YYYY")+' al '+ moment(item.fechaFinal).format("DD/MM/YYYY") ,style:'textl'
            },
            {
              text:'\nMotivo de Comsión' ,style:'textl'
            },
            {
        			style: 'tabla',
        			table: {
                widths:['100%'],
        				body: [
        						    [
                          {text:item.motivo ,style:'textl'}
                        ]
        				]
        			}
        		},
            {
              text:'\nUtilizará:\n\n' ,style:'textl'
            },
            {
              columns:[
               {
                  image: img1,
                  width:10,
                  height: 10,
                  style:'textlmin'
                },
                {
                  text:'Vehículo de la Institución Placas: ' + placa ,style:'textlmin'
                },
                {
                  image: img2,
                  width:10,
                  height: 10,
                  style:'textlmin'
                },
                {
                  text:' Otros',style:'textlmin'
                },
              ]
            },
            {
              text:'\nLugar y Fecha: '+item.fechaEmision ,style:'textl'
            },
            {
              text:'\n\n\n\n\n' ,style:'textl'
            },
            {
              text:'______________________________________' ,style:'textc'
            },
            {
              text:item.autorizadorDsc ,style:'textc'
            },



          ],

          footer: {
                   text: footer, style: 'textl',margin: [10,0,10, 10]
              },

         styles: {
           header: {
             fontSize: 10,
             bold: true,
             alignment: 'center',
           },
           subheader: {
             fontSize: 14,
             bold: true,
             alignment: 'center',
           },
           subheaderCur: {
             fontSize: 14,
             bold: true,
             alignment: 'center',
             italics:true
           },
           title: {
             fontSize: 18,
             bold: true,
             alignment: 'left'
           },
           negrita: {
             bold: true
           },
           tabla: {
             fontSize: 8 ,
             bold: false,
             alignment: 'left',
             margin: [0, 5, 0, 15]
             //margin: [5,5,300,5]
           },
           tablaheader: {
             fontSize: 12,
             bold: true,
             alignment: 'center'
           },
           text: {
             fontSize: 10,
             alignment: 'justify'
           },
           textb: {
             fontSize: 10,
             alignment: 'left',
             bold: true
           },
           textbc: {
             fontSize: 10,
             alignment: 'center',
             bold: true
           },
           textc: {
             fontSize: 10,
             alignment: 'center',
             bold: false
           },
           textl: {
             fontSize: 10,
             alignment: 'left',
             bold: false
           },
           textlmin: {
             fontSize: 8,
             alignment: 'left',
             bold: false
           },
           textNumPagina: {
             fontSize: 8,
             alignment: 'left',
             margin: [40,15,0,0]
           },
           textFecha: {
             fontSize: 8,
             alignment: 'right',
             margin: [0,0,30,100] //left   up     rigth   donw
           },
         }
       };
    //pdfMake.createPdf(caratula).download('requisitos_'+item.solicitudId+'.pdf');


    if(item.estado==0){
      caratula.watermark= {text: 'Nombramiento Inactivo', color: 'gray', opacity: 0.3, bold: true, italics: false};

      /*{text: 'Nombramiento\nInactivo', color: 'gray', opacity: 0.3, bold: true, italics: false};*/
    }

    pdfMake.createPdf(caratula).open();


    }

  };
}]);
