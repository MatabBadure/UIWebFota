/*@Controller loginanalytics
* User having role Admin/RCAdmin/Associate can access this page.
* This page represents a statisticalanalytical report that how many users are logging in to the application 
*
**/

'use strict';
angular.module('hillromvestApp')
.controller('loginAnalyticsController',['$scope', '$state', 'loginAnalyticsConstants', 'dateService', 'exportutilService', '$timeout', 'loginanalyticsService', 'notyService', '$rootScope',
	function($scope, $state, loginAnalyticsConstants, dateService, exportutilService, $timeout, loginanalyticsService, notyService, $rootScope) {	
		/*
		* default legends and their accessibility
		*/
		$scope.calculateDateFromPicker = function(picker) {
	      $scope.fromTimeStamp = new Date(picker.startDate._d).getTime();	      
		  $scope.toTimeStamp = (new Date().getTime() < new Date(picker.endDate._d).getTime())? new Date().getTime() : new Date(picker.endDate._d).getTime();
	      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
	      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');	      
	      if ($scope.fromDate === $scope.toDate ) {
	        $scope.fromTimeStamp = $scope.toTimeStamp;
	      }	      
	    };

    	$scope.disableDatesInDatePicker = function() {
	      var datePickerCount = document.getElementsByClassName('input-mini').length;
	      var count = 5;
	      $scope.waitFunction = function waitHandler() {
	         datePickerCount = document.getElementsByClassName('input-mini').length;
	        if(datePickerCount > 0 || count === 0 ) {	          
	          while(datePickerCount >0){
	            document.getElementsByClassName('input-mini')[datePickerCount-1].setAttribute("disabled", "true");
	            datePickerCount --;
	          }
	          return false;
	        } else {
	          count --;
	        }
	        $timeout(waitHandler, 1000);
	      }
	      $scope.waitFunction();
	    };

	    $scope.disableDatesInDatePicker();
		$scope.opts = {
			maxDate: new Date(),
			format: patientDashboard.dateFormat,
			dateLimit: {"months":24},
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

		$scope.resetTimeDurationForToday =function(today){
			if(!today){
				$scope.fromTimeStamp = new Date().getTime();
				$scope.toTimeStamp = new Date().getTime();
				$scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
				$scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');	
			}						
			$scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
		};
		
    	$scope.dates = {startDate: $scope.fromDate, endDate: $scope.fromDate};
    	$scope.dayChart = false;
		$scope.customDateRange = false;
		$scope.timerange = {};
		$scope.timerange.day = false;
		$scope.timerange.week = true;
		$scope.timerange.month = false;
		$scope.timerange.year = false;
		$scope.timerange.customTime = false;
		$scope.durationview = {};
		$scope.durationview.day = true;
		$scope.durationview.week = false;
		$scope.durationview.month = false;
		$scope.durationview.year = false;
		$scope.durationview.custom = false;
		$scope.isGraphLoaded = false;
		$scope.resetTimeDurationForToday();

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
		};
		/* Innitiates the required variables and calls the required APIs for login analytics page*
		* By default 'All' is selected and so the all other legends as well.
		* By default user should not be able to deselect all the legends, so 'All will be disabled'
		*/	
		$scope.analyticsInit = function(){
			$scope.defaultLegends();
			$scope.weekView();
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
				if(legend === loginAnalyticsConstants.legends.PATIENT){
					if(!$scope.legends.isPatient){
						$scope.legends.isPatient = true;
						$scope.dayView();	
					}else{
						notyService.showMessage(notyMessages.minComplianceError, notyMessages.typeWarning );
					}
					$scope.legends.isPatient = true;
					$scope.disableLegends.patient = false;
				}else if(legend === loginAnalyticsConstants.legends.HCP){
					if(!$scope.legends.isHCP){
						$scope.legends.isHCP = true;
						$scope.dayView();	
					}else{
						notyService.showMessage(notyMessages.minComplianceError, notyMessages.typeWarning );
					}
					$scope.legends.isHCP = true;
					$scope.disableLegends.hcp = false;
				}else if(legend === loginAnalyticsConstants.legends.CLINICADMIN){
					if(!$scope.legends.isClinicAdmin){
						$scope.legends.isClinicAdmin = true;
						$scope.dayView();	
					}else{
						notyService.showMessage(notyMessages.minComplianceError, notyMessages.typeWarning );
					}
					$scope.legends.isClinicAdmin = true;
					$scope.disableLegends.clinicadmin = false;
				}else if(legend === loginAnalyticsConstants.legends.CAREGIVER){
					if(!$scope.legends.isCaregiver){
						$scope.legends.isCaregiver = true;
						$scope.dayView();	
					}else{
						notyService.showMessage(notyMessages.minComplianceError, notyMessages.typeWarning );
					}
					$scope.legends.isCaregiver = true;
					$scope.disableLegends.caregiver = false;
				}				
			} else{
				$scope.disableLegends.patient = false;
				$scope.disableLegends.hcp = false;
				$scope.disableLegends.clinicadmin = false;
				$scope.disableLegends.caregiver = false;
				if(legend === loginAnalyticsConstants.legends.PATIENT){
					$scope.legends.isPatient = !$scope.legends.isPatient;							
				}else if(legend === loginAnalyticsConstants.legends.HCP){
					$scope.legends.isHCP = !$scope.legends.isHCP;					
				}else if(legend === loginAnalyticsConstants.legends.CLINICADMIN){
					$scope.legends.isClinicAdmin = !$scope.legends.isClinicAdmin;					
				}else if(legend === loginAnalyticsConstants.legends.CAREGIVER){
					$scope.legends.isCaregiver = !$scope.legends.isCaregiver;					
				}
				$scope.dayView();					
			}
					 
		};

		/*
		* Legend 'All' will always be selected, unless any other legend is made unselected*/
		$scope.changeLegends = function(legend){	
			var count = getSelectedLegendsCount();	
			$scope.validateLegends(legend, count);

		};

		$scope.calculateTimeDuration = function(durationInDays) {
	      $scope.toTimeStamp = new Date().getTime();
	      $scope.toDate = dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/');
	      $scope.fromTimeStamp = dateService.getnDaysBackTimeStamp(durationInDays);;
	      $scope.fromDate = dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/');
	      $scope.dates = {startDate: $scope.fromDate, endDate: $scope.toDate};
	    };
		
		$scope.drawCategoryChartForDay = function(){
			Highcharts.chart('containerDay', {
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
					categories: $scope.categoryChartData.xAxis.categories,
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
		            minRange: 1,
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
			        enabled: false
		        },
		        plotOptions: {
		            series: {
		            	pointWidth: 50,
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
					backgroundColor: "rgba(255,255,255,1)",  					
					crosshairs: [{		                
		                dashStyle: 'solid',
		                color: '#b4e6f6'
		            },
		            false],
					formatter: function() {
				        var s = '<div style="font-size:12px; font-weight: bold; padding-bottom: 10px;float:left">&nbsp;&nbsp;&nbsp;&nbsp;'+   this.x  +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';

				        $.each(this.points, function(i, point) {
				            s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ point.series.color +';padding:2px;width:85%;float:left> ' + point.series.name + '</div> ' 
				            + '<div style="padding:5px;width:5%"><b style="margin:0 -10px">' + point.y + '</b></div></div>';
				        });
				        s += '</div>';

				        return s;
				    },
				    hideDelay: 0,
					useHTML: true,				
    				shared: true
				},
				series: $.extend(true, [], $scope.categoryChartData.series),
				loading: true,
				size: {}
		    });//.setSize(1140, 400);
		};

		$scope.drawCategoryChartForNonDay = function(){
			var chart = Highcharts.chart('containerNonDay', {	
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
					categories: $scope.categoryChartData.xAxis.categories,
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
		            minRange: 1,
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
					backgroundColor: "rgba(255,255,255,1)",  				
					crosshairs: [{		                
		                dashStyle: 'solid',
		                color: '#b4e6f6'
		            },
		            false],
					formatter: function() {
				        var s = '<div style="font-size:12x;font-weight: bold; padding-bottom: 3px;">'+  this.x +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';
				       
				        $.each(this.points, function(i, point) {
				            s += '<div style="font-size:10px; font-weight: bold; width:100%"><div style="color:'+ point.series.color +';padding:5px 0;width:80%;float:left"> ' + point.series.name + '</div> ' 
				            + '<div style="padding:5px;width:10%"><b>' + point.y + '</b></div></div>';
				        });
				        s += '</div>';

				        return s;
				    },
				    hideDelay: 0,
					useHTML: true,				
    				shared: true					
				},
				series: $.extend(true, [], $scope.categoryChartData.series),
				loading: true,
				size: {}
		    });//.setSize(1140, 400);
		};		

		$scope.drawDateRangeChartForNonDay = function(){
			var daysInterval = getDaysIntervalInChart($scope.categoryChartData.xAxis.categories.length);
			Highcharts.chart('containerCustom', {
				credits: {
					enabled: false
				},					
				chart:{
					type: 'line',
					zoomType: 'xy',					
                    backgroundColor:'#e3ecf7'
				},
		        title: {
		            text: ''
		        },		      	
		      	xAxis:{		      		
					type: 'datetime',					
		            title: {
		                text: ''
		            },
		            minPadding: 0,
		            maxPadding: 0,
		            startOnTick: false,
		            endOnTick: false,
		            labels:{
						style: {
							color: '#525151',
							//font: '10px Helvetica',
							fontWeight: 'bold'
						},
						formatter:function(){
							return  Highcharts.dateFormat("%m/%d/%Y",this.value);
						}	              
					},
					units: [
	                  ['day', [daysInterval]]
	                ] 			           
				},				
				yAxis: {
					gridLineColor: '#FF0000',
		            gridLineWidth: 0,
		            lineWidth:1,
		            "minRange": 1,
		            "min": 0,		            
		            title: {
		                text: 'No. of Users',
		                style:{
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
			        line: {
	                    lineWidth: 1,
	                    softThreshold: false
	                },	        	
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
					backgroundColor: "rgba(255,255,255,1)",  				
					crosshairs: [{		                
		                dashStyle: 'solid',
		                color: '#b4e6f6'
		            },
		            false],
					formatter: function() {
				        var s = '<div style="font-size:12x; font-weight: bold; padding-bottom: 3px;">&nbsp;'+  Highcharts.dateFormat('%m/%d/%Y', this.x) +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div>';

				        $.each(this.points, function(i, point) {
				            s += '<div style="font-size:10px; font-weight: bold; width="100%"><div style="color:'+ point.series.color +';padding:5px;width:85%;float:left"> ' + point.series.name + '</div> ' 
				            + '<div style="padding:5px;width:5%"><b>' + point.y + '</b></div></div>';
				        });
				        s += '</div>';

				        return s;
				    },
				    hideDelay: 0,
					useHTML: true,				
    				shared: true
				},
				
				series: $.extend(true, [], $scope.categoryChartData.series),				
				loading: true,
				size: {}
		    });//.setSize(1140, 400);
		};

		$scope.updateChart = function(){
			var chartDay = $("#containerDay").highcharts();
			var chartNonDay = $("#containerNonDay").highcharts();
			var chartCustom = $("#containerCustom").highcharts();
			if($scope.dayChart){				
				if(chartDay){
					chartDay.zoomOut();		
					chartDay.xAxis[0].setCategories($scope.categoryChartData.xAxis.categories, false);
					for(var i = chartDay.series.length - 1; i >= 0; i--) {
						chartDay.series[i].update({						
						data: $scope.categoryChartData.series[i].data,
						visible: true
						}, false);
					}
					chartDay.redraw();
				}else{
					$scope.drawCategoryChartForDay();
				}
			}else if($scope.customDateRange){// nonday and custom i.e. date range	
				if(chartCustom){//already a custom chart is present then redraw					
					/*chartCustom.yAxis[0].update({
					    max: $scope.yMax
					}); 	*/	
					chartCustom.zoomOut();					
					for(var i = chartCustom.series.length - 1; i >= 0; i--) {
						chartCustom.series[i].update({
							data: $scope.categoryChartData.series[i].data,
							visible: true
						}, false);
					}
					chartCustom.redraw();
				}else{// draw a new one
					$scope.drawDateRangeChartForNonDay();
				}							
			}else{// non day and non custom range
				if(chartNonDay){					
					chartNonDay.zoomOut();							
					chartNonDay.xAxis[0].setCategories($scope.categoryChartData.xAxis.categories, false);				
					for(var i = chartNonDay.series.length - 1; i >= 0; i--) {
						chartNonDay.series[i].update({
							data: $scope.categoryChartData.series[i].data,
							visible: true
						}, false);
					}
					chartNonDay.redraw();
				}else{					
					$scope.drawCategoryChartForNonDay();				
				}
			}
		};

		$scope.dayView = function(today){ 			
			$scope.dayChart = true;
			$scope.customDateRange = false;
			$scope.toggleDuration(true, false, false, false, false);
			$scope.resetTimeDurationForToday(today);
			$scope.getCategoryChartData(loginAnalyticsConstants.duration.DAY);			
			
		};

		$scope.weekView = function(){
			$scope.defaultLegends(); //if the legends selected eariler has to be retained then remove this line
			$scope.dayChart = false;
			$scope.customDateRange = false;
			$scope.toggleDuration(false, true, false, false, false);
			$scope.calculateTimeDuration(6);
			$scope.getCategoryChartData(loginAnalyticsConstants.duration.WEEK);			
		};

		$scope.monthView = function(){	
			$scope.defaultLegends(); //if the legends selected eariler has to be retained then remove this line
			$scope.dayChart = false;
			$scope.customDateRange = false;	
			$scope.toggleDuration(false, false, true, false, false);
			$scope.calculateTimeDuration(30);
			$scope.getCategoryChartData(loginAnalyticsConstants.duration.MONTH);				
		};

		$scope.yearView = function(){
			$scope.defaultLegends(); //if the legends selected eariler has to be retained then remove this line
			$scope.dayChart = false;
			$scope.customDateRange = false;
			$scope.toggleDuration(false, false, false, true, false);
			$scope.calculateTimeDuration(365);
			$scope.getCategoryChartData(loginAnalyticsConstants.duration.YEAR);			
		};

		$scope.customDateRangeView = function(){
				$scope.defaultLegends(); //if the legends selected eariler has to be retained then remove this line
				$scope.dayChart = false;
				$scope.customDateRange = true;
				$scope.toggleDuration(false, false, false, false, true);
				$scope.getCategoryChartData(loginAnalyticsConstants.duration.CUSTOM);					
		};

		$scope.downloadGraphAsPdf = function(){
			if($scope.dayChart){
				exportutilService.exportLoginAnalyticsAsPDF("containerDay", loginAnalyticsConstants.duration.DAY, $scope.legends, $scope.fromDate, $scope.toDate);
			}else if($scope.customDateRange){
				exportutilService.exportLoginAnalyticsAsPDF("containerCustom", null, null,$scope.fromDate, $scope.toDate);
			}else{
				exportutilService.exportLoginAnalyticsAsPDF("containerNonDay", null, null,$scope.fromDate, $scope.toDate);
			}						      	
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
				if(date && (date.toString()).indexOf("/") > -1){					
					var startDate = date.split("/"); // turning it from MM/DD/YYYY HH:MM:SS to timestamp
					var formattedDate = startDate[2] + "-" + startDate[0] + "-" + startDate[1];
					if(isChrome().indexOf("chrome") !== -1){						
						return new Date(formattedDate).getTime();
					}else{						
						return new Date(formattedDate.replace(/\s/, 'T')).getTime();
					}
				}else{
					return date;
				}
		 }
	
		 $scope.toggleDuration = function(day, week, month, year, custom){
		 	$scope.durationview = {};
		 	$scope.durationview.day = day;
		 	$scope.durationview.week = week;
		 	$scope.durationview.month = month;
		 	$scope.durationview.year = year;
		 	$scope.durationview.custom = custom;
		 };

		 $scope.getCategoryChartData = function(duration){
		 	var filters = $scope.getSelectedUserRoles();
			loginanalyticsService.getLoginAnalytics( dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.serverDateFormat,'-'), dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.serverDateFormat,'-'), filters, duration).then(function(response) {
				var daysDiff = dateService.getDateDiffIndays($scope.fromTimeStamp,$scope.toTimeStamp);
				$scope.yMax = 1;
				$scope.categoryChartData = response.data;				
				angular.forEach($scope.categoryChartData.series, function(series, key) {
				  if(!$scope.durationview.day){
				  	if(series.name.toLowerCase() === loginAnalyticsConstants.legends.PATIENT){
				  		$scope.categoryChartData.series[key].color = loginAnalyticsConstants.colors.PATIENT;
				  	}
				  	if(series.name.toLowerCase() === loginAnalyticsConstants.legends.HCP){
				  		$scope.categoryChartData.series[key].color = loginAnalyticsConstants.colors.HCP;
				  	}
				  	if(series.name.toLowerCase().replace(' ', '') === loginAnalyticsConstants.legends.CLINICADMIN){
				  		$scope.categoryChartData.series[key].color = loginAnalyticsConstants.colors.CLINICADMIN;
				  	}
				  	if(series.name.toLowerCase().replace(' ', '') === loginAnalyticsConstants.legends.CAREGIVER){
				  		$scope.categoryChartData.series[key].color = loginAnalyticsConstants.colors.CAREGIVER;
				  	}				  	
				  }

				  angular.forEach(series.data, function(data, index) {
				  if($scope.durationview.day){					 		  
				  	if($scope.categoryChartData.series.length === 1 && $scope.categoryChartData.xAxis.categories[index].toLowerCase() === loginAnalyticsConstants.legends.PATIENT){
				  		$scope.categoryChartData.series[0].data[index].color = loginAnalyticsConstants.colors.PATIENT;				  		
				  	}
				  	if($scope.categoryChartData.series.length === 1 && $scope.categoryChartData.xAxis.categories[index].toLowerCase() === loginAnalyticsConstants.legends.HCP){
				  		$scope.categoryChartData.series[0].data[index].color = loginAnalyticsConstants.colors.HCP;				  		
				  	}
				  	if($scope.categoryChartData.series.length === 1 && $scope.categoryChartData.xAxis.categories[index].toLowerCase().replace(' ', '') === loginAnalyticsConstants.legends.CLINICADMIN){
				  		$scope.categoryChartData.series[0].data[index].color = loginAnalyticsConstants.colors.CLINICADMIN;				  		
				  	}
				  	if($scope.categoryChartData.series.length === 1 && $scope.categoryChartData.xAxis.categories[index].toLowerCase().replace(' ', '') === loginAnalyticsConstants.legends.CAREGIVER){
				  		$scope.categoryChartData.series[0].data[index].color = loginAnalyticsConstants.colors.CAREGIVER;				  		
				  	}				  	
				  }
				  if($scope.categoryChartData.series[key].data[index].x )	{				  	
				  	$scope.categoryChartData.series[key].data[index].x = convertToTimestamp(data.x);				  					  	
				  }	  					  	
				  if($scope.categoryChartData.series[key].data[index].y ){				  	
				  	$scope.categoryChartData.series[key].data[index].y = parseInt($scope.categoryChartData.series[key].data[index].y);				  				  
				  }		
				  var marker = {};		
				  marker.radius = ($scope.durationview.custom && daysDiff > 50)? 0 : 4;				  		
				  $scope.categoryChartData.series[key].data[index].marker = marker;				  	
				  $scope.yMax = ($scope.yMax === 1 && $scope.categoryChartData.series[key].data[index].y === 0) ? 1 : null;
				  });
				});	
				
				if(duration === loginAnalyticsConstants.duration.CUSTOM){
					setTimeout(function(){ 														
						$scope.updateChart();
					},10);
				}else{
					setTimeout(function(){ 								
						$scope.updateChart();
					},10);					
				}
			});		 	
		 };
		 
		 $scope.getSelectedUserRoles = function(){
		 	var userRoles = "";
		 	if($scope.legends.isPatient){
		 		userRoles = userRoles+loginAnalyticsConstants.legends.PATIENT;
		 	}
		 	if($scope.legends.isHCP){
		 		userRoles = userRoles+loginAnalyticsConstants.legends.HCP;
		 	}
		 	if($scope.legends.isClinicAdmin){
		 		userRoles = userRoles+loginAnalyticsConstants.legends.CLINICADMIN;
		 	}
		 	if($scope.legends.isCaregiver){
		 		userRoles = userRoles+loginAnalyticsConstants.legends.CAREGIVER;
		 	}
		 	return userRoles;
		 };

		 $scope.getSelectedUserRoles = function(){
		 	var userRoles = "";
		 	var count = 0;
		 	if($scope.legends.isPatient){
		 		userRoles = userRoles + loginAnalyticsConstants.filters.PATIENT;
		 		count++;
		 	}
		 	if($scope.legends.isHCP){
		 		if(count > 0){
		 			userRoles = userRoles + loginAnalyticsConstants.string.COMMA;
		 		}
		 		userRoles = userRoles + loginAnalyticsConstants.filters.HCP;
		 		count++;
		 	}
		 	if($scope.legends.isClinicAdmin){
		 		if(count > 0){
		 			userRoles = userRoles + loginAnalyticsConstants.string.COMMA;
		 		}
		 		userRoles = userRoles + loginAnalyticsConstants.filters.CLINICADMIN;
		 		count++;
		 	}
		 	if($scope.legends.isCaregiver){
		 		if(count > 0){
		 			userRoles = userRoles + loginAnalyticsConstants.string.COMMA;
		 		}
		 		userRoles = userRoles + loginAnalyticsConstants.filters.CAREGIVER;
		 	}
		 	return userRoles;
		 };	

		 $scope.initGraph = function(){
		 	if($scope.durationview.day){
		 		$scope.dayView();
		 	}else if($scope.durationview.week){
		 		$scope.weekView();
		 	}else if($scope.durationview.month){
		 		$scope.monthView();
		 	}else if($scope.durationview.year){
		 		$scope.yearView();
		 	}else if($scope.durationview.custom){
		 		$scope.customDateRangeView();
		 	}
		 };	

		 $scope.defaultDayView = function(){
		 	$scope.defaultLegends();
		 	$scope.dayView();
		 }; 

		/* This method initiates the required methods required for a specific route*/
		$scope.init = function(){
			if($state.current.name === 'adminLoginAnalytics' || $state.current.name === 'rcadminLoginAnalytics' || $state.current.name === 'associatesLoginAnalytics' || $state.current.name === 'customerserviceLoginAnalytics'){
				$scope.analyticsInit();
			}
		};

		function getDaysIntervalInChart(noOfDataPoints){
			/*var pInterval = 12;
			var sInterval = 13;
			var remainder  = 6;*/
			var pInterval = 12;
			var sInterval = 13;
			var remainder  = 6;
			if($rootScope.isIOS()){
				pInterval = 7;
				sInterval = 8;
				remainder = 3;
			}
			return ( (parseInt(noOfDataPoints/pInterval) > 0) && noOfDataPoints%pInterval > remainder) ? parseInt(noOfDataPoints/sInterval) : ((parseInt(noOfDataPoints/pInterval) > 0)? parseInt(noOfDataPoints/pInterval): 1) ; 
		};

		

		$scope.init();
	}]);
