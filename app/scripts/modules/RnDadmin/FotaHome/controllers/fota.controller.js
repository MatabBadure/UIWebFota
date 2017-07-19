'use strict';


angular.module('hillromvestApp')
.controller('fotaController',['$scope', '$location','$state', 'clinicadminService', 'notyService', '$stateParams', 'clinicService', 'UserService', 'StorageService','$timeout', 'commonsUserService', 'TimService','searchFilterService',
  function($scope, $location,$state, clinicadminService, notyService, $stateParams, clinicService, UserService, StorageService, $timeout, commonsUserService,TimService,searchFilterService) {

      $scope.init = function(){
        console.log("hello fota admin");
      };
        
           $scope.init();  
            
  
   }]);