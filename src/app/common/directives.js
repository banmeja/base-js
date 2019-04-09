angular.module( 'app.directives', [
  'app.utilsService'
])
.directive( 'numbersOnly', [function () {
   return {
     require: 'ngModel',
     link: function (scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push( function (inputValue) {
           if (inputValue == undefined) return '';
           var transformedInput = inputValue.replace(/[^0-9\.]/g, '' ); /*/^\d*\.?\d*$/*/
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }

           return transformedInput;
       });
     }
   };
}])
.directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if (inputValue == undefined) inputValue = '';
          var capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
          }
          return capitalized;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  })

.directive('price', [function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            attrs.$set('ngTrim', "false");

            var formatter = function(str, isNum) {
                str = String( Number(str || 0) / (isNum?1:100) );
                str = (str=='0'?'0.0':str).split('.');
                str[1] = str[1] || '0';
                return str[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + '.' + (str[1].length==1?str[1]+'0':str[1]);
            }
            var updateView = function(val) {
                scope.$applyAsync(function () {
                    ngModel.$setViewValue(val || '');
                    ngModel.$render();
                });
            }
            var parseNumber = function(val) {
                var modelString = formatter(ngModel.$modelValue, true);
                var sign = {
                    pos: /[+]/.test(val),
                    neg: /[-]/.test(val)
                }
                sign.has = sign.pos || sign.neg;
                sign.both = sign.pos && sign.neg;

                if (!val || sign.has && val.length==1 || ngModel.$modelValue && Number(val)===0) {
                    var newVal = (!val || ngModel.$modelValue && Number()===0?'':val);
                    if (ngModel.$modelValue !== newVal)
                        updateView(newVal);

                    return '';
                }
                else {
                    var valString = String(val || '');
                    var newSign = (sign.both && ngModel.$modelValue>=0 || !sign.both && sign.neg?'-':'');
                    var newVal = valString.replace(/[^0-9]/g,'');
                    var viewVal = newSign + formatter(angular.copy(newVal));

                    if (modelString !== valString)
                        updateView(viewVal);

                    return (Number(newSign + newVal) / 100) || 0;
                }
            }
            var formatNumber = function(val) {
                if (val) {
                    var str = String(val).split('.');
                    str[1] = str[1] || '0';
                    val = str[0] + '.' + (str[1].length==1?str[1]+'0':str[1]);
                }
                return parseNumber(val);
            }

            ngModel.$parsers.push(parseNumber);
            ngModel.$formatters.push(formatNumber);
        }
    };
}])

.directive('compile', ['$compile', function ($compile) {
  return function(scope, element, attrs) {
    scope.$watch(
      function(scope) {
        // watch the 'compile' expression for changes
        return scope.$eval(attrs.compile);
      },
      function(value) {
        // when the 'compile' expression changes
        // assign it into the current DOM
        element.html(value);
        // compile the new DOM and link it to the current
        // scope.
        // NOTE: we only compile .childNodes so that
        // we don't get into infinite loop compiling ourselves
        $compile(element.contents())(scope);
      }
    );
  };
}])

.directive( 'lettersOnly', [function () {
  return {
   require: 'ngModel',
   link: function (scope, element, attrs, modelCtrl) {
     modelCtrl.$parsers.push( function (inputValue) {
      if (inputValue == undefined) return '';
      var transformedInput = inputValue.replace(/[^a-zA-Z\.\,\u0020\u00E1\u00E9\u00ED\u00F3\u00FA\u00D1\u00F1]/g, '' );
      if (transformedInput!=inputValue) {
        modelCtrl.$setViewValue(transformedInput);
        modelCtrl.$render();
      }

      return transformedInput;
     });
   }
  };
}])

.directive( 'validateCero', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$validators.validateCero = function (modelValue, viewValue) {
        var regex = /^[1-9][0-9]*/;

        if( regex.test(modelValue) ) {
          return true;
        } else {
          return false;
        }

      };
    }
  };
}])

.directive( 'validateYear', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$validators.validateYear = function (modelValue, viewValue) {
        if( !modelValue || modelValue == '' || (modelValue <= new Date().getFullYear() && modelValue>1899 ) ) {
          return true;
        } else {
          return false;
        }

      };
    }
  };
}])

.directive( 'uibDatepickerPopup', ['dateFilter', 'uibDatepickerPopupConfig', function (dateFilter, uibDatepickerPopupConfig) {
    return {
        restrict: 'EAC',
        priority: 1,
        require: '^?ngModel',
        link: function (scope, element, attrs, ngModel) {
            // http://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off
            // http://stackoverflow.com/questions/24198669/angular-bootsrap-datepicker-date-format-does-not-format-ng-model-value

            var dateFormat = attrs.uibDatepickerPopup || uibDatepickerPopupConfig.datepickerPopup;

            var setupDate = function (date) {
              if ( angular.isDate(date) ) {
                // se convierte a formato yyyy/MM/dd para que no reste un dia
                if ( dateFormat == 'dd/MM/yyyy' ) {
                  return new Date(dateFilter(date, 'yyyy/MM/dd' ));
                } else {
                  return new Date(dateFilter(date, 'yyyy/MM/dd HH:mm' ));
                }
              } else if ( date != '' ) {
                var temp = date.split( '-' );
                if ( temp.length > 1 ) {
                  date = temp[0] + '/' + temp[1] + '/' + temp[2];
                }
                return new Date( date );
              } else {
                return '';
              }
            }

            ngModel.$formatters.push( function (value) {
              // return dateFilter(value, dateFormat);
              // return dateFilter(new Date(value), dateFormat);
              // return value == '' ? value : dateFilter(new Date(value), dateFormat);
              return !value || value == '' ? value : new Date(setupDate(value));
            });

            ngModel.$validators.date = function (modelValue, viewValue) {

              var value = modelValue || viewValue;

              if (!attrs.ngRequired && !value) {
                return true;
              }

              if (angular.isNumber(value)) {
                value = new Date(value);
              }

              if (!value) {
                return true;
              }
              else if (angular.isDate(value) && !isNaN(value)) {

                if ( attrs.maxDate ) {
                  if ( setupDate( value ).getTime() <= setupDate( attrs.maxDate.substr(1,10) ).getTime() ) {
                    return true
                  } else {
                    return false;
                  }
                } else {
                  return true;
                }

                return true;
              }
              else if (angular.isString(value)) {

                if ( angular.isDate(setupDate(value)) ) {
                  if ( attrs.maxDate ) {
                    if ( setupDate( value ).getTime() <= setupDate( attrs.maxDate.substr(1,10) ).getTime() ) {
                      return true
                    }
                  } else {
                    return true;
                  }
                }

                return false;

                // return angular.isDate(setupDate(value));
              }
              else {
                return false;
              }
            };

        }
    };
}])

.directive( 'ckEditor', [function () {
  return {
      require: '?ngModel',
      link: function (scope, elm, attrs, ngModel) {

        var ck = CKEDITOR.replace(elm[0]);

        ck.on( 'pasteState', function () {
          scope.$apply( function () {
            ngModel.$setViewValue(ck.getData());
          });
        });

        ngModel.$render = function (value) {
          ck.setData(ngModel.$modelValue);
        };
      }
  };
}])

.directive( 'fileInput', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
      elm.bind( 'change', function () {
        $parse(attrs.fileInput).assign(scope, elm[0].files);
        scope.$apply();
      })
    }
  }
}])

.directive( 'uiGrid', ['$parse', function ($parse) {
  return {
    //restrict: 'A', // EAC, E (element)
    /*scope: {
      uiGrid: '='
    },*/
    link: function (scope, elm, attrs, ngModel) {
      /*var getHeight = function (gridOptions) {
        var totalRows = gridOptions.data.length;
        var height = 30;
        var rowHeight = 25;
        var headerHeight = 29;
        var footerHeight = 32;
        var scrollX = 12;
        var extraRowHeight = 30;

        height = ((totalRows >= gridOptions.paginationPageSizes[0] ? gridOptions.paginationPageSizes[0] : totalRows) * rowHeight + extraRowHeight + headerHeight + footerHeight + scrollX) + 'px';
        return height
      };

      var parsed = $parse(attrs.uiGrid);

      scope.$watch( function () {
        return $parse(attrs.uiGrid)(scope).data;
      },function (value) {
        if (!value) {
          return ;
        }
        attrs.$set( 'style', 'width: 100%;height:' + getHeight( parsed(scope) ) );
      }, true);

      /*scope.$watch(attrs.uiGrid, function (value) {
        if (!value) {
          return ;
        }
        attrs.$set( 'style', 'width: 100%;height:' + getHeight(elm.isolateScope().uiGrid));
      });*/
    }
  }
}])

// timepickerPop

.factory( 'timepickerState', [function () {
  var pickers = [];
  return {
    addPicker: function (picker) {
      pickers.push(picker);
    },
    closeAll: function () {
      for (var i=0; i<pickers.length; i++) {
        pickers[i].close();
      }
    }
  };
}])

.directive("timeFormat", ['$filter', function ($filter) {
  return {
    restrict : 'A',
    require : 'ngModel',
    scope : {
      showMeridian : '=',
    },
    link : function (scope, element, attrs, ngModel) {
      var parseTime = function (viewValue) {

        if (!viewValue) {
          ngModel.$setValidity( 'time', true);
          return null;
        } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
          ngModel.$setValidity( 'time', true);
          return viewValue;
        } else if (angular.isString(viewValue)) {
          var timeRegex = /^(0?[0-9]|1[0-2]):[0-5][0-9] ?[a|p]m$/i;
          if (!scope.showMeridian) {
            timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          }
          if (!timeRegex.test(viewValue)) {
            ngModel.$setValidity( 'time', false);
            return undefined;
          } else {
            ngModel.$setValidity( 'time', true);
            var date = new Date();
            var sp = viewValue.split(":");
            var apm = sp[1].match(/[a|p]m/i);
            if (apm) {
              sp[1] = sp[1].replace(/[a|p]m/i, '' );
              if (apm[0].toLowerCase() == 'pm' ) {
                sp[0] = sp[0] + 12;
              }
            }
            date.setHours(sp[0], sp[1]);
            return date;
          };
        } else {
          ngModel.$setValidity( 'time', false);
          return undefined;
        };
      };

      ngModel.$parsers.push(parseTime);

      var showTime = function ( data ) {
        parseTime( data );
        var timeFormat = (!scope.showMeridian) ? "HH:mm" : "hh:mm a";
        return $filter( 'date' )(data, timeFormat);
      };
      ngModel.$formatters.push(showTime);
      scope.$watch( 'showMeridian', function (value) {
        var myTime = ngModel.$modelValue;
        if (myTime) {
          element.val(showTime(myTime));
        }

      });
    }
  };
}])

.directive( 'timepickerPop', ['$document', 'timepickerState', function ($document, timepickerState) {
  return {
    restrict : 'E',
    transclude : false,
    scope : {
      inputTime : "=",
      showMeridian : "=",
      disabled : "="
    },
    controller : ['$scope', '$element', function ($scope, $element) {
      $scope.isOpen = false;

      $scope.disabledInt = angular.isUndefined($scope.disabled)? false : $scope.disabled;

      $scope.toggle = function () {
      if ($scope.isOpen) {
        $scope.close();
      } else {
        $scope.open();
      }
      };
    }],
    link : function (scope, element, attrs) {
      var picker = {
          open : function () {
            timepickerState.closeAll();
            scope.isOpen = true;
          },
          close: function () {
            scope.isOpen = false;
          }

      }
      timepickerState.addPicker(picker);

      scope.open = picker.open;
      scope.close = picker.close;

      scope.$watch("disabled", function (value) {
        scope.disabledInt = angular.isUndefined(scope.disabled)? false : scope.disabled;
      });

      /*scope.$watch("inputTime", function (value) {
        if (!scope.inputTime) {
          element.addClass( 'has-error' );
        } else {
          element.removeClass( 'has-error' );
        }
      });*/

      element.bind( 'click', function (event) {
        event.preventDefault();
        event.stopPropagation();
      });

      $document.bind( 'click', function (event) {
        scope.$apply( function () {
          scope.isOpen = false;
        });
      });

    },
    template : "<input type='text' class='form-control' ng-model='inputTime' ng-disabled='disabledInt' time-format show-meridian='showMeridian' data-toggle='dropdown' ng-focus='open()' />"
        + "  <div ng-class='{open:isOpen}'> "
        + "          <div class='dropdown-menu pull-right'> "
        + "            <uib-timepicker ng-model='inputTime' show-meridian='showMeridian'></uib-timepicker>"
        + "           </div> " + "  </div>"
  };
}])

.directive( 'csSelect', [function () {
    return {
        require: '^stTable',
        template: '<input type="checkbox"/>',
        scope: {
            row: '=csSelect'
        },
        link: function (scope, element, attr, ctrl) {

            element.bind( 'click ', function (evt) {
            //element.bind( 'change', function (evt) {
                scope.$apply( function () {
                    ctrl.select(scope.row, 'multiple' );
                });
            });

            scope.$watch( 'row.isSelected', function (newValue, oldValue) {
                if (newValue === true) {
                    element.parent().addClass( 'st-selected' );
                    element.find( 'input' ).attr( 'checked', true); //agregado
                } else {
                    element.parent().removeClass( 'st-selected' );
                    element.find( 'input' ).attr( 'checked',false); //false
                }
            });
        }
    };
}])

.directive( 'rowSelectAll', [function () {
    return {
    require: '^stTable',
    template: '<input type="checkbox">',
    scope: {
      all: '=rowSelectAll',
      selected: '='
    },
    link: function (scope, element, attr) {
      scope.isAllSelected = false;
      element.bind( 'click', function (evt) {
        scope.$apply( function () {
          scope.all.forEach( function (val) {
            val.isSelected = scope.isAllSelected;
          });
        });
      });

      scope.$watchCollection( 'selected', function (newVal) {
        var s = newVal.length;
        var a = scope.all.length;
        if ((s == a) && s > 0 && a > 0) {
          element.find( 'input' ).attr( 'checked', true);
          scope.isAllSelected = false;
        } else {
          element.find( 'input' ).attr( 'checked', false);
          scope.isAllSelected = true;
        }
            });
        }
    };
}])

.directive( 'menuTabset', ['utilsService', function (utilsService) {
  return {
    restrict : 'E',
    transclude : false,
    scope : {
      tabs : "="
    },
    controller : ['$scope', function ( $scope ) {
      $scope.goTab = utilsService.goTab;
      $scope.typeof = utilsService.typeof;
    }],
    link : function ( scope, element, attrs ) {
    },
    templateUrl : 'app/common/menuTabset.tpl.html'
  };
}])

.directive( 'btn', [function () {
  return {
    restrict: 'C',
    link: function (scope, element) {
      if(element.hasClass( 'btn-icon' ) || element.hasClass( 'btn-float' )) {
        Waves.attach(element, ['waves-circle']);
      } else if (element.hasClass( 'btn-light' )) {
        Waves.attach(element, ['waves-light']);
      } else {
        // Waves.attach(element);
        if (!element.hasClass( 'ui-select-toggle' )) {
          Waves.attach(element, ['waves-effect', 'waves-float']);
        }
      }
      Waves.init();
    }
  }
}])

.directive("fileread", [function () {
  return {
    scope: {
      opts: '='
    },
    link: function ($scope, $elm, $attrs) {
      $elm.on('change', function (changeEvent) {
        var reader = new FileReader();

        reader.onload = function (evt) {
          $scope.$apply(function () {
            var data = evt.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            var headerNames = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];
            var data = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);

            $scope.opts.columnDefs = [];
            headerNames.forEach(function (h) {
              $scope.opts.columnDefs.push({ field: h });
            });

            $scope.opts.data = data;

            $elm.val(null);
          });
        };
        reader.readAsBinaryString(changeEvent.target.files[0]);
      });
    }
  }
}]).directive('fileModel', ['$parse', function ($parse) {
  return {
      restrict: 'A',
      link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function(){
              scope.$apply(function(){
                  modelSetter(scope, element[0].files[0]);
              });
          });
      }
  };
}]);