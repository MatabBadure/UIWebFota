'use strict';

angular.module('hillromvestApp')
  .controller('chargercontroller', [ '$scope','chargerservice','dateService',
    function ( $scope, chargerservice,dateService) {
        var max = "";
    	$scope.refreshData = function()
    	{
                
    			chargerservice.getListDataFromService().then(function(response){
    			$scope.data = response;
                $scope.m = response.data;
                $scope.sample(Number(max));
        		}).catch(function(response){
        	});
    	};
        $scope.clearData = function()
                {
                        
                        var text = document.getElementById("viewtxt");
                        text.innerHTML = '';
                };

    	$scope.sample = function(id)
    	{
    		chargerservice.getClickedDataFromService(id).then(function(response){
                $scope.clickedMessage = response;
                $scope.selctedItem = id;
                var i = (Number(max)) - id;
                 var text = document.getElementById("viewtxt");
                 text.innerHTML = '<span style="color:blue">' +$scope.dateArray[i] + '</span></br>' +$scope.clickedMessage.data.device_data.deviceData;
                 //text.value = $scope.dateArray[i] + "\n\n\n"+$scope.clickedMessage.data.device_data.deviceData;
                }).catch(function(response){
            });
    		
    	};

        $scope.init = function()
        {
            chargerservice.getListDataFromService().then(function(response){
                $scope.listData = response;
                $scope.listValueForDate = response.data;
                max = $scope.listValueForDate.device_data.totalElements;
                var k = 0 ;
                $scope.dateArray = [];
                for(var i = 0 ;i<$scope.listValueForDate.device_data.totalElements;i++)
                {
                        var value = $scope.listValueForDate.device_data.content[k][1];
                        var _dateLocal = dateService.getDate(value);
                        var _date = _dateLocal.toUTCString();
                        var _month = _dateLocal.getUTCMonth();
                        var _day = _dateLocal.getUTCDate();
                        var _year = _dateLocal.getUTCFullYear();
                        var _hours = _dateLocal.getUTCHours();
                        var _minutes = _dateLocal.getUTCMinutes();
                        var _seconds = _dateLocal.getUTCSeconds();
                        if(_hours < 10)
                        {
                            _hours = "0"+_hours;
                        }
                        if(_seconds < 10)
                        {
                            _seconds = "0"+_seconds;
                        }
                        if(_minutes< 10)
                        {
                            _minutes = "0"+_minutes;
                        }
                        var dob = _month + "/" + _day + "/" + _year + " " + _hours + ":" + _minutes + ":" + _seconds;
                        k++;
                        $scope.dateArray.push(dob);
                }
                }).catch(function(response){
            });
        };

}]);