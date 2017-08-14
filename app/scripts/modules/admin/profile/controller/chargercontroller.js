'use strict';

angular.module('hillromvestApp')
  .controller('chargercontroller', [ '$scope','chargerservice','dateService', '$state',
    function ( $scope, chargerservice,dateService,$state) {
        var max = "";
    	$scope.pageCountOptimus = 0;
        $scope.perPageOptimus = 10;
        $scope.currentPageIndexOptimus = 1;
        $scope.refreshData = function(device)
    	{
            var isrefresh = true;
            if(device === 'charger'){
                $scope.getChargerData(isrefresh);
            }
            else if(device === 'optimus'){
                $scope.getOptimusData(isrefresh);
            }
            else{
                $scope.getChargerData(isrefresh);
            }
                
    			/*chargerservice.getListDataForCharger().then(function(response){
    			$scope.data = response;
                $scope.m = response.data;
                $scope.sample(Number(max+1));
        		}).catch(function(response){
        	});*/
    	};
        $scope.clearData = function(device)
        {
              if(device === 'charger'){
                  var text = document.getElementById("viewtxt");
                  text.innerHTML = '';
            }
            else if(device === 'optimus'){
               var text = document.getElementById("viewtxtoptimus");
                  text.innerHTML = '';
            }
            else{
               var text = document.getElementById("viewtxt");
                  text.innerHTML = '';
            }
                        
                        
        };

    	$scope.sample = function(id,device)
    	{
            var div = "";
            if(device === 'charger'){
                div = 'viewtxt';
                 $scope.clickedDataCharger(id,div);
            }
            else if(device === 'optimus'){
                 div = 'viewtxtoptimus';
                 $scope.clickedDataOptimus(id,div);
            }
            else{
                  div = 'viewtxt';
                  $scope.clickedDataCharger(id,div);
            }
    		
    		
    	};

        $scope.clickedDataCharger = function(id,div){
            chargerservice.getClickedDataForCharger(id).then(function(response){
                $scope.clickedMessage = response;
                $scope.selctedItem = id;
                var i = (Number(max)) - id;
                 var text = document.getElementById(div);
                        text.innerHTML = '<span style="color:blue">' +getDateInUTC($scope.clickedMessage.data.device_data.createdTime) + '</span></br>' +$scope.clickedMessage.data.device_data.deviceData;
                }).catch(function(response){
                    notyService.showError(response.data.ERROR);
            });
        }
        $scope.clickedDataOptimus = function(id,div){
            chargerservice.getClickedDataForOptimus(id).then(function(response){
                console.log("clicked opti:",response);
                $scope.clickedMessage = response;
                $scope.selctedItem = id;
                var i = (Number(max)) - id;
                 var text = document.getElementById(div);
                        text.innerHTML = '<span style="color:blue">' +getDateInUTC($scope.clickedMessage.data.device_data.createdTime) + '</span></br>' +$scope.clickedMessage.data.device_data.deviceData;
                }).catch(function(response){
                    notyService.showError(response.data.ERROR);
            });
        }

        $scope.init = function()
        {
            if ($state.current.name === 'charger') {
                $scope.getChargerData();
            }
            else if ($state.current.name === 'optimus') {
                $scope.getOptimusData()
            }
            else{
                $scope.getChargerData();
            }
           
        };

        $scope.getChargerData = function(isrefresh){
             chargerservice.getListDataForCharger().then(function(response){
                $scope.listData = response;
                $scope.listValueForDate = response.data;
                max = $scope.listValueForDate.device_data.totalElements;
                var k = 0 ;
                $scope.dateArray = [];
                for(var i = 0 ;i<$scope.listValueForDate.device_data.totalElements;i++)
                {
                        var value = ($scope.listValueForDate.device_data.content[k][1]);
                         var dobUtc = getDateInUTC(value);
                         k++;
                        $scope.dateArray.push(dobUtc);
                }
                if(isrefresh){
                 $scope.m = response.data;
                $scope.sample(Number(max+1),'charger');
            }
                }).catch(function(response){
                    notyService.showError(response.data.ERROR);
            });
            };
             $scope.getOptimusData = function(isrefresh){
            chargerservice.getListDataForOptimus(($scope.currentPageIndexOptimus-1),$scope.perPageOptimus).then(function(response){
                console.log("list opti:",response);
                $scope.listDataOptimus = response;
                $scope.listValueForDateOptimus = response.data;
                $scope.maxOptimusRecords = $scope.listValueForDateOptimus.device_data.totalElements;
                $scope.pageCountOptimus = Math.ceil($scope.maxOptimusRecords / $scope.perPageOptimus);
                var k = 0 ;
                $scope.dateArray = [];
                for(var i = 0 ;i<$scope.listValueForDateOptimus.device_data.numberOfElements;i++)
                {
                        var value = ($scope.listValueForDateOptimus.device_data.content[k][1]);
                         var dobUtc = getDateInUTC(value);
                         k++;
                        $scope.dateArray.push(dobUtc);
                }
                 if(isrefresh){
                 $scope.m = response.data;
                $scope.sample(Number(maxOptimusRecords+1),'optimus');
            }
                }).catch(function(response){
                    notyService.showError(response.data.ERROR);
            });
             };

             $scope.searchOptimusRecords = function(track){
                if (track !== undefined) {
            if (track === "PREV" && $scope.currentPageIndexOptimus > 1) {
              $scope.currentPageIndexOptimus--;
            } else if (track === "NEXT" && $scope.currentPageIndexOptimus < $scope.pageCountOptimus) {
              $scope.currentPageIndexOptimus++;
            } else {
              return false;
            }
          } else {
            $scope.currentPageIndex = 1;
          } 
          chargerservice.getListDataForOptimus(($scope.currentPageIndexOptimus-1),$scope.perPageOptimus).then(function(response){
                console.log("list opti:",response);
                $scope.listDataOptimus = response;
                $scope.listValueForDateOptimus = response.data;
                $scope.maxOptimusRecords = $scope.listValueForDateOptimus.device_data.totalElements;
                var k = 0 ;
                $scope.dateArray = [];
                for(var i = 0 ;i<$scope.listValueForDateOptimus.device_data.numberOfElements;i++)
                {
                        var value = ($scope.listValueForDateOptimus.device_data.content[k][1]);
                         var dobUtc = getDateInUTC(value);
                         k++;
                        $scope.dateArray.push(dobUtc);
                }
                $scope.pageCountOptimus = Math.ceil($scope.maxOptimusRecords / $scope.perPageOptimus);
                 if(isrefresh){
                 $scope.m = response.data;
                $scope.sample(Number(maxOptimusRecords+1),'optimus');
            }
                }).catch(function(response){
                    notyService.showError(response.data.ERROR);
            });
             };

        function getDateInUTC(value) {
            var _dateLocal = dateService.getDate(value);
            var _month = _dateLocal.getUTCMonth()+1;
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
            return dob;
        };

        $scope.navigateSandbox = function(navigateTo){
            if(navigateTo === 'charger'){
               $state.go('charger');
            }
            else if(navigateTo === 'optimus'){
            $state.go('optimus');
            }
            else{
            $state.go('charger');
            }
        }


}]);