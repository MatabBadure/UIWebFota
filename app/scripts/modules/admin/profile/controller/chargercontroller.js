'use strict';

angular.module('hillromvestApp')
  .controller('chargercontroller', [ '$scope','chargerservice',
    function ( $scope, chargerservice) {

    	$scope.refreshData = function()
    	{
    			chargerservice.getData().then(function(response){
    			$scope.data = response;
        		}).catch(function(response){
        	});
    	};

}]);