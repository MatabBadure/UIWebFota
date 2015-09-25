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

  .directive('activeTab', ['$location', function(location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            var className = attrs.activeTab;
            var path = attrs.href;
            path = path.substring(1); //hack because path does bot return including hashbang
            scope.location = location;
            scope.$watch('location.path()', function(newPath) {
                if (path === newPath) {
                    element.addClass(className);
                } else {
                    element.removeClass(className);
                }
            });
        }
    };
}]);
