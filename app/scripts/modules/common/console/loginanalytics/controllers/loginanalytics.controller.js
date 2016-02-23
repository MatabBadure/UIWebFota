/*@Controller loginanalytics
* User having role Admin/RCAdmin/Associate can access this page.
* This page represents a statisticalanalytical report that how many users are logging in to the application 
*
**/

'use strict';
angular.module('hillromvestApp')
.controller('loginAnalyticsController',['$scope', '$state', 'loginAnalyticsConstants', 'dateService',
	function($scope, $state, loginAnalyticsConstants, dateService) {	
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
		            text: 'No of users logged in today'
		        },		      	
		      	xAxis:{
					type: 'category',					
					categories: $scope.categoryChartData.xAxis.categories,
					crosshair: true
					},
				yAxis: {
		            min: 0,
		            title: {
		                text: 'No. Of Logins'
		            }
		        },
        	 	legend: {
		            layout: 'horizontal',
		            align: 'left',
		            verticalAlign: 'top',
		            borderWidth: 0
		           // enabled: false
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

		$scope.drawDateRangeChart = function(){
			Highcharts.chart('container', {				
				chart:{
					type: 'spline',
					zoomType: 'xy'
				},
		        title: {
		            text: 'No of users logged in today'
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
		            min: 0,
		            title: {
		                text: 'No. Of Logins'
		            }
		        },
        	 	legend: {
		            layout: 'horizontal',
		            align: 'left',
		            verticalAlign: 'top',
		            borderWidth: 0
		            //enabled: false
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
			var pdf = new jsPDF('p', 'pt', 'a4', true), specialElementHandlers = {
		       '#bypassme': function(element, renderer){
		        return true;
      		}};
			var pageHeight = pdf.internal.pageSize.height;
			var pageWidth = pdf.internal.pageSize.width;
			                  
			var margins = {
				top: 70,
				bottom: 60,
				left: 15,
				width: 575,
				titleTop:40,
				tCellWidth:140,
				tCapWidth:280,
				t2TabLeft:(pageWidth/2)+5
			};
			var g_pdfMetaData = {
		            rTitle: 'HillRom'
		            ,rTitle1: 'VisiView™ Health Portal'		            
	          }
		     
			pdf.setFont("helvetica");
			pdf.setFontType("bold");   
			pdf.setFontSize(6);
			pdf.setTextColor(0,0,0);
			pdf.text(margins.left,   margins.titleTop-15, dateService.getDateFromTimeStamp(new Date().getTime(), patientDashboard.dateFormat, "/"));

			pdf.setFont("helvetica");   
			pdf.setFontType("bold");
			pdf.setFontSize(6);
			pdf.setTextColor(0,0,0);
			pdf.text(margins.width-305,   margins.titleTop-15, "Hillrom | Overview");

			pdf.setFont("helvetica");  
			pdf.setFontType("bold"); 
			pdf.setFontSize(11);
			pdf.setTextColor(124,163,220);
			pdf.text(margins.width-30, margins.titleTop,g_pdfMetaData.rTitle);

			pdf.setFont("helvetica");   
			pdf.setFontType("bold");      
			pdf.setFontSize(7);
			pdf.setTextColor(114, 111, 111);
			pdf.text(margins.width-70,   margins.titleTop+10, g_pdfMetaData.rTitle1);

			pdf.setDrawColor(0);
			pdf.setFillColor(114, 111, 111);
			pdf.rect(margins.left, margins.titleTop+13, margins.width-5, .5, 'F'); 

			pdf.setFont("helvetica"); 
			pdf.setFontType("normal");        
			pdf.setFontSize(6);
			pdf.setTextColor(0, 0, 0);
			pdf.text(margins.left,   margins.titleTop+30, "Report Generation Date ");

			pdf.setFont("helvetica"); 
			pdf.setFontType("normal");        
			pdf.setFontSize(6);
			pdf.setTextColor(128, 179, 227);
			pdf.text(margins.left+69,   margins.titleTop+30, dateService.getDateFromTimeStamp(new Date().getTime(),patientDashboard.dateFormat,'/'));

			pdf.setFont("helvetica"); 
			pdf.setFontType("normal");        
			pdf.setFontSize(6);
			pdf.setTextColor(0, 0, 0);
			pdf.text(margins.t2TabLeft,  margins.titleTop+30, "Date Range Of Report ");

			pdf.setFont("helvetica"); 
			pdf.setFontType("normal");        
			pdf.setFontSize(6);
			pdf.setTextColor(128, 179, 227);
			pdf.text(margins.t2TabLeft+65,  margins.titleTop+30, dateService.getDateFromTimeStamp($scope.fromTimeStamp,patientDashboard.dateFormat,'/') + " - "+dateService.getDateFromTimeStamp($scope.toTimeStamp,patientDashboard.dateFormat,'/'));

			pdf.cellInitialize();

      		var canvas = document.getElementById('loginAnalyticsCanvas');               
	        var ctx = canvas.getContext('2d');  
	        var htmlString =  $("#container").find("svg").parent().html().trim().replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');          
	        canvg(canvas, htmlString);
	        var img = $("#loginAnalyticsCanvas")[0].toDataURL('image/png', 1.0);
	        pdf.addImage(img, 'png', 10, 100, 540, 170);
	        setTimeout(function(){     
		        pdf.save('VisiView™.pdf'); 
		      },1000);  
      		
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
