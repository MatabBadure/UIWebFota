'use strict';

angular.module('hillromvestApp')
.directive('activeMenu',['$translate', 'tmhDynamicLocale', function($translate, tmhDynamicLocale) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var language = attrs.activeMenu;

      scope.$watch(function() {
        return $translate.use();
      }, function(selectedLanguage) {
        if (language === selectedLanguage) {
          tmhDynamicLocale.set(language);
          element.addClass('active');
        } else {
          element.removeClass('active');
        }
      });
    }
  };
}]);

// TODO : Remove these directives and include these htmls wherever the respective directives has been used.
angular.module('hillromvestApp')
.directive('navigationBarHcp',[function () {
  return {
    templateUrl: 'scripts/components/navbar/navbarhcp.html',
    restrict: 'E',
  };
}]);
angular.module('hillromvestApp')
.directive('navigationBarClinicadmin',[function () {
  return {
    templateUrl: 'scripts/components/navbar/navbarclinicadmin.html',
    restrict: 'E',
  };
}]);

