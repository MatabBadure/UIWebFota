'use strict';
angular.module('hillromvestApp')
.controller('surveyReportController',['$scope', '$state',
	function($scope, $state) {
		$scope.init = function(){
			if($state.current.name === 'adminSurveyReport' || $state.current.name === 'rcddminSurveyReport' || $state.current.name === 'associateSurveyReport'){
				console.log("It is survey report page for admin/rcadmin/associates");
			}
		};

		$scope.init();
	}]);
