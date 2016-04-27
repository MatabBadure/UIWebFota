angular.module('hillromvestApp')
  .directive("validateOnBlur", [function() {
    var ddo = {
      restrict: "A",
      require: "ngModel",
      scope: {},
      link: function(scope, element, attrs, modelCtrl) {
        element.on('blur', function() {
          modelCtrl.$showValidationMessage = modelCtrl.$dirty;
          scope.$apply();
        });
        element.on('focus', function() {
          modelCtrl.$showValidationMessage = false;
          scope.$apply();
        });
      }
    };
    return ddo;
  }])

  .directive('pwCheck', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
  }])

  .directive('validateOnKeyPress', [function () {
    var ddo = {
      restrict: "A",
      require: "ngModel",
      scope: {},
      link: function (scope, element, attrs, modelCtrl) {
        element.on('keydown', function() {
          modelCtrl.$showValidationMessage = modelCtrl.$dirty;
          scope.$apply();
        });
        element.on('keyup', function() {
          modelCtrl.$showValidationMessage = modelCtrl.$dirty;
          scope.$apply();
        });
      }
    }; 
    return ddo;
  }])

angular.module('hillromvestApp')
  .directive('maxFloat', ['$parse', function ($parse) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {     
      scope.$watch(attrs.maxFloat, function (newValue, oldValue){          
          var digiTed = "";
          if(newValue){
            digiTed = newValue.replace(/[^0-9\.]/g, '');              
            digiTed = (digiTed === ".") ? "0.": (digiTed > 0 ? (digiTed.toString().indexOf(".") === -1 ? parseFloat(digiTed).toString() : digiTed) : (digiTed.toString().indexOf(".") === -1 && digiTed == 0)? 0 : digiTed );            
            //  get only two digits after decimal, if available              
            digiTed = (digiTed && digiTed.toString().indexOf(".") !== -1) ? ((digiTed.split(".")[1]).toString().length > 2? digiTed.substring(0, digiTed.length-1) : digiTed ): digiTed;            
            //check for max value  
            if(attrs.maxLimit){
              digiTed = (digiTed.length > 0) ? ((digiTed <= parseInt(attrs.maxLimit) )? digiTed : oldValue ) : (digiTed === 0 ? 0: null) ;
            }else if(attrs.maxBound){
              digiTed = (digiTed.length > 0) ? ((digiTed < parseInt(attrs.maxBound) )? digiTed : oldValue ) : (digiTed === 0 ? 0: null) ;
            }
                               
          }           
          try{
            digiTed = digiTed.toString().replace(/^0+(?!\.|$)/, '');
          }catch(e){
            digiTed = digiTed.toString();
          }          
          $parse(attrs.maxFloat).assign(scope,digiTed);             
      })
    }
  };
}]);