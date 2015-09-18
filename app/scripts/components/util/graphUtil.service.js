'use strict';

angular.module('hillromvestApp')
    .service('graphUtil', function (dateService) {
      
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

      this.convertToHMRStepGraph = function(data,colorCode) {
        var pointSet = [];
        var graphData = {};
        var graphDataList =[];
        var count = 1;
        angular.forEach(data.actual, function(value) {
          var point = {};
          point.x = count++;
          point.y = Math.floor(value.hmr);
          point.timeStamp = value.timestamp;
          pointSet.push(point);
        });
        graphData.values = pointSet;
        graphData.color = colorCode;
        graphData.area = true;
        graphDataList.push(graphData);
      return graphDataList;
      }

      var createCumulativeGraph = function(data,key,color) {
        var pointSet = [];
        var graphData = {};
        var count = 1;
        angular.forEach(data, function(value) {
          var point = [];
          point.push(count++);
          switch(key){
            case 'MissedTherapy Days':
              point.push(value.MissedTherapy);
              break;
            case 'HMR Non-Compliance':
              point.push(value.nonCompliance);
              break;
            case 'Setting Deviation':
              point.push(value.settingDeviation);
              break;
            case 'No Events Recorded':
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

      this.convertIntoCumulativeGraph = function(data) {        
        var graphDataList =[];
        graphDataList.push(createCumulativeGraph(data,'MissedTherapy Days','red'));
        graphDataList.push(createCumulativeGraph(data,'HMR Non-Compliance','green'));
        graphDataList.push(createCumulativeGraph(data,'Setting Deviation','blue'));
        graphDataList.push(createCumulativeGraph(data,'No Events Recorded','orange'));
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
        range.max = Math.ceil((max + (max-min)/4)/10) * 10;
        if(min !== 0 && min > (max-min)){
          range.min = Math.floor((min - ((max-min)/4))/10) * 10;  
        } else {
          range.min = min;
        }
        return range;
      }

      this.getYaxisRangeBarGraph = function(data) {
        var range = {};
        var hmrSet = [];
        angular.forEach(data, function(value) {
          if(value.hmr !== 'null')
           hmrSet.push(value.hmr);
        });
        var max = arrayMax(hmrSet);
        var min = arrayMin(hmrSet);
        range.max = Math.ceil(Math.floor(max/60)/10) * 10;
        if(min !== 0 && min > (max-min)){
          range.min = Math.floor(Math.floor((min - ((max-min)/2))/60)/10) * 10;  
        }
        if(range.min === undefined){
          range.min = 0;
        }
        if(range.max === undefined){
          range.max = 0;
        }
        return range;
      }


      this.getYaxisRangeComplianceGraph = function(data) {
          var range = {};
          var durationSet = [];
          var frequencySet = [];
          var pressureSet = [];
          angular.forEach(data.actual, function(value) {
              durationSet.push(value.duration);
              pressureSet.push(value.weightedAvgPressure);
              frequencySet.push(value.weightedAvgFrequency);
          });
          var maxDuration = arrayMax(durationSet);
          var maxRecommendedDuration = data.recommended.maxMinutesPerTreatment * data.recommended.treatmentsPerDay;
          maxDuration = (maxDuration > maxRecommendedDuration) ? maxDuration : maxRecommendedDuration;
          range.maxDuration = maxDuration;

          var maxPressure = arrayMax(pressureSet);
          maxPressure = (maxPressure > data.recommended.maxPressure) ? maxPressure : data.recommended.maxPressure;
          range.maxPressure = maxPressure;
          var maxFrequency = arrayMax(frequencySet);
          maxFrequency = (maxFrequency > data.recommended.maxFrequency) ? maxFrequency : data.recommended.maxFrequency;
          range.maxFrequency = maxFrequency;
          return range;
      }

      this.convertIntoHMRBarGraph = function(data) {
        var pointSet = [];
        var graphData = {};
        var graphDataList =[];
        angular.forEach(data, function(value) {
          var point = [];
          point.push(value.startTime);
          point.push(Math.floor(value.hmr/60));
          pointSet.push(point);
        });
        graphData["values"] = pointSet;
        graphDataList.push(graphData);
      return graphDataList;
      }

      this.convertToHMRBarGraph = function(data,colorCode) {
        var pointSet = [];
        var graphData = {};
        var graphDataList =[];
        angular.forEach(data, function(value) {
          var point = {};
          point.x = value.startTime;
          point.y = Math.floor(value.hmr/60);
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
                if(dateService.getDateFromTimeStamp(value.timestamp) === dateService.getDateFromTimeStamp(timeStamp)){
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
        var data1 = {frequency : 0, pressure : 0, durationInMinutes : 0, programmedCaughPauses : 0, 
                      normalCaughPauses : 0, caughPauseDuration : 0, hmr : 'null'};
        var data2 = JSON.parse(JSON.stringify(data1));
        var data3 = JSON.parse(JSON.stringify(data1));
        var data4 = JSON.parse(JSON.stringify(data1));
        var data5 = JSON.parse(JSON.stringify(data1));
        var data6 = JSON.parse(JSON.stringify(data1));
        angular.forEach(data, function(value) {
          var timeSlot = dateService.getTimeIntervalFromTimeStamp(value.startTime);
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
          }
        });
        if(data1.startTime !== undefined){
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
        }
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
          treatmentPerDayPoint.x = count;
          treatmentPerDayPoint.timeStamp = value.timeStamp;
          treatmentPerDayPoint.y = value.dailyTreatmentNumber;
          treatmentPerDayValues.push(treatmentPerDayPoint);
          treatmentLengthPoint.x = count;
          treatmentLengthPoint.timeStamp = value.timeStamp;
          treatmentLengthPoint.y = value.avgTreatmentDuration;
          treatmentLengthValues.push(treatmentLengthPoint);
        });
        treatmentPerDayObject.values = treatmentPerDayValues;
        treatmentPerDayObject.key = 'Average Treatments Per Day';
        treatmentPerDayObject.yAxis = 1;
        treatmentPerDayObject.type = 'area';
        treatmentLengthObject.values = treatmentLengthValues;
        treatmentLengthObject.key = 'Average Length of Treatment';
        treatmentLengthObject.yAxis = 2;
        treatmentLengthObject.type = 'area';

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
          count = count + 1;
          var pressurePoint = {};
          var durationPoint = {};
          var frequencyPoint = {};
          pressurePoint.x = count;
          pressurePoint.timeStamp = value.timestamp;
          pressurePoint.y = value.weightedAvgPressure;
          pressureValues.push(pressurePoint);
          durationPoint.x = count;
          durationPoint.timeStamp = value.timestamp;
          durationPoint.y = value.duration;
          durationValues.push(durationPoint);
          frequencyPoint.x = count;
          frequencyPoint.timeStamp = value.timestamp;
          frequencyPoint.y = value.weightedAvgFrequency;
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
    });
