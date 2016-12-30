'use strict';

angular.module('hillromvestApp')
.directive('editAnnouncement', function() {
  return {
      templateUrl: 'scripts/modules/common/console/announcements/views/announcementEdit.html',
      restrict: 'E',
      controller: ['$scope', '$location', '$rootScope' ,'$state',function ($scope, $location , $rootScope, $state) {
        console.log("announcement passed");
        console.log($scope.announcement);
        $scope.isActive = function(tab) {
          var path = $location.path();
          if (path.indexOf(tab) !== -1) {
            return true;
          } else {
            return false;
          }
        };
        $scope.redirectBack = function(){
      if($rootScope.userRole === "ADMIN"){
        $state.go('adminSurveyReport');
      }else if($rootScope.userRole === "ACCT_SERVICES"){ 
        $state.go('rcadminAnnouncements');
      }
      };  
      }]
    }
});
