'use strict';

angular.module('hillromvestApp')
.controller('patientDiagnosticController', ['$scope', '$state', '$rootScope', 'StorageService',
  function ($scope, $state, $rootScope, StorageService) {  
  	console.log("inside patientDiagnosticController....");
  	$scope.init = function(){
  		if($state.current.name === "patientDiagnostic"){
  			$scope.hidePatientNavbar = true;
  			var patientID = StorageService.get('logged').patientID;
  			console.log("patientDiagnostic", patientID);
  			//$state.go("patientDiagnostic");
  		}else if($state.current.name === "CADiagnostic" ){
  			console.log("clinic admin PD");
  		}else if($state.current.name === "HCPDiagnostic"){
  			console.log("hcp PD");
  		}
  	};

  	$scope.init();
  }]);	
	