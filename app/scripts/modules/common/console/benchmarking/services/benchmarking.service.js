'use strict';
/**
 * @ngdoc service
 * @name loginanalyticsService
 * @description
 *
 */
angular.module('hillromvestApp')
  .factory('benchmarkingService',['$http','headerService','URL', function ($http, headerService, URL) {
    return {

      /**
      * @ngdoc method
      * @name getBenchmarking
      * @description 
      * only Admin/RC Admin/Associate can view it.
      */
      getBenchmarkingReport: function(fromDate, toDate, XAxis, type, benchmarkType, range, state, city) {
        var url = URL.getBenchmarking.replace('FROM', fromDate).replace('TO', toDate).replace('XAXIS',XAxis).replace('TYPE',type).replace('BENCHMARKTYPE',benchmarkType).replace('RANGE',range);
        if(state ){
          url = url+'&state='+state;
        }
        if(city ){
          url = url+'&city='+city;
        }
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getClinicDiseaseReport: function(fromDate, toDate, XAxis, ageGroupRange, clinicSizeRange, state, city){
        var url = URL.getClinicDisease.replace('FROM', fromDate).replace('TO', toDate).replace('XAXIS',XAxis).replace('AGERANGE', ageGroupRange).replace('CLINICRANGE', clinicSizeRange);
        if(state){
          url = url+'&state='+state;
        }
        if(city){
          url = url+'&city='+city;
        }
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getClinicDiseaseReportIgnoreXaxis: function(from, to, state, city){
        var url = URL.getClinicDiseaseNonXaxis.replace('FROM', from).replace('TO', to);
        if(state){
          url = url+'&state='+state;
        }
        if(city){
          url = url+'&city='+city;
        }

        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }

    };
  }]);