/*@Controller loginanalytics
* User having role Admin/RCAdmin/Associate can access this page.
* This page represents a statisticalanalytical report that how many users are logging in to the application 
*
**/

'use strict';
angular.module('hillromvestApp')
.controller('loginAnalyticsController',['$scope', '$state', 'loginAnalyticsConstants', 'dateService', 'exportutilService',
	function($scope, $state, loginAnalyticsConstants, dateService, exportutilService) {	
		/*
		* default legends and their accessibility
		*/
		$scope.defaultLegends = function(){
			$scope.legends = {};			
			$scope.legends.isAll = true;
			$scope.legends.isPatient = true;
			$scope.legends.isHCP = true;
			$scope.legends.isClinicAdmin = true;
			$scope.legends.isCaregiver = true;
			$scope.disableLegends = {};
			$scope.disableLegends.all = true;
			$scope.disableLegends.patient = false;
			$scope.disableLegends.hcp = false;
			$scope.disableLegends.clinicadmin = false;
			$scope.disableLegends.caregiver = false;
			$scope.timerange = {};
			$scope.timerange.day = true;
			$scope.timerange.week = false;
			$scope.timerange.month = false;
			$scope.timerange.year = false;
			$scope.timerange.customTime = false;
		};
		/* Innitiates the required variables and calls the required APIs for login analytics page*
		* By default 'All' is selected and so the all other legends as well.
		* By default user should not be able to deselect all the legends, so 'All will be disabled'
		*/	
		$scope.analyticsInit = function(){
			$scope.defaultLegends();
			//$scope.dayView();
			// call the API or get the mock data
		};

		/*
		* provides the number of legends enabled excluding the legend 'all'
		*/
		function getSelectedLegendsCount(){
			var count = 0;			
			count = ($scope.legends.isPatient) ? ++count : count;
			count = ($scope.legends.isHCP) ? ++count : count;
			count = ($scope.legends.isClinicAdmin) ? ++count : count;
			count = ($scope.legends.isCaregiver) ? ++count : count;
			return count;
		};

		/* if only one legend is left as selected, make it disabled so that user won't be able to deselect it.
		* or else make all the lengends accessible
		*/
		$scope.validateLegends = function(legend, count){
			if(count === 1){				
				$scope.disableLegends.patient = ($scope.legends.isPatient) ? true : false;
				$scope.disableLegends.hcp = ($scope.legends.isHCP) ? true : false;
				$scope.disableLegends.clinicadmin = ($scope.legends.isClinicAdmin) ? true : false;
				$scope.disableLegends.caregiver = ($scope.legends.isCaregiver) ? true : false;
				// show the meesage saying at least on elegend should be enabled.
			} else{
				$scope.disableLegends.patient = false;
				$scope.disableLegends.hcp = false;
				$scope.disableLegends.clinicadmin = false;
				$scope.disableLegends.caregiver = false;
			}			 
		};

		/*
		* Legend 'All' will always be selected, unless any other legend is made unselected*/
		$scope.changeLegends = function(legend){				
			var count = getSelectedLegendsCount();	
			$scope.validateLegends(legend, count);			
			if(legend === loginAnalyticsConstants.legends.ALL){
				$scope.defaultLegends();				
			}else{
				if(count === 4){					
					$scope.defaultLegends();
				}else{					
					$scope.legends.isAll = false;
					$scope.disableLegends.all = false;					
				}

			}		
		};

		$scope.drawCategoryChart = function(){
			Highcharts.chart('container', {				
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
					categories: $scope.categoryChartData.xAxis.categories//,
					//crosshair: true
					},
				yAxis: {
					gridLineColor: '#FF0000',
		            gridLineWidth: 0,
		            lineWidth:1,
		            min: 0,
		            title: {
		                text: 'No. Of Logins'
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
		            hideDelay: 5, //tooltip will get hidden in 5 mili seconds on mouse event
		            borderWidth: 1,
		            borderColor: '#4E95C4',
		            backgroundColor: "#ffffff",//rgba(255,255,255,0)
		            //shadow: false,
					headerFormat: '<span style="font-size:15px; font-weight: bold; padding-bottom: 5px;">{point.key}</span><table>',				
					pointFormat: '<tr style="font-size:10px; font-weight: bold;"><td style="color:{point.color};padding:0">{series.name}: </td>' +
					'<td style="padding:0"><b>{point.y}</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true
				},
				series: $scope.categoryChartData.series,
				loading: false,
				size: {}
		    });
		};

		$scope.drawDateRangeChart = function(){
			Highcharts.chart('container', {				
				chart:{
					type: 'spline',
					zoomType: 'xy',					
                    backgroundColor:'#e3ecf7'
				},
		        title: {
		            text: ''
		        },		      	
		      	xAxis:{		      		
					type: 'datetime',
					crosshair: true,					
		            title: {
		                text: 'Date'
		            },
		            minPadding: 0,
		            maxPadding: 0,
		            startOnTick: false,
		            endOnTick: false,
		            labels:{
		            	formatter:function(){
		              	return Highcharts.dateFormat('%e. %b',this.value);
		              }
		            }	
				},

				yAxis: {
					gridLineColor: '#FF0000',
		            gridLineWidth: 0,
		            lineWidth:1,
		            min: 0,
		            title: {
		                text: 'No. Of Logins'
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
		                          return allow;
		                        }
		                    }
		                }
		            }
		        },
				tooltip: {
					headerFormat: '<span style="font-size:14px">{point.key}</span><table>',				
					pointFormat: '<tr><td style="color:{point.color};padding:0">{series.name}: </td>' +
					'<td style="padding:0"><b>{point.y}</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true
				},
				series: $scope.categoryChartData.series,
				loading: false,
				size: {}
		    });
		};

		$scope.dayView = function(){ 
			$scope.categoryChartData = loginAnalyticsData.dayData;	
			$scope.drawCategoryChart();	
			
		};

		$scope.weekView = function(){
			$scope.categoryChartData = loginAnalyticsData.weekData;
			$scope.drawCategoryChart();
		};

		$scope.monthView = function(){			
			$scope.categoryChartData = loginAnalyticsData.monthData;
			$scope.drawCategoryChart();				
		};

		$scope.yearView = function(){
			$scope.categoryChartData = loginAnalyticsData.yearData;
			$scope.drawCategoryChart();
		};

		$scope.customDateRangeView = function(){
			$scope.categoryChartData = loginAnalyticsData.customDateRangeData;
			angular.forEach($scope.categoryChartData.series, function(series, key) {
			  angular.forEach(series.data, function(data, index) {
			  	$scope.categoryChartData.series[key].data[index].x = convertToTimestamp(data.x);
			  });
			});			
			$scope.drawDateRangeChart();
		};

		$scope.downloadGraphAsPdf = function(){
			exportutilService.exportLoginAnalyticsAsPDF();			      		
		};

		function isChrome(){
		    var userAgent =navigator.userAgent;
		    var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
		    for(var key in browsers) {
		        if (browsers[key].test(userAgent)) {
		            return key;
		        }
		   };
		   return 'unknown';
		  }
		  
			function convertToTimestamp(date){
		      if(date && date.indexOf("/") > -1 && date.indexOf(" ") > -1 ){
		        var dateTime = date.split(" ");
		        var startDate = dateTime[0].split("/"); // turning it from MM/DD/YYYY HH:MM:SS to timestamp
		        var formattedDate = startDate[2] + "-" + startDate[0] + "-" + startDate[1] + " " + dateTime[1];
		        if(isChrome().indexOf("chrome") !== -1){
		          return new Date(formattedDate).getTime();
		        }else{
		          return new Date(formattedDate.replace(/\s/, 'T')).getTime();
		        }
		        
		      }
		  }
	

		/* This method initiates the required methods required for a specific route*/
		$scope.init = function(){
			if($state.current.name === 'adminLoginAnalytics' || $state.current.name === 'rcadminLoginAnalytics' || $state.current.name === 'associatesLoginAnalytics'){
				$scope.analyticsInit();
			}
		};

		$scope.init();
	}]);
