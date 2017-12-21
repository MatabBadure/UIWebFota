'use strict';
angular.module('hillromvestApp')
  .factory('dateService',['commonsUserService', function(commonsUserService) {
    return {
      getAge: function(dob) {
        var currentDate = new Date(),
         years = currentDate.getFullYear() - dob.getFullYear(),
         age = 0;

        age = years;
        if(years === 0) {
          age = 1;
        }
        if(years < 0) {
          age = 0;
        }
        return age;
      },

      getDate: function(date) {
        return new Date(date);
      },
      getMonth: function(month) {
        month = (month + 1).toString();
        month = month.length > 1 ? month : '0' + month;
        return month;
      },
      getDay: function(day) {
        day = (day).toString();
        day = day.length > 1 ? day : '0' + day;
        return day;
      },
      getYear:function(year) {
        return (year).toString();
      },
      getnDaysBackTimeStamp:function(n) {
        return new Date().getTime() - (1000*60*60*24*n);
      },
      getDayOfYear: function(date) {
        var date = new Date(date);
        var start = new Date(date.getFullYear(), 0, 0);
        var diff = date - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day
      },
      getUTCTimeStamp: function(timeStamp) {
        var timeZoneOffset = new Date(timeStamp).getTimezoneOffset()*60*1000;
        var qualcommOffset = 6*60*60*1000;
        return timeStamp + timeZoneOffset - qualcommOffset;
      },
      getWeekOfMonth: function(d) {
        var date = new Date(d);
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return Math.ceil((date.getDate() + firstDay)/7);
        return new Date(d).getMonthWeek;
      },
      getDateByTimestamp: function(data){
        console.log("data",data);
        var date = new Date(data);
        return this.getMonthName(date) + ' ' + this.getDay(date.getDate()) + ', ' + this.getYear(date.getFullYear(date))
      },
      getDateFromTimeStamp: function(timeStamp,dateFormat,dateSeperator){
        var date = new Date(timeStamp);
        switch(dateFormat) {
          case patientDashboard.serverDateFormat:
            return this.getYear(date.getFullYear(date)) + dateSeperator + this.getMonth(date.getMonth(date)) + dateSeperator + this.getDay(date.getDate());
            break;
          case patientDashboard.dateFormat:
            return this.getMonth(date.getMonth(date)) + dateSeperator + this.getDay(date.getDate()) + dateSeperator + this.getYear(date.getFullYear(date));
            break;
          case patientDashboard.INDdateFormat:
            return this.getDay(date.getDate()) + dateSeperator + this.getMonth(date.getMonth(date)) + dateSeperator + this.getYear(date.getFullYear(date));
        }
      },
      getDateDiffIndays: function(fromTimeStamp,toTimeStamp) {
        return Math.ceil((toTimeStamp - fromTimeStamp)/(1000*60*60*24));
      },
      getTimeStampForTimeSlot: function(date,timeSlot) {
        return this.getStartTimeStampOfDay(new Date(date).getTime()) + (((timeSlot*4)-1)*60*60*1000);
      },
      getStartTimeStampOfDay: function(timeStamp) {
        return timeStamp - (5.5*60*60*1000);
      },
      getListOfDaysInTimeStamp: function(fromTimestamp,toTimeStamp) {
        var daysList = [];
        while (fromTimestamp <= toTimeStamp) {
          daysList.push(fromTimestamp)
          fromTimestamp = fromTimestamp + 24*60*60*1000;
        }
        return daysList;
      },
      getListOfWeeksInTimeStamp: function(fromTimestamp, toTimeStamp) {
        var weekList = [];
        while (fromTimestamp <= toTimeStamp) {
          weekList.push(fromTimestamp)
          fromTimestamp = fromTimestamp + 7*24*60*60*1000;
        }
        return weekList;
      },
      getDaysInMonth: function(monthNumber) {
        switch(monthNumber) {
          case 1:
            return 31;
            break;
          case 2:
            return 28;
            break;
          case 3:
            return 31;
            break;
          case 4:
            return 30;
            break;
          case 5:
            return 31;
            break;
          case 6:
            return 30;
            break;
          case 7:
            return 31;
            break;
          case 8:
            return 31;
            break;
          case 9:
            return 30;
            break;
          case 10:
            return 31;
            break;
          case 11:
            return 30;
            break;
          case 12:
            return 31;
            break;
        }
      },
      getListOfMonthsInTimeStamp: function(fromTimestamp, toTimeStamp) {
        var monthList = [];
        while (fromTimestamp <= toTimeStamp) {
          monthList.push(fromTimestamp)
          var monthNumber = new Date(fromTimestamp).getMonth() + 1;
          var noOfDays = this.getDaysInMonth(monthNumber);
          fromTimestamp = fromTimestamp + noOfDays*24*60*60*1000;
        }
        return monthList;
      },
      sortTimeStamp: function(data,option) {
        for(var i = 0; i < data.length; i++){
          for(var j = 0; j < data.length; j++){
           switch(option){
            case 'ASC':
            if(data[i] < data[j]){
              var k = data[i];
              data[i] = data[j];
              data[j] = k;
            }
            case 'DESC':
            if(data[i] > data[j]){
              var k = data[i];
              data[i] = data[j];
              data[j] = k;
            }
          }
        }
      }
      return data;
    },
      getTimeIntervalFromTimeStamp: function(data) {
        var date = new Date(data);
        var hours = this.getDay(date.getHours().toString());
        switch(hours) {
          case '00':
              return 'Midnight - 4 AM';
              break;
          case '01':
              return 'Midnight - 4 AM';
              break;
          case '02':
              return 'Midnight - 4 AM';
              break;
          case '03':
              return 'Midnight - 4 AM';
              break;
          case '04':
              return '4 AM - 8 AM';
              break;
          case '05':
              return '4 AM - 8 AM';
              break;
          case '06':
              return '4 AM - 8 AM';
              break;
          case '07':
              return '4 AM - 8 AM';
              break;
          case '08':
              return '8 AM - 12 PM';
              break;
          case '09':
              return '8 AM - 12 PM';
              break;
          case '10':
              return '8 AM - 12 PM';
              break;
          case '11':
              return '8 AM - 12 PM';
              break;
          case '12':
              return '12 PM - 4 PM';
              break;
          case '13':
              return '12 PM - 4 PM';
              break;
          case '14':
              return '12 PM - 4 PM';
              break;
          case '15':
              return '12 PM - 4 PM';
              break;
          case '16':
              return '4 PM - 8 PM';
              break;
          case '17':
              return '4 PM - 8 PM';
              break;
          case '18':
              return '4 PM - 8 PM';
              break;
          case '19':
              return '4 PM - 8 PM';
              break;
          case '20':
              return '8 PM - Midnight';
              break;
          case '21':
              return '8 PM - Midnight';
              break;
          case '22':
              return '8 PM - Midnight';
              break;
          case '23':
              return '8 PM - Midnight';
              break;
          default:
              break;
        }
      },

      getMonthName: function(date){
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var date = new Date(date);
        return month[date.getMonth()];
      },

      getDays: function(date){
        var oneDay = 24*60*60*1000;
        var currentDate = new Date();
        var diffDays = Math.floor((currentDate.getTime() - date.getTime())/oneDay);
        return diffDays;
      },

      convertYyyyMmDdToTimestamp: function(date){
        if(date.indexOf("-") > -1){
          var startDate = date.split("-"); // turning it from yyyy-mm-dd mm/dd/yyyy
          var dd = parseInt(startDate[2]) + 1;
          var tempDate = startDate[1]+"/"+dd+"/"+startDate[0];
          return new Date(tempDate).getTime();
        }else{
          return 0;
        }

    },
    convertDateToYyyyMmDdFormat: function(date){
      var tempDate = new Date(date);
      var tempMonth = tempDate.getMonth()+1;
      var tempDay = tempDate.getDate();
      if(tempMonth < 10){
        tempMonth = "0"+tempMonth;
      }
      if(tempDay < 10){
        tempDay = "0"+tempDay;
      }

      var dateFormatted = tempDate.getFullYear()+'-' + tempMonth + '-'+ tempDay;
      return dateFormatted;
    },

    getDateTimeFromTimeStamp: function(timeStamp,dateFormat,dateSeperator){
      var date = new Date(timeStamp);
      //var date = new Date(timeStamp*1000);
      // Hours part from the timestamp
      var hours = (date.getHours() >= 10) ? date.getHours() : "0"+date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


      switch(dateFormat) {
        case patientDashboard.serverDateFormat:
          return this.getYear(date.getFullYear(date)) + dateSeperator + this.getMonth(date.getMonth(date)) + dateSeperator + this.getDay(date.getDate()) + " " + formattedTime;
          break;
        case patientDashboard.dateFormat:
          return this.getMonth(date.getMonth(date)) + dateSeperator + this.getDay(date.getDate()) + dateSeperator + this.getYear(date.getFullYear(date)) + " " + formattedTime;
          break;
        case patientDashboard.INDdateFormat:
          return this.getDay(date.getDate()) + dateSeperator + this.getMonth(date.getMonth(date)) + dateSeperator + this.getYear(date.getFullYear(date)) + " " + formattedTime;
      }
    },
    convertMMDDYYYYHHMMSSstamp: function(date){
        if(date && date.indexOf("/") > -1 && date.indexOf(" ") > -1 ){
          var dateTime = date.split(" ");
          var startDate = dateTime[0].split("/"); // turning it from MM/DD/YYYY HH:MM:SS to timestamp
          var formattedDate = startDate[2] + "-" + startDate[0] + "-" + startDate[1] + " " + dateTime[1];
          if(commonsUserService.getBrowser().indexOf("chrome") !== -1){
            return new Date(formattedDate).getTime();
          }else{
            return new Date(formattedDate.replace(/\s/, 'T')).getTime();
          }
          
        }
    },
    getDateFromYYYYMMDD: function(date, dateSeperator){
        if(date && date.indexOf("-") > -1){
          var dateTime = date.split("-");          
          return dateTime[1] + dateSeperator + dateTime[2] + dateSeperator + dateTime[0];
        }        
    },

    // this method is only to test whether the current browser is chrome or not
    isChrome: function(){
        var userAgent =navigator.userAgent;
        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
       };
       return 'unknown';
      },
    // this method converts the date string mm/dd/yyyy hh:mm:ss to timestamp 
    convertToTimestamp: function(date){ 
        var dateTime1 = date;  
        var dateTime2 = false;
        if(date && date.indexOf("/") > -1){
        if(date.indexOf(" ") > -1 ){
          var dateTime = date.split(" ");
          dateTime1 = dateTime[0]; dateTime2 = dateTime[1];
        }
        var startDate = dateTime1.split("/"); // turning it from MM/DD/YYYY HH:MM:SS to timestamp
        var formattedDate = (dateTime2) ? startDate[2] + "-" + startDate[0] + "-" + startDate[1] + " " + dateTime2 : startDate[2] + "-" + startDate[0] + "-" + startDate[1];
        if(this.isChrome().indexOf("chrome") !== -1){
          return new Date(formattedDate).getTime();
        }else{
          return new Date(formattedDate.replace(/\s/, 'T')).getTime();
        }
        
      }
     },

    //Gimp-18
    minsToHHMMSS: function (totalMins) {
    var mins_num = parseFloat(totalMins, 10); // don't forget the second param
    var hours   = Math.floor(mins_num / 60);
    var minutes = Math.floor((mins_num - ((hours * 3600)) / 60));
    //var seconds = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));

    // Appends 0 when unit is less than 10
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    //if (seconds < 10) {seconds = "0"+seconds;}
    return hours+' hours '+minutes +' minutes';
    },
  //End of Gimp-18  
  //Gimp-31
     getinMomentFormat: function(x,fromFormat){
      if(x && fromFormat){
      switch(fromFormat){
        case "mm/dd/yyyy hh:mm:ss":
        var res = x.split(" ");
        var digits = res[0].split('/');
        return (digits[2] + '-' + digits[0] + '-' + digits[1] + ' ' + res[1]);
        break;
        case "mm/dd/yyyy":
        var digits = x.split('/');
        return (digits[2] + '-' + digits[0] + '-' + digits[1]);
        break;       
        default:
        return x;
      };
    }
    }
  //End of Gimp-31  
    };
  }]);
