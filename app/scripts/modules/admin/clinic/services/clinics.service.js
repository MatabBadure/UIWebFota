'use strict';
angular.module('hillromvestApp')
  .factory('clinicService', ['$http', 'headerService', 'URL' ,
    function($http, headerService, URL) {
    return {
      createClinic: function(data) {
        return $http.post('api/clinics', data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      updateClinic: function(data) {
        return $http.put('api/clinics/' + data.id, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      deleteClinic: function(id) {
        return $http.delete('api/clinics/' + id, {
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
        return $http.get('api/clinics/search?searchString=' + searchString + '&page=' + pageNo + '&per_page=' + offset + '&sort_by=' + sortOption + '&filter='+filterBy, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getAllClinics: function(url) {
        var url = url || '/api/clinics?page=1&per_page=&filter=deleted:false,parent:true&sort_by=name&asc=true';
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getClinic: function(id) {
        return $http.get('/api/clinics/' + id, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getClinicAssoctPatients: function(clinicId, pageNo, offset){
        return $http.get('/api/clinics/patients?filter=id:' + clinicId+ '&page=' + pageNo + '&per_page=' + offset  , {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      disassociatePatient: function(patientId, data){
        return $http.put('/api/patient/'+patientId+'/dissociateclinics', data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      getPatients: function(){
        return $http.get('/api/user/all?role=PATIENT', {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      associatePatient: function(patientId, data){
        return $http.put('/api/patient/'+patientId+'/associateclinics', data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getClinicAssoctHCPs: function(clinicId){
        return $http.get('/api/clinics/hcp?filter=id:' + clinicId, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getAssociatedHCPstoClinic: function(clinicId, searchString, filter, pageNo, offset){
        var url = URL.getAssociatedHCPtoClinic.replace('CLINICID',clinicId).replace('SEARCHSTRING',searchString).replace('PAGENO',pageNo).replace('OFFSET',offset).replace('FILTER', filter);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      disassociateHCP: function(hcpId, data){
        return $http.put('/api/user/'+hcpId+'/dissociateclinic', data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      associateHcp: function(clinicId, data){
        return $http.put('/api/clinics/'+clinicId+'/associatehcp', data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getHCPs: function(){
        return $http.get('/api/user/all?role=HCP', {
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
        return $http.get('/api/clinics/'+clinicId+'/clinicadmin', {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getAllClinicAdmins: function(){
        
        return $http.get('/api/user/all?role=CLINIC_ADMIN', {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      addClinicAdmin: function(clinicId, data){
        return $http.put('/api/clinics/'+clinicId+'/associateclinicadmin', data,{
          headers: headerService.getHeader()
        }).success(function(response){
          return response;
        });
      },

      disassociateClinicAdmmin: function(clinicId, data){
        return $http.put('/api/clinics/'+clinicId+'/dissociateclinicadmin', data,{
          headers: headerService.getHeader()
        }).success(function(response){
          return response;
        });
      },

      createClinicAdmin: function(clinicId, data){
        return $http.POST('/api/user', data,{
          headers: headerService.getHeader()
        }).success(function(response){
          return response;
        });
      },
      getAllActiveClinics: function(url) {
        var url = url || '/api/clinics?page=1&per_page=100&filter=deleted:false';
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      searchAssociatedPatientsToClinic : function(searchString, filter, pageNo, offset, clinicId){      
        var url = URL.searchAssociatedPatientsToClinic.replace('SEARCHSTRING', searchString).replace('PAGENO', pageNo).replace('OFFSET', offset).replace('FILTER', filter).replace('CLINICID', clinicId);
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
      }
    };
  }]);
