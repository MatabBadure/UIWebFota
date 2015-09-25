'use strict';
angular.module('hillromvestApp')
  .factory('clinicService', function($http, localStorageService, headerService) {
    var token = localStorage.getItem('token');
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

      getClinics: function(searchString, sortOption, pageNo, offset) {
        if (searchString === undefined) {
          searchString = '';
        }
        var sortOrder;
        if (sortOption === "") {
          sortOption = "createdAt";
          sortOrder = false;
        } else {
          sortOrder = true;
        };
        return $http.get('api/clinics/search?searchString=' + searchString + '&page=' + pageNo + '&per_page=' + offset + '&sort_by=' + sortOption + '&asc=' + sortOrder, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getAllClinics: function(url) {
        var url = url || '/api/clinics?page=1&per_page=100&filter=deleted:false,parent:true';
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
      }
    };
  });
