  'use strict';

angular.module('hillromvestApp')
    .service('graphUtil', [ 'dateService','hcpDashboardConstants', function (dateService,hcpDashboardConstants) {

      this.convertIntoHMRLineGraph = function(data) {
        var pointSet = [];
        var graphData = {};
        var graphDataList =[];
        angular.forEach(data.actual, function(value) {
          var point = [];
          point.push(value.timestamp);
          point.push(Math.floor(value.hmr));
          pointSet.push(point);
        });
        graphData["values"] = pointSet;
        graphDataList.push(graphData);
      return graphDataList;
      }

      this.convertToHMRStepGraph = function(data,colorCode,unit) {
        var pointSet = [];
        var graphData = {};
        var graphDataList =[];
        var count = 1;
        angular.forEach(data.actual, function(value) {
          var point = {};
          point.x = value.timestamp;
          point.y = value.hmr/unit;
          pointSet.push(point);
        });
        graphData.values = pointSet;
        graphData.color = colorCode;
        graphData.area = true;
        graphDataList.push(graphData);
      return graphDataList;
      }

      this.convertIntoServerTimeZone = function(data,graphType){
        switch(graphType){
          case patientDashboard.hmrNonDayGraph:
            var graphData = {};
            var actual = [];
            angular.forEach(data.actual, function(value) {
              if(value.timestamp){
                var timestamp = value.timestamp;
                value.timestamp = dateService.convertMMDDYYYYHHMMSSstamp(value.timestamp);//dateService.getUTCTimeStamp(value.timestamp);
                value.start = value.start ? dateService.convertMMDDYYYYHHMMSSstamp(value.start) : dateService.convertMMDDYYYYHHMMSSstamp(timestamp);//dateService.getUTCTimeStamp(value.start);
                value.end = value.end ? dateService.convertMMDDYYYYHHMMSSstamp(value.end) : dateService.convertMMDDYYYYHHMMSSstamp(timestamp);//dateService.getUTCTimeStamp(value.end);
                actual.push(value);
              }
            });
            graphData.actual = actual;
            graphData.recommended = data.recommended;
            return graphData;
          case hcpDashboardConstants.cumulativeGraph.name:
            var pointSet = [];
            angular.forEach(data, function(value) {
              value.startTimestamp = dateService.getUTCTimeStamp(value.startTimestamp);
              value.endTimestamp = dateService.getUTCTimeStamp(value.endTimestamp);
              pointSet.push(value);
            });
            return pointSet;
          case patientDashboard.complianceGraph:
            var graphData = {};
            var actual = [];
            angular.forEach(data.actual, function(value) {
              if(value.timestamp){
                var timestamp = value.timestamp;
                value.timestamp = dateService.convertMMDDYYYYHHMMSSstamp(value.timestamp);//dateService.getUTCTimeStamp(value.timestamp);
                value.start = value.start ? dateService.convertMMDDYYYYHHMMSSstamp(value.start) : dateService.convertMMDDYYYYHHMMSSstamp(timestamp);//dateService.getUTCTimeStamp(value.start);
                value.end = value.end ? dateService.convertMMDDYYYYHHMMSSstamp(value.end) : dateService.convertMMDDYYYYHHMMSSstamp(timestamp);//dateService.getUTCTimeStamp(value.end);
                actual.push(value);
              }
            });
            graphData.actual = actual;
            graphData.recommended = data.recommended;
            return graphData;
          case patientDashboard.hmrDayGraph:
            var graphData = {};
            var actual = [];
            angular.forEach(data.actual, function(value) {
              if(value.timestamp){
                var timestamp = value.timestamp;
                value.timestamp = dateService.convertMMDDYYYYHHMMSSstamp(value.timestamp);
                value.start = value.start ? dateService.convertMMDDYYYYHHMMSSstamp(value.start) : dateService.convertMMDDYYYYHHMMSSstamp(timestamp) ;//dateService.getUTCTimeStamp(value.start);
                value.end = value.end ? dateService.convertMMDDYYYYHHMMSSstamp(value.end) : dateService.convertMMDDYYYYHHMMSSstamp(timestamp);//dateService.getUTCTimeStamp(value.end);
                actual.push(value);
              }
            });
            graphData.actual = actual;
            graphData.recommended = data.recommended;
            return graphData;
          case hcpDashboardConstants.treatmentGraph.name:
            var pointSet = [];
            angular.forEach(data, function(value) {
              value.startTime = dateService.getUTCTimeStamp(value.startTime);
              value.endTime = dateService.getUTCTimeStamp(value.endTime);
              value.avgTreatments = (value.avgTreatments === 0) ? 0.005: value.avgTreatments;
              value.avgTreatmentDuration = (value.avgTreatmentDuration === 0) ? 0.005 : value.avgTreatmentDuration;
              pointSet.push(value);
            });
            return pointSet;
        }

      }

      var createCumulativeGraph = function(data,key,color) {
        var pointSet = [];
        var graphData = {};
        var count = 1;
        angular.forEach(data, function(value) {
          var point = [];
          point.push(value.startTimestamp);
          switch(key){
            case hcpDashboardConstants.cumulativeGraph.label.missedTherapy:
              point.push(value.missedTherapy);
              break;
            case hcpDashboardConstants.cumulativeGraph.label.nonCompliance:
              point.push(value.nonCompliance);
              break;
            case hcpDashboardConstants.cumulativeGraph.label.settingDeviation:
              point.push(value.settingDeviation);
              break;
            case hcpDashboardConstants.cumulativeGraph.label.noEvents:
              point.push(value.noEvent);
              break;
          }
          pointSet.push(point);
        });
        graphData.values = pointSet;
        graphData.key = key;
        graphData.area = true;
        graphData.color = color;
        return graphData;
      }

      this.convertIntoCumulativeGraph = function(data, cumulativeStatitics) {
        var graphDataList =[];
        if(cumulativeStatitics.isMissedTherapyDays)
        graphDataList.push(createCumulativeGraph(data,hcpDashboardConstants.cumulativeGraph.label.missedTherapy,hcpDashboardConstants.cumulativeGraph.color.missedTherapy));
        if(cumulativeStatitics.isNoTransmissionRecorded)
        graphDataList.push(createCumulativeGraph(data,hcpDashboardConstants.cumulativeGraph.label.noEvents,hcpDashboardConstants.cumulativeGraph.color.noEvents));
        if(cumulativeStatitics.isSettingDeviation)
        graphDataList.push(createCumulativeGraph(data,hcpDashboardConstants.cumulativeGraph.label.settingDeviation,hcpDashboardConstants.cumulativeGraph.color.settingDeviation));
        if(cumulativeStatitics.isHMRNonAdherence)
        graphDataList.push(createCumulativeGraph(data,hcpDashboardConstants.cumulativeGraph.label.nonCompliance,hcpDashboardConstants.cumulativeGraph.color.nonCompliance));
        return graphDataList;
      }

      var arrayMax = Function.prototype.apply.bind(Math.max, null);
      var arrayMin = Function.prototype.apply.bind(Math.min, null);

      this.getYaxisRangeLineGraph = function(data) {
        var range = {};
        var hmrSet = [];
        angular.forEach(data.actual, function(value) {
          hmrSet.push(value.hmr);
        });
        var max = arrayMax(hmrSet);
        var min = arrayMin(hmrSet);
        var unit = 60; //hmr values are in minutes
        var ylabel = "Total Therapy Hours";

        max = Math.floor(max/unit);
        min = Math.floor(min/unit);
        range.max = Math.ceil((max + (max-min)/4)/10) * 10;
        if(min !== 0 && min > (max-min)){
          range.min = Math.floor((min - ((max-min)/4))/10) * 10;
        } else {
          range.min = min;
        }
        if(range.min === range.max){
          range.min = 0;
          range.max = range.max + Math.ceil(range.max/4);
        }
        range.unit = unit;
        range.ylabel = ylabel;
        return range;
      }

      this.getYaxisRangeBarGraph = function(data) {
        var range = {};
        var hmrSet = [];
        angular.forEach(data, function(value) {
          if(value.hmr !== 'null'){
           hmrSet.push(value.duration);
          }
        });
        var max = arrayMax(hmrSet);
        var min = arrayMin(hmrSet);
        var unit = 60;
        var ylabel = "Minutes";
        
        range.max = Math.ceil((max + (max-min)/4)/10) * 10; 
        if(min !== 0 && min > (max-min)){          
          range.min = Math.floor(Math.floor((min - ((max-min)/2)))/10) * 10;
        }
        if(range.min === undefined){
          range.min = 0;
        }
        if(range.max === undefined){
          range.max = 0;
        }
        if(range.min === range.max){
          range.min = 0;
          range.max = range.max + Math.ceil(range.max/4);
        }
        range.unit = unit;
        range.ylabel = ylabel;
        return range;
      }


      this.getYaxisRangeComplianceGraph = function(data) {
          var range = {};
          var durationSet = [];
          var frequencySet = [];
          var pressureSet = [];
          angular.forEach(data.actual, function(value) {
              durationSet.push(value.duration);
              pressureSet.push(value.pressure);
              frequencySet.push(value.frequency);
          });

          var maxDuration = arrayMax(durationSet);
          var maxRecommendedDuration = Math.floor(maxDuration);
          maxDuration =  data.recommended.treatmentsPerDay * data.recommended.minMinutesPerTreatment;
          maxDuration = (maxDuration > maxRecommendedDuration) ? maxDuration : maxRecommendedDuration;
          range.maxDuration = maxDuration + Math.ceil(maxDuration/4);

          var maxPressure = arrayMax(pressureSet);
          maxPressure = (maxPressure > data.recommended.maxPressure) ? maxPressure : data.recommended.maxPressure;
          range.maxPressure = maxPressure + Math.ceil(maxPressure/4);

          var maxFrequency = arrayMax(frequencySet);
          maxFrequency = (maxFrequency > data.recommended.maxFrequency) ? maxFrequency : data.recommended.maxFrequency;
          range.maxFrequency = maxFrequency + Math.ceil(maxFrequency/4);          
          return range;
      }

      this.getYaxisRangeTreatmentGraph = function(data) {
          var range = {};
          var treatmentPerDaySet = [];
          var treatmentDurationSet = [];
          angular.forEach(data, function(value) {
              treatmentPerDaySet.push(value.avgTreatments);
              treatmentDurationSet.push(value.avgTreatmentDuration);
          });
          var maxTreatmentsPerDay = arrayMax(treatmentPerDaySet);// + Math.ceil(arrayMax(treatmentPerDaySet)/4);
          var maxTreatmentDuration = arrayMax(treatmentDurationSet);// + arrayMax(treatmentDurationSet)/4;
          range.maxTreatmentsPerDay = maxTreatmentsPerDay < 1 ? 1 : maxTreatmentsPerDay;
          range.maxTreatmentDuration = maxTreatmentDuration < 1 ? 1 : maxTreatmentDuration;          
          return range;
      }

      this.getYaxisRangeCumulativeGraph = function(data){
          var range = {};
          var NoOfPatientSet = [];
          angular.forEach(data, function(value) {
              NoOfPatientSet.push(value.missedTherapy);
              NoOfPatientSet.push(value.nonCompliance);
              NoOfPatientSet.push(value.settingDeviation);
              NoOfPatientSet.push(value.noEvent);
          });
          var maxNoOfPatients = arrayMax(NoOfPatientSet) + Math.ceil(arrayMax(NoOfPatientSet)/4);
          range.maxNoOfPatients = maxNoOfPatients === 0 ? 1 : maxNoOfPatients;
          return range;
      }

      this.convertIntoHMRBarGraph = function(data) {
        var pointSet = [];
        var graphData = {};
        var graphDataList =[];
        angular.forEach(data, function(value) {
          var point = [];
          point.push(value.start);
          point.push((value.hmr/60));
          pointSet.push(point);
        });
        graphData["values"] = pointSet;
        graphDataList.push(graphData);
      return graphDataList;
      }

      this.convertToHMRBarGraph = function(data,colorCode,unit) {
        var pointSet = [];
        var graphData = {};
        var graphDataList =[];
        angular.forEach(data, function(value) {
          var point = {};
          point.x = value.start;
          point.y = value.duration;
          pointSet.push(point);
        });
        graphData.values = pointSet;
        graphData.color = colorCode;
        graphDataList.push(graphData);
      return graphDataList;
      }
      var insertData = function(data,value) {
        data.frequency = data.frequency + value.frequency;
        data.pressure = data.pressure + value.pressure;
        data.durationInMinutes = data.durationInMinutes + value.durationInMinutes;
        data.programmedCaughPauses = data.programmedCaughPauses + value.programmedCaughPauses;
        data.normalCaughPauses = data.normalCaughPauses + value.normalCaughPauses;
        data.caughPauseDuration = data.caughPauseDuration + value.caughPauseDuration;
        if(value.hmr > data.hmr || data.hmr === 'null'){
          data.hmr = value.hmr;
        }
      }

      var resetDataPoint = function(data){
        data.frequency = 0;
        data.pressure = 0;
        data.durationInMinutes = 0;
        data.programmedCaughPauses = 0;
        data.normalCaughPauses = 0;
        data.caughPauseDuration = 0;
        data.duration = 0;
        data.treatmentsPerDay = 0;
        data.weightedAvgFrequency = 0;
        data.weightedAvgPressure = 0;
        return data;
      }

      this.getCompleteGraphData = function(data,format,fromTimeStamp,toTimeStamp) {
        var dataPoint = {};
        var clonedData = JSON.parse(JSON.stringify(data));
        switch(format){
          case 'weekly':
            var daysList = dateService.getListOfDaysInTimeStamp(fromTimeStamp,toTimeStamp);
            daysList = dateService.sortTimeStamp(daysList,'DESC');
            var missedTherapyList = daysList;
            break;
          case 'monthly':
            var weeksList = dateService.getListOfWeeksInTimeStamp(fromTimeStamp,toTimeStamp);
            weeksList = dateService.sortTimeStamp(weeksList,'DESC');
            var missedTherapyList = weeksList;
            break;
          case 'yearly':
            var monthsList = dateService.getListOfMonthsInTimeStamp(fromTimeStamp,toTimeStamp);
            monthsList = dateService.sortTimeStamp(monthsList,'DESC');
            var missedTherapyList = monthsList;
            break;
        }
        angular.forEach(missedTherapyList, function(timeStamp){
              var count = 0;
              angular.forEach(clonedData.actual, function(value){
                if(dateService.getDateFromTimeStamp(value.timestamp,patientDashboard.dateFormat,'/') === dateService.getDateFromTimeStamp(timeStamp,patientDashboard.dateFormat,'/')){
                   count = count+1;
                   if(clonedData.actual.length > 1){
                      clonedData.actual.splice(clonedData.actual.indexOf(value),1)
                   }
                }
                dataPoint = JSON.parse(JSON.stringify(value));
              });
              if(count === 0){
                dataPoint = resetDataPoint(dataPoint);
                dataPoint.timestamp = timeStamp;
                dataPoint.start = timeStamp;
                dataPoint.end = timeStamp;
                data.actual.push(dataPoint);
              }
        });
        return data;
      }

      this.formatDayWiseDate = function(data) {
        var list = [];
        /*var data1 = {frequency : 0, pressure : 0, durationInMinutes : 0, programmedCaughPauses : 0,
                      normalCaughPauses : 0, caughPauseDuration : 0, hmr : 'null'};
        var data2 = JSON.parse(JSON.stringify(data1));
        var data3 = JSON.parse(JSON.stringify(data1));
        var data4 = JSON.parse(JSON.stringify(data1));
        var data5 = JSON.parse(JSON.stringify(data1));
        var data6 = JSON.parse(JSON.stringify(data1));*/
        angular.forEach(data, function(value, key) {
          if(!value.start)
          value.start = dateService.getTimeStampForTimeSlot(data[0].date,1);
          list.push(value);

          /*var timeSlot = dateService.getTimeIntervalFromTimeStamp(value.startTime);
          switch(timeSlot){
            case 'Midnight - 4 AM':
              data1.startTime = dateService.getTimeStampForTimeSlot(value.date,1);
              insertData(data1,value);
              break;
            case '4 AM - 8 AM':
              data2.startTime = dateService.getTimeStampForTimeSlot(value.date,2);
              insertData(data2,value);
              break;
            case '8 AM - 12 PM':
              data3.startTime = dateService.getTimeStampForTimeSlot(value.date,3);
              insertData(data3,value);
              break;
            case '12 PM - 4 PM':
              data4.startTime = dateService.getTimeStampForTimeSlot(value.date,4);
              insertData(data4,value);
              break;
            case '4 PM - 8 PM':
              data5.startTime = dateService.getTimeStampForTimeSlot(value.date,5);
              insertData(data5,value);
              break;
            case '8 PM - Midnight':
              data6.startTime = dateService.getTimeStampForTimeSlot(value.date,6);
              insertData(data6,value);
              break;
          }*/
        });
        /*if(data1.startTime !== undefined){
          list.push(data1);
        } else {
          data1.startTime = dateService.getTimeStampForTimeSlot(data[0].date,1);
          list.push(data1);
        }
        if(data2.startTime !== undefined){
          list.push(data2);
        } else {
          data2.startTime = dateService.getTimeStampForTimeSlot(data[0].date,2);
          list.push(data2);
        }
        if(data3.startTime !== undefined){
          list.push(data3);
        } else {
          data3.startTime = dateService.getTimeStampForTimeSlot(data[0].date,3);
          list.push(data3);
        }
        if(data4.startTime !== undefined){
          list.push(data4);
        } else {
          data4.startTime = dateService.getTimeStampForTimeSlot(data[0].date,4);
          list.push(data4);
        }
        if(data5.startTime !== undefined){
          list.push(data5);
        } else {
          data5.startTime = dateService.getTimeStampForTimeSlot(data[0].date,5);
          list.push(data5);
        }
        if(data6.startTime !== undefined){
          list.push(data6);
        } else {
          data6.startTime = dateService.getTimeStampForTimeSlot(data[0].date,6);
          list.push(data6);
        }*/
        return list;
      }

      this.sortGraphData = function(data) {
        if(data.actual.length < 2){
          return data;
        }
        for(var i = 0; i < data.actual.length; i++){
         for(var j = 0; j < data.actual.length; j++){
            if(data.actual[i].timestamp < data.actual[j].timestamp){
              var k = data.actual[i];
              data.actual[i] = data.actual[j];
              data.actual[j] = k;
            }
          }
        }
        return data;
      }

      this.convertIntoTreatmentGraph = function(data) {
        var graphDataList =[];
        var treatmentPerDayValues = [];
        var treatmentLengthValues = [];
        var treatmentPerDayObject = {};
        var treatmentLengthObject = {};
        var count = 0;
        angular.forEach(data, function(value) {
          count = count + 1;
          var treatmentPerDayPoint = {};
          var treatmentLengthPoint = {};
          treatmentPerDayPoint.x = value.startTime;
          treatmentPerDayPoint.timeStamp = value.startTime;
          treatmentPerDayPoint.y = value.avgTreatments;
          treatmentPerDayValues.push(treatmentPerDayPoint);
          treatmentLengthPoint.x = value.startTime;
          treatmentLengthPoint.timeStamp = value.startTime;
          treatmentLengthPoint.y = value.avgTreatmentDuration;
          treatmentLengthValues.push(treatmentLengthPoint);
        });
        treatmentPerDayObject.values = treatmentPerDayValues;
        treatmentPerDayObject.yAxis = 1;
        treatmentPerDayObject.type = hcpDashboardConstants.treatmentGraph.type;
        treatmentPerDayObject.axisLabel = hcpDashboardConstants.treatmentGraph.label.treatmentPerDay;
        treatmentLengthObject.values = treatmentLengthValues;
        treatmentLengthObject.yAxis = 2;
        treatmentLengthObject.type = hcpDashboardConstants.treatmentGraph.type;
        treatmentLengthObject.axisLabel = hcpDashboardConstants.treatmentGraph.label.treatmentLength;

        graphDataList.push(treatmentPerDayObject);
        graphDataList.push(treatmentLengthObject);
      return graphDataList;
      }

      this.convertIntoComplianceGraph = function(data) {
        var graphDataList =[];
        var pressureValues = [];
        var frequencyValues = [];
        var durationValues = [];
        var pressureObject = {};
        var frequencyObject = {};
        var durationObject = {};
        var count = 0;
        angular.forEach(data, function(value) {          
          var pressurePoint = {};
          var durationPoint = {};
          var frequencyPoint = {};
          pressurePoint.x = value.timestamp;
          pressurePoint.y = (!value.pressure) ? 0.005 :value.pressure;
          pressureValues.push(pressurePoint);
          durationPoint.x = value.timestamp;
          durationPoint.y = (!value.pressure) ? 0.005 : value.duration;
          durationValues.push(durationPoint);
          frequencyPoint.x = value.timestamp;
          frequencyPoint.y = (!value.pressure) ? 0.005 : value.frequency;
          frequencyValues.push(frequencyPoint);
        });
        pressureObject.values = pressureValues;
        pressureObject.key = 'pressure';
        pressureObject.yAxis = 2;
        pressureObject.type = 'area';
        frequencyObject.values = frequencyValues;
        frequencyObject.key = 'frequency';
        frequencyObject.yAxis = 2;
        frequencyObject.type = 'area';
        durationObject.values = durationValues;
        durationObject.key = 'duration';
        durationObject.yAxis = 1;
        durationObject.type = 'area';

        graphDataList.push(durationObject);
        graphDataList.push(pressureObject);
        graphDataList.push(frequencyObject);
      return graphDataList;
      }

      this.getToolTipForStepChart = function(value) {
        var toolTip, headerTime = '';
        if(!value.missedTherapy){
          headerTime =  '  ('+ d3.time.format('%I:%M %p')(new Date(value.timestamp)) + ')';
          value.duration = (value.duration === 0 ? '< 1 min': value.duration);
        }
        if(value.note && value.note.note && value.note.note.length > 0){
          toolTip =
            '<div class="tooltip_sub_content">'+
            '<h6 class="after">' + dateService.getDateFromTimeStamp(value.timestamp,patientDashboard.dateFormat,'/') + headerTime + '</h6>' +
            '<ul class="graph_ul">' +
              '<li><span class="pull-left">' + 'Session No. ' +'</span><span class="pull-right value">' + value.sessionNo + '/' + value.treatmentsPerDay +'</span></li>' +
              '<li><span class="pull-left">' + 'Duration' + '</span><span class="pull-right value">' + value.duration  + '</span></li>' +
              '<li><span class="pull-left">' + 'Frequency' + '</span><span class="pull-right value">' + value.frequency  + '</span></li>' +
              '<li><span class="pull-left">' + 'Pressure' +'</span><span class="pull-right value">' + value.pressure  +'</span></li>' +
              '<li><span class="pull-left">' + 'Cough Pauses' +'</span><span class="pull-right value">' + ( value.programmedCoughPauses +  value.normalCoughPauses) +'</span></li>' +
            '</ul>'+
            '</div>'+
            '<div class="tooltip_sub_content">'+
            '<h6>' + 'Note' + '</h6>' +
            '<ul class="graph_ul">' +
              '<span class="notes">'+ (value.note.note)+'</span>' +
            '</ul>'+
            '</div>';
        }else {
          toolTip =
            '<h6>' + dateService.getDateFromTimeStamp(value.timestamp,patientDashboard.dateFormat,'/') + headerTime + '</h6>' +
            '<ul class="graph_ul">' +
              '<li><span class="pull-left">' + 'Session No. ' +'</span><span class="pull-right value">' + value.sessionNo + '/' + value.treatmentsPerDay +'</span></li>' +
              '<li><span class="pull-left">' + 'Duration' + '</span><span class="pull-right value">' + value.duration  + '</span></li>' +
              '<li><span class="pull-left">' + 'Frequency' + '</span><span class="pull-right value">' + value.frequency  + '</span></li>' +
              '<li><span class="pull-left">' + 'Pressure' +'</span><span class="pull-right value">' + value.pressure  +'</span></li>' +
              '<li><span class="pull-left">' + 'Cough Pauses' +'</span><span class="pull-right value">' + ( value.programmedCoughPauses +  value.normalCoughPauses) +'</span></li>' +
              '</ul>';
            }

          return toolTip;
      }

      this.getToolTipForBarChart = function(value) {
        var toolTip = '', headerTime = '';

        if(!value.missedTherapy){
          headerTime =  '  ('+ d3.time.format('%I:%M %p')(new Date(value.start)) + ')';
          value.duration = (value.duration === 0 ? '< 1 min': value.duration);
        }
        if(value.note && value.note.note && value.note.note.length > 0){
            toolTip =
              '<div class="tooltip_sub_content">'+
              '<h6 class="after">' + dateService.getDateFromTimeStamp(value.start,patientDashboard.dateFormat,'/') + headerTime + '</h6>' +
              '<ul class="graph_ul">' +
                '<li><span class="pull-left">' + 'Duration' +'</span><span class="pull-right value">' + value.duration +'</span></li>' +
                '<li><span class="pull-left">' + 'Frequency' + '</span><span class="pull-right value">' + value.frequency  + '</span></li>' +
                '<li><span class="pull-left">' + 'Pressure' +'</span><span class="pull-right value">' + value.pressure +'</span></li>' +
                '<li><span class="pull-left">' + 'Cough Pauses' +'</span><span class="pull-right value">' + ( value.programmedCoughPauses +  value.normalCoughPauses)  +'</span></li>' +                
              '</ul>'+
              '</div>'+

              '<div class="tooltip_sub_content">'+
              '<h6>' + 'Note' + '</h6>' +
              '<ul class="graph_ul">' +
                '<span class="notes">'+(value.note.note)+'</span>' +
              '</ul>'+
              '</div>';
        }else {
          toolTip =
            '<h6 class="after">' + dateService.getDateFromTimeStamp(value.start,patientDashboard.dateFormat,'/') + headerTime + '</h6>' +
            '<ul class="graph_ul">' +
              '<li><span class="pull-left">' + 'Duration' +'</span><span class="pull-right value">' + value.duration +'</span></li>' +
              '<li><span class="pull-left">' + 'Frequency' + '</span><span class="pull-right value">' + value.frequency  + '</span></li>' +
              '<li><span class="pull-left">' + 'Pressure' +'</span><span class="pull-right value">' + value.pressure +'</span></li>' +
              '<li><span class="pull-left">' + 'Cough Pauses' +'</span><span class="pull-right value">' + ( value.programmedCoughPauses +  value.normalCoughPauses)  +'</span></li>' +              
            '</ul>';
        }
        return toolTip;
      }

      this.getToolTipForCompliance = function(value) {
        var toolTip = '';
        if(!value.missedTherapy){
          value.duration = (value.duration === 0 ? '< 1 min': value.duration);
        }
         if(value.note && value.note.note && value.note.note.length > 0){
          toolTip =
                '<div class="tooltip_sub_content">'+
                '<h6>' + dateService.getDateFromTimeStamp(value.start,patientDashboard.dateFormat,'/') + '  ('+ d3.time.format('%I:%M %p')(new Date(value.start)) + ')'  + '</h6>' +
                '<ul class="graph_ul">' +                  
                  '<li><span class="pull-left">' + 'Duration' +'</span><span class="pull-right value">' + value.duration +'</span></li>' +
                  '<li><span class="pull-left">' + 'Frequency' +'</span><span class="pull-right value">' + value.frequency +'</span></li>' +
                  '<li><span class="pull-left">' + 'Pressure' +'</span><span class="pull-right value">' + value.pressure +'</span></li>' +
                  '<li><span class="pull-left">' + 'Cough Pauses' +'</span><span class="pull-right value">' + ( value.programmedCoughPauses +  value.normalCoughPauses) +'</span></li>' +
                '</ul>'+
                '</div>'+
                '<div class="tooltip_sub_content">'+
              '<h6>' + 'Note' + '</h6>' +
              '<ul class="graph_ul">' +
                '<span class="notes">'+(value.note.note)+'</span>' +
              '</ul>'+
              '</div>';
         }else{
          toolTip =
                '<h6>' + dateService.getDateFromTimeStamp(value.start,patientDashboard.dateFormat,'/') + '  ('+ d3.time.format('%I:%M %p')(new Date(value.start)) + ')'  + '</h6>' +
                '<ul class="graph_ul">' +                  
                  '<li><span class="pull-left">' + 'Duration' +'</span><span class="pull-right value">' + value.duration +'</span></li>' +
                  '<li><span class="pull-left">' + 'Frequency' +'</span><span class="pull-right value">' + value.frequency +'</span></li>' +
                  '<li><span class="pull-left">' + 'Pressure' +'</span><span class="pull-right value">' + value.pressure +'</span></li>' +
                  '<li><span class="pull-left">' + 'Cough Pauses' +'</span><span class="pull-right value">' +( value.programmedCoughPauses +  value.normalCoughPauses)+'</span></li>' +
                '</ul>';
         }
        return toolTip;
      }

      this.convertIntoTreatmentGraphTooltipData = function(data){
        var formattedData = [];
         angular.forEach(data, function(value) {            
            value.avgTreatments = (value.avgTreatments < 1) ? 0 : value.avgTreatments;
            value.avgTreatmentDuration = (value.avgTreatmentDuration < 1) ? 0 : value.avgTreatmentDuration;
            formattedData.push(value);
          });
         return formattedData;
      }
    }]);
