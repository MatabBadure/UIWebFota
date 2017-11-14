'use strict';

angular.module('hillromvestApp')
  .controller('caregiverNavbarController',['$scope','$http', '$stateParams', '$state', '$location',  function ($scope, $http, $stateParams, $state, $location) {


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

  /*  $scope.switchCaregiverTab = function(state){
      $scope.$broadcast('switchCaregiverTab',state);
    };*/
        $scope.switchCaregiverTab = function(status){
         var id = $location.path();
        var res = id.split('/');
         var idnumber = parseFloat(res[res.length-1]);
        //var id = ($stateParams.patientId)?($stateParams.patientId):($scope.selectedPatient.userId);  
        $state.go(status, {'patientId':idnumber});  
    };
    
  }]);