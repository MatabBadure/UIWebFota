'use strict';
angular.module('hillromvestApp')
.controller('benchmarkingController', ['$scope',
	function($scope) {
		$scope.init = function(){
			$scope.states = [ {name: 'one'}, {name: 'two'}, {name: 'three'}, {name: 'four'}];

			
			$scope.example8model = []; 
			$scope.example8data = [ {id: 1, label: "David"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}];

			$scope.localLang = {
				selectAll       : "Tick all",
				selectNone      : "Tick none",
		    reset           : "Undo all",
		    search          : "Type here to search...",
		    nothingSelected : "Nothing is selected",
		    allSelected : "All Selected"
			}
		};

		$scope.init1 = function(){
			$scope.values = ['one', 'two', 'three'];
			$('#example-getting-started').multiselect({
				includeSelectAllOption: true
			});
		};

		$scope.init();
	}]);