'use strict';


angular.module('hillromvestApp')
.controller('devicelistController',['$scope','$rootScope', '$state', '$stateParams', 'patientService',
  function($scope, $rootScope, $state, $stateParams, patientService ){


 $scope.init =function(){
 	var currentRoute = $state.current.name;
 		//alert("Naman");
     patientService.getPatients("","",1,10,"").then(function(response) {
        $scope.patients = response.data;
       //$scope.patient = $scope.patientInfo;
        //$scope.patients = [];
        //$scope.patients.push($scope.patient);
        //alert("Zeba");
 	});
 }
        $scope.init();
 }]);