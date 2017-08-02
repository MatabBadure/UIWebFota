'use strict';

angular.module('hillromvestApp')
  .controller('clinicsController', [ '$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'Auth','clinicService', 'UserService', 'notyService', 'searchFilterService', 'dateService', 'sortOptionsService', 'StorageService', 'loginConstants', 'commonsUserService', '$q', 'addressService',
    function ($rootScope, $scope, $state, $stateParams, $timeout, Auth,clinicService, UserService, notyService, searchFilterService, dateService,sortOptionsService, StorageService, loginConstants, commonsUserService, $q, addressService) {

    		 $scope.opts = {
                    maxDate: new Date(),
                    format: patientDashboard.dateFormat,
                    dateLimit: {"months": patientDashboard.maxDurationInMonths},
                    eventHandlers: {
                        'apply.daterangepicker': function (ev, picker) {
                            $scope.calculateDateFromPicker(picker);
                            $scope.drawGraph();
                            $scope.selectedDateOption = '';
                        }
                    },
                    opens: 'left'
                };
                $scope.calculateDateFromPicker = function (picker) {
                    $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();
                    $scope.toTimeStamp = new Date(picker.endDate._d).getTime();
                    $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp, hcpDashboardConstants.USdateFormat, '/');
                    $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp, hcpDashboardConstants.USdateFormat, '/');
                    if ($scope.fromDate === $scope.toDate) {
                        $scope.fromTimeStamp = $scope.toTimeStamp;
                    }
                };

 $scope.dates = {startDate: null, endDate: null};


    }]);