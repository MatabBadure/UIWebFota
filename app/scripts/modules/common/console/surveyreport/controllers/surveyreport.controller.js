'use strict';
angular.module('hillromvestApp')
.controller('surveyReportController',['$scope', '$state', 'patientsurveyService', 'dateService', '$timeout', 'notyService', 'exportutilService', 'pdfServiceConstants', 'surveyGraphConstants',
	function($scope, $state, patientsurveyService, dateService, $timeout, notyService, exportutilService, pdfServiceConstants, surveyGraphConstants) {
		
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
			if($scope.viewType === 'graph'){
				$scope.getGraphSurveyReport($scope.surveyType, $scope.serverFromDate, $scope.serverToDate);
			}else{
				$scope.getSurveyReport($scope.surveyType, $scope.serverFromDate, $scope.serverToDate);
			}
		};
		
		$scope.init = function(){
			if($state.current.name === 'adminSurveyReport' || $state.current.name === 'rcddminSurveyReport' || $state.current.name === 'associateSurveyReport' || $state.current.name === 'customerserviceSurveyReport'){
				$scope.viewType = 'graph';
				$scope.surveyType = 1;
				$scope.calculateTimeDuration(5);
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
			$scope.switchSurvey();
		};

		$scope.switchSurvey = function(type){
			if(type){
				$scope.surveyType = type;
			}
			if($scope.surveyType === 3){
				$scope.viewType = 'grid';
			}
			if($scope.viewType === 'graph'){
				$scope.getGraphSurveyReport($scope.surveyType, $scope.serverFromDate, $scope.serverToDate);
			}else if($scope.viewType === 'grid'){
				$scope.getSurveyReport($scope.surveyType, $scope.serverFromDate, $scope.serverToDate);
			}
		};

		$scope.showComments = function(survey, index){
			if(survey.noCount !== 0 || index === 6){
				$scope.selectedSurvey = survey;
				$scope.selectedSurvey.quesIndex = index;
				$scope.surveyComments = [];
				patientsurveyService.getSurveyComments(survey.id,  $scope.serverFromDate, $scope.serverToDate).then(function(response){
					$scope.showCommentModal = true;
					$scope.surveyComments = response.data;
					$scope.showCommentModal = true;
					$('body').css("overflow","hidden");
				}).catch(function(response){
					notyService.showError(response);
				});
			}
		};

		$scope.hideComments = function(){
			$scope.showCommentModal = false;
			$('body').css("overflow","auto");
		};

		$scope.getGraphSurveyReport = function(type, fromDate, toDate){
			patientsurveyService.getGraphSurveyGridReport(type, fromDate, toDate).then(function(response){
				$scope.graphSurvey = response.data;
				$scope.yMax = 1;
				angular.forEach($scope.graphSurvey.series, function(series, key) {
					if(series.name.toLowerCase() === surveyGraphConstants.legends.YES){
				  		$scope.graphSurvey.series[key].color = surveyGraphConstants.surveycolor.YES;
				  	}
				  	if(series.name.toLowerCase() === surveyGraphConstants.legends.NO){
				  		$scope.graphSurvey.series[key].color = surveyGraphConstants.surveycolor.NO;
				  	}
				angular.forEach(series.data, function(data, index) {
					if(series.name.toLowerCase() === surveyGraphConstants.legends.STRONGLYDISAGREE){
				  		$scope.graphSurvey.series[key].color = surveyGraphConstants.surveycolor.strongly_disagree;
				  	}
				  	if(series.name.toLowerCase() === surveyGraphConstants.legends.SOMEWHATDISAGREE){
				  		$scope.graphSurvey.series[key].color = surveyGraphConstants.surveycolor.somewhat_disagree;
				  	}
					if(series.name.toLowerCase() === surveyGraphConstants.legends.NEUTRAL){
				  		$scope.graphSurvey.series[key].color = surveyGraphConstants.surveycolor.neutral;
				  	}
				  	if(series.name.toLowerCase() === surveyGraphConstants.legends.SOMEWHATAGREE){
				  		$scope.graphSurvey.series[key].color = surveyGraphConstants.surveycolor.somewhat_agree;
				  	}
					if(series.name.toLowerCase() === surveyGraphConstants.legends.STRONGLYAGREE){
				  		$scope.graphSurvey.series[key].color = surveyGraphConstants.surveycolor.strongly_agree;
				  	}
				  	if(series.name.toLowerCase() === surveyGraphConstants.legends.UNABLETOASSESS){
				  		$scope.graphSurvey.series[key].color = surveyGraphConstants.surveycolor.unable_to_assess;
				  	}
						$scope.yMax = ($scope.yMax === 1 && $scope.graphSurvey.series[key].data[index].y === 0) ? 1 : null;
					});
				});
				$scope.count = response.data.count;
				$scope.drawCategoryChartForNonDay(type);
			}).catch(function(response){
				notyService.showError(response);
			});
		};

		$scope.drawCategoryChartForNonDay = function(type){
			var isStackedChart = (type && type == 2)? true : false;
			var stackType = (type && type == 2)? 'normal' : false;			
			var chart = Highcharts.chart('surveyGraph', {
				credits: {
					enabled: false
				},
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
					minRange: 1,
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
					},
					stackLabels: {
		                enabled: isStackedChart,
		                style: {
		                    fontWeight: 'bold',
		                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
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
					pointWidth: 50,
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
			      },
			      column: {
						stacking: stackType,
						dataLabels: {
							enabled: true,
							color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
							style: {
								textShadow: '0 0 3px black'
							},
							formatter: function() {
						        if (this.y != 0 && isStackedChart) {
						          return this.y ;
						        } else {
						          return null;
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

		$scope.exportPDF = function(){
			var surveyHeaderText = ($scope.surveyType === 2 ? pdfServiceConstants.text.surveyForThirtyDays : ($scope.surveyType === 3 ? pdfServiceConstants.text.surveyForNinetyDays : pdfServiceConstants.text.surveyForFiveDays) );			
			exportutilService.exportSurveyAsPDF('surveyGraph', 'surveyCanvas', $scope.fromDate, $scope.toDate, $scope.graphSurvey.surveyQuestions, surveyHeaderText);
		};

		$scope.init();
	}]);
