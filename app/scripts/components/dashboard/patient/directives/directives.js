'use strict';

angular.module('hillromvestApp')
.directive('patientNavbar', function() {
  return {
      templateUrl: 'scripts/components/dashboard/patient/views/navbar.html',
      restrict: 'E',
      controller: ['$scope','$location',function($scope, $location) {
        $scope.isActive = function(tab) {
          var path = $location.path();
          if (path.indexOf(tab) !== -1) {
            return true;
          } else {
            return false;
          }
        };
    }]
};
});

angular.module('hillromvestApp')
  .directive('caregiverList', function () {
    return {
      templateUrl: 'scripts/components/dashboard/patient/views/listCaregiver.html',
      restrict: 'E'
    }
  });

angular.module('hillromvestApp')
  .directive('caregiverCreateEdit', function () {
    return {
      templateUrl: 'scripts/components/dashboard/patient/views/createEditCaregiver.html',
      restrict: 'E'
    }
  });

 angular.module('hillromvestApp').directive('loading',   ['$http' ,function ($http)
    {
        return {
            restrict: 'E',
            template: '',//'<div id="maskDiv" style="height: 100%;background:#ccc;opacity:0.8;z-index:2;position: absolute;" class="col-md-16"></div>',//'<div class="loading-spiner"><img src="..." alt="Smiley face"/></div></div>',
            transclude: true,
            scope: {
              loaded: '=loaded'
            },
            link: function (scope, elm, attrs)
            {
              console.log('Loaded value :: ', scope.loaded);
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (v)
                {
                  console.log("elem : ", elm);
                    if(v){
                        scope.loaded = false;
                        console.log('Dude I am making False');
                        elm.show();
                    }else{
                        scope.loaded = true;
                        console.log('Dude I am making True');
                        elm.fadeOut(2000);
                    }
                });
            }
        };

    }]);