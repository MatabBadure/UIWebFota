'use strict';
/**
 * @ngdoc service
 * @name UserService
 * @description
 *
 */
angular.module('hillromvestApp')
  .factory('DoctorService', ['$http', 'headerService', 'URL', function ($http, headerService, URL) {
    return {

      /**
      * @ngdoc method
      * @name editUser
      * @description
      *
      */
      getDoctorsList : function(searchString, pageNo, offset){
        var url = URL.searchHcpUser;
        return $http.get(url + searchString + '&page=' + pageNo + '&per_page=' + offset, {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },

      /**
      * @ngdoc method
      * @name editUser
      * @description
      *
      */
      getDoctor : function (id) {
        var url = URL.getHcpUserById.replace('HCPID', id)
        return $http.get(url,{
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },

      /**
      * @ngdoc method : getDoctors
      * @name getDoctors
      * @description : To get list of doctors available in the the clinics sent in the array.
      *
      */
      getDoctorsInClinic : function(filterArray) {
        var url = URL.hcpsInClinic;
        var flag = false;
        angular.forEach(filterArray, function(filter, index) {
          if (flag === true){
            url = url + ',id:' + filterArray[index];
          } else{
            url = url + 'id:' + filterArray[index];
          }
          flag = true;
        });
        return $http.get(url , {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },

      getPatientsAssociatedToHCP: function(doctorId, clinicId){
        var url = URL.patientsAssociatedToHcp.replace('HCPID', doctorId);
        if(clinicId != null){
          url = url + ""+clinicId;
        }
        return $http.get(url , {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },

      getClinicsAssociatedToHCP : function(doctorId){
        var url = URL.clinicsAssociatedToHcp.replace('HCPID', doctorId);
        return $http.get(url , {
          headers: headerService.getHeader()
        }).success(function (response) {
          return response;
        });
      },

      searchPatientsForHCPOrCliniadmin : function(searchString, role, userId, clinicId, pageNo, offset, filter, sortOption){
        if (sortOption === undefined || sortOption === null || sortOption === "") {
          sortOption = sortConstant.lastName + searchFilters.amp +searchFilters.asc +searchFilters.equal + true;
        } 
        var url = URL.searchPatientsForHCPOrClinicadmin.replace('ROLE', role).replace('USERID', userId).replace('SEARCHSTRING', searchString).replace('PAGENO', pageNo).replace('OFFSET', offset).replace('CLINICID', clinicId).replace('FILTER', filter).replace('SORTBY',sortOption);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },

      searchPatientsForHCPOrClinicadminFromSuperAdmin: function(searchString, role, userId, clinicId, pageNo, offset, filter, sortOption){
        if (sortOption === undefined || sortOption === null || sortOption === "") {
          sortOption = sortConstant.lastName + searchFilters.amp +searchFilters.asc +searchFilters.equal + true;
        } 
        var url = URL.searchPatientsForHCPOrClinicadminFromSuperAdmin.replace('ROLE', role).replace('USERID', userId).replace('SEARCHSTRING', searchString).replace('PAGENO', pageNo).replace('OFFSET', offset).replace('CLINICID', clinicId).replace('FILTER', filter).replace('SORTBY',sortOption);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },

      searchPatientsForHCP : function(searchString, role, userId, clinicId, pageNo, offset, filter, sortOption){
        if (sortOption === undefined || sortOption === null || sortOption === "") {
          sortOption = sortConstant.lastName + searchFilters.amp +searchFilters.asc +searchFilters.equal + true;
        } 
        var url = URL.searchPatientsForHCP.replace('ROLE', role).replace('USERID', userId).replace('SEARCHSTRING', searchString).replace('PAGENO', pageNo).replace('OFFSET', offset).replace('CLINICID', clinicId).replace('FILTER', filter).replace('SORTBY',sortOption);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },
      getclinicsByAdvancedFilter: function(data, sortOption, pageNumber, perPage){
         if (sortOption === "" || sortOption === undefined || sortOption === null) {
          sortOption = sortConstant.name + searchFilters.amp +searchFilters.asc +searchFilters.equal + true;
        }
      var url = URL.hcpAdvancedSearch.replace('PER_PAGE',perPage).replace('SORT_OPTION',sortOption).replace('PAGE',pageNumber);
       return $http.post(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
    };
  }]);