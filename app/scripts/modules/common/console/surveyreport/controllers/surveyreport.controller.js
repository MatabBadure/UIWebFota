'use strict';
angular.module('hillromvestApp')
.controller('surveyReportController',['$scope', '$state', 'patientsurveyService', 'dateService', '$timeout', 'notyService',
	function($scope, $state, patientsurveyService, dateService, $timeout, notyService) {
		
		$scope.calculateDateFromPicker = function(picker) {
	    $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();	      
		  $scope.toTimeStamp = (new Date().getTime() < new Date(picker.endDate._d).getTime())? new Date().getTime() : new Date(picker.endDate._d).getTime();
	    $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
	    $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');

	    $scope.serverFromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-');
	    $scope.serverToDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-');
	    if ($scope.fromDate === $scope.toDate ) {
	      $scope.fromTimeStamp = $scope.toTimeStamp;
	    }	      
	  };

	  $scope.calculateTimeDuration = function(durationInDays) {
      $scope.toTimeStamp = new Date().getTime();
      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
      $scope.serverFromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-');
	    $scope.serverToDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-');
    };

		$scope.opts = {
			maxDate: new Date(),
			format: patientDashboard.dateFormat,
			eventHandlers: {'apply.daterangepicker': function(ev, picker) {  
					$scope.calculateDateFromPicker(picker);     				
					$scope.customDateRangeView();
				},
				'click.daterangepicker': function(ev, picker) {
					$("#dp1cal").data('daterangepicker').setStartDate($scope.fromDate);
					$("#dp1cal").data('daterangepicker').setEndDate($scope.toDate);
				}
			},
			opens: 'left'
		}

		$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};

		$scope.customDateRangeView = function(){
			$scope.getSurveyReport($scope.surveyType, $scope.serverFromDate, $scope.serverToDate);
		};
		
		$scope.init = function(){
			if($state.current.name === 'adminSurveyReport' || $state.current.name === 'rcddminSurveyReport' || $state.current.name === 'associateSurveyReport'){
				$scope.viewType = 'graph';
				$scope.calculateTimeDuration(5);
				$scope.switchSurvey(1);
			}
		};

		$scope.getSurveyReport = function(type, fromDate, toDate){
			$scope.surveyGridView = [];
			patientsurveyService.getSurveyGridReport(type, fromDate, toDate).then(function(response){
				$scope.count = response.data.count;
				$scope.surveyGridView = response.data.surveyGridView;
			}).catch(function(response){
				notyService.showError(response);
			});
		};

		$scope.switchView = function(view){
			$scope.viewType = view;
			$scope.switchSurvey($scope.surveyType);
		};

		$scope.switchSurvey = function(type){
			$scope.surveyType = type;
			if(type === 3){
				$scope.viewType = 'grid';
			}
			if($scope.viewType === 'graph'){
				$scope.getGraphSurveyReport(type, $scope.serverFromDate, $scope.serverToDate);
			}else if($scope.viewType === 'grid'){
				$scope.getSurveyReport(type, $scope.serverFromDate, $scope.serverToDate);
			}
		};

		$scope.showComments = function(survey, index){
			if(survey.noCount !== 0 || index === 6){
				$scope.selectedSurvey = survey;
				$scope.surveyComments = [];
				patientsurveyService.getSurveyComments(survey.id).then(function(response){
					$scope.showCommentModal = true;
					$scope.surveyComments = response.data;
				}).catch(function(response){
					notyService.showError(response);
				});
				$scope.showCommentModal = true;
			}
		};

		$scope.hideComments = function(){
			$scope.showCommentModal = false;
		};

		$scope.getGraphSurveyReport = function(type, fromDate, toDate){
			patientsurveyService.getGraphSurveyGridReport(type, fromDate, toDate).then(function(response){
				$scope.graphSurvey = response.data; 
				$scope.drawCategoryChartForNonDay();
			}).catch(function(response){
				notyService.showError(response);
			});
		};

		$scope.drawCategoryChartForNonDay = function(){
			var chart = Highcharts.chart('fiveDaysSurvey', {
				chart:{
					type: 'column',
					zoomType: 'xy',
					backgroundColor: "#e6f1f4"
				},
        title: {
          text: ''
        },  	
		    xAxis:{
					type: 'category',
					categories: $scope.graphSurvey.xAxis.categories,
					labels:{
			      style: {
				      color: '#525151',
				      //font: '10px Helvetica',
				      fontWeight: 'bold'
				    }
			    }
				},
				yAxis: {
					gridLineColor: '#FF0000',
		      gridLineWidth: 0,
		      lineWidth:1,
		      min: 0,
		      title: {
		        text: 'No. of Users',
		        style: {
			        color: '#525151',
			        font: '10px Helvetica',
			        fontWeight: 'bold'
			      }
		      },
		      allowDecimals:false,
		      labels:{
		       	style: {
			        color: '#525151',
			        //font: '10px Helvetica',
			        fontWeight: 'bold'
			      }
		      }
		    },
        legend: {
		      align: 'center',
			    verticalAlign: 'bottom',
			    x: 0,
			    y: 0
		    },
		    plotOptions: {
		      series: {
		        events: {
		          legendItemClick: function () {
		         		var self = this,
		         		allow = false;
		                        
		            if(self.visible) {
		              $.each(self.chart.series, function(i, series) {
		                if(series !== self && series.visible) {
		                 	allow = true;
		                }
		              });
		              if(!allow){
		               	notyService.showMessage(notyMessages.minComplianceError, notyMessages.typeWarning );
		              }
		              return allow;
		            }
		          }
		        }
		      }
		    },
				tooltip: {
					crosshairs: [{
		        dashStyle: 'solid',
		        color: '#b4e6f6'
		        },
		      false],
					formatter: function() {
						if($scope.surveyType === 1){
							var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  this.x +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
				    	$.each(this.points, function(i, point) {
				      	s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ point.series.color +';padding:5px 0;width:80%;float:left"> ' + point.series.name + '</div> ' 
				        + '<div style="padding:5px;width:10%"><b>' + point.y + '</b></div></div>';
				    	});
				    	s += '</div>';
						}else if($scope.surveyType === 2){
							var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  this.x +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
				    	$.each(this.points, function(i, point) {
				      	s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ point.series.color +';padding:5px 0;width:80%;float:left"> ' + point.series.name + '</div> ' 
				        + '<div style="padding:5px;width:10%"><b>' + point.y + '</b></div></div>';
				    	});
				    	s += '</div>';
						}
		        return s;
			    },
			    hideDelay: 0,
					useHTML: true,
   				shared: true
				},
				series: $.extend(true, [], $scope.graphSurvey.series),
				loading: true,
				size: {}
		    });//.setSize(1140, 400);
		};

		$scope.init();
	}]);
