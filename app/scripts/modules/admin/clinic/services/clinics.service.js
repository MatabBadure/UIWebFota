'use strict';
angular.module('hillromvestApp')
  .factory('clinicService', ['$http', 'headerService', 'URL' ,
    function($http, headerService, URL) {
    return {
      createClinic: function(data) {
        var url = URL.clinicBaseURL;
        return $http.post(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      updateClinic: function(data) {
        var url = URL.clinicBaseURL + '/' + data.id;
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      updateDaysForCalculation: function(data,clinicId) {
        var url = URL.clinicBaseURL + '/' + clinicId;
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      adherenceResetProgress: function(clinicId){
        var url = URL.adherenceResetProgress.replace('CLINICID', clinicId);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      deleteClinic: function(id) {
        var url = URL.clinicBaseURL + '/' + id;
        return $http.delete(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getClinics: function(searchString, sortOption, pageNo, offset, filter) {
        var filterBy = (filter && filter != undefined) ? filter : stringConstants.emptyString;
        if (searchString === undefined) {
          searchString = '';
        }
        if (sortOption === "" || sortOption === undefined || sortOption === null) {
          sortOption = sortConstant.name + searchFilters.amp +searchFilters.asc +searchFilters.equal + true;
        }
        var url = URL.searchClinics.replace('SEARCHSTRING', searchString).replace('PAGENO', pageNo).replace('OFFSET', offset).replace('SORTBY', sortOption).replace('FILTER', filterBy);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getAllClinics: function(url) {
        var url = url || URL.allActiveParentClinics;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getClinic: function(id) {
        var url = URL.clinicBaseURL + '/' + id;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getClinicAssoctPatients: function(clinicId, pageNo, offset){
        var url = URL.clinicAssoctPatients.replace('CLINICID', clinicId).replace('PAGENO', pageNo).replace('OFFSET', offset);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      disassociatePatient: function(patientId, data){
        var url = URL.disassociatePatientFromClinic.replace('PATIENTID', patientId);
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      getPatients: function(){
        var url = URL.getAllUsersByRole.replace('ROLE', 'PATIENT');
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      associatePatient: function(patientId, data){
        var url = URL.associatePatientToClinic.replace('PATIENTID',patientId);
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getClinicAssoctHCPs: function(clinicId){
        var url = URL.clinicAssociatedHCPs.replace('CLINICID', clinicId);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getAssociatedHCPstoClinic: function(clinicId, searchString, filter, sortOption, pageNo, offset){
        var url = URL.getAssociatedHCPtoClinic.replace('CLINICID',clinicId).replace('SEARCHSTRING',searchString).replace('PAGENO',pageNo).replace('OFFSET',offset).replace('FILTER', filter).replace('SORTBY', sortOption);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      disassociateHCP: function(hcpId, data){
        var url = URL.disassociateHcpFromClinic.replace('HCPID', hcpId);
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      associateHcp: function(clinicId, data){
        var url = URL.associateHcpToClinic.replace('CLINICID', clinicId);
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getHCPs: function(){
        var url = URL.getAllUsersByRole.replace('ROLE', 'HCP');
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getHCPsWithClinicName: function(){
        var url = URL.getHCPsWithClinicName;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getClinicAdmins: function(clinicId){
        var url = URL.clinicAdminByClinicId.replace('CLINICID', clinicId)
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getAllClinicAdmins: function(){
        var url = URL.getAllUsersByRole.replace('ROLE', 'CLINIC_ADMIN');
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      addClinicAdmin: function(clinicId, data){
        var url = URL.associateClinicAdmin.replace('CLINICID', clinicId);
        return $http.put(url, data,{
          headers: headerService.getHeader()
        }).success(function(response){
          return response;
        });
      },

      disassociateClinicAdmmin: function(clinicId, data){
        var url = URL.disassociateClinicAdmmin.replace('CLINICID', clinicId)
        return $http.put(url, data,{
          headers: headerService.getHeader()
        }).success(function(response){
          return response;
        });
      },

      getAllActiveClinics: function(url) {
        var url = url || URL.allActiveClinics;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      searchAssociatedPatientsToClinic : function(searchString, filter, sortOption, pageNo, offset, clinicId){
        var url = URL.searchAssociatedPatientsToClinic.replace('SEARCHSTRING', searchString).replace('PAGENO', pageNo).replace('OFFSET', offset).replace('FILTER', filter).replace('CLINICID', clinicId).replace('SORTBY', sortOption);
        return $http.get(url, {
          headers: headerService.getHeader()        
        });
      },

      getNonAssocaitedPatients : function(clinicId){
        var url = URL.nonAssociatedPatientForClinic;
        url = url.replace('CLINICID', clinicId);
        return $http.get(url, {
          headers: headerService.getHeader()        
        });
      },

      getClinicsByClinicadmin : function(clinicadmin){
        var url = URL.getClinicsByClinicadmin.replace('CLINICADMIN', clinicadmin);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getAdherenceScoreDays : function(){
        var url = URL.getAdherenceDays;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

	  getClinicSpeciality : function(){
        var url = URL.getClinicSpeciality;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }
    };
  }]);
