'use strict';

angular.module('hillromvestApp')
  .controller('chargercontroller', [ '$scope','chargerservice','dateService',
    function ( $scope, chargerservice,dateService) {

    	$scope.refreshData = function()
    	{
                
    			chargerservice.getListDataFromService().then(function(response){
    			$scope.data = response;
                $scope.m = response.data;
                var max = $scope.m.device_data.totalElements;
                $scope.sample(Number(max));
        		}).catch(function(response){
        	});
    	};

    	$scope.sample = function(id)
    	{
    		chargerservice.getClickedDataFromService(id).then(function(response){
                $scope.clickedMessage = response;
                 var text = document.getElementById("viewtxt");
                 text.value = $scope.clickedMessage.data.device_data.deviceData;
                }).catch(function(response){
            });
    		
    	};

        $scope.init = function()
        {
            chargerservice.getListDataFromService().then(function(response){
                $scope.listData = response;
                $scope.listValueForDate = response.data;
                var max = $scope.listValueForDate.device_data.totalElements;
                var k = 0 ;
                $scope.dateArray = [];
                for(var i = 0 ;i<$scope.listValueForDate.device_data.totalElements;i++)
                {
                        var value = $scope.listValueForDate.device_data.content[k][1];
                        var _date = dateService.getDate(value);
                        var _month = dateService.getMonth(_date.getMonth());
                        var _day = dateService.getDay(_date.getDate());
                        var _year = dateService.getYear(_date.getFullYear());
                        var dob = _month + "/" + _day + "/" + _year;
                        k++;
                        $scope.dateArray.push(dob);
                }
                }).catch(function(response){
            });
        };

}]);