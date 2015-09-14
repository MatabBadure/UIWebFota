'use strict';

/**
 * @ngdoc directive
 * @name mobileNumber
 * @description Directive is for Adding mobile number using input box in form, and needs to add ng-model for using it.
 *
 */

angular.module('hillromvestApp')
.directive('mobileNumber', function(){
  return {
    restrict: 'E',
    require: "?ngModel",
    scope: true,
    template: "<input type='text' name='mobilePhone' validate-on-blur ng-model='value' ng-maxlength=20 mask='(999)-999-9999' ng-change='onChange()'>",
    link: function(scope, element, attrs, ngModel){
      if (!ngModel) return;

      scope.onChange = function(){
        ngModel.$setViewValue(scope.value);
      };

      ngModel.$render = function(){
        scope.value = ngModel.$modelValue;
      };
    }
  };
});