'use strict';
angular.module('hillromvestApp')
.controller('patientSurveyController',['$scope', '$state',
	function($scope, $state) {
		$scope.init = function(){
			if($state.current.name === 'patientSurvey'){
				console.log("It is survey page for patients");
			}
		};
		$scope.init();
	}]);
