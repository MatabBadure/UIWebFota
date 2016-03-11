'use strict';
angular.module('hillromvestApp')
.controller('benchmarkingController', ['$scope',
	function($scope) {
		$scope.init = function(){
			$scope.states = [ {name: 'one', 'true': true}, {name: 'two', 'true': true}, {name: 'three', 'true': true}, {name: 'four', 'true': true}];

			$scope.localLang = {
				selectAll       : "Tick all",
				selectNone      : "Tick none",
		    search          : "Type here to search...",
		    nothingSelected : "Nothing is selected",
		    allSelected : "All Selected"
			}
		};

		$scope.init();
	}]);