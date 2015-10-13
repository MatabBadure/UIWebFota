'use strict';

angular.module('hillromvestApp')
  .controller('caregiverNavbarController',['$scope', '$state', '$location', '$stateParams', function ($scope, $state, $location, $stateParams) {


    $scope.isActive = function(tab) {
      var path = $location.path();
      if (path.indexOf(tab) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    $scope.$on('getPatients', function(event, data) { 
      $scope.patients = data;
    });    
    $scope.$on('getSelectedPatient', function(event, data) { 
      $scope.selectedPatient = data;
    });

    $scope.switchPatient = function(patient){
      $scope.$broadcast('switchPatientCareGiver',patient);
    };

    $scope.switchCaregiverTab = function(state){
      $scope.$broadcast('switchCaregiverTab',state);
    };

    $scope.account = function(){
      $state.go('caregiverProfile', {'caregiverId': $stateParams.caregiverId});
    };
    
  }]);