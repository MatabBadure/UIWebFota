'use strict';
/**
 * @ngdoc service
 * @name patientService
 * @description A service that calls REST apis to perform operations related to patients.
 *
 */
angular.module('hillromvestApp')
  .factory('patientService',['$http', 'headerService', 'URL', function ($http, headerService,URL) {
    return {

      /**
      * @ngdoc method
      * @name getPatients
      * @description To get list of patients.
      *
      */
      getPatients: function(searchString, sortOption, pageNo, offset, filter) {
        var filterBy = (filter && filter != undefined) ? filter : stringConstants.emptyString;
        var url = URL.patientSearch;
        var sortOrder;
        if (searchString === undefined) {
          searchString = '';
        }
        if (sortOption === "" || sortOption === undefined || sortOption === null) {
          sortOption = sortConstant.plastName + searchFilters.amp + searchFilters.asc + searchFilters.equal + true;
        }
        url = url + searchString + '&page=' + pageNo + '&per_page=' + offset + '&sort_by=' + sortOption + '&filter=' + filterBy;
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
       * @ngdoc method
       * @name getPatientInfo
       * @description To get individual patient's information based on patient ID.
       *
       */
      getPatientInfo: function(id) {
        var url = URL.patientById.replace('PATIENTID', id);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
       * @ngdoc method
       * @name associateHCPToPatient
       * @description To associate HCP to patient.
       *
       */
      associateHCPToPatient: function(data, id) {
        var url = URL.associateHcpToPatient.replace('PATIENTID', id);
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getAssociateHCPToPatient: function(id) {
        var url = URL.associatedHcpsToPatient.replace('PATIENTID', id);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
       * @ngdoc method
       * @name getDoctorsLinkedToPatient
       * @description To get list of HCPs linked to patient.
       *
       */
      getHCPsLinkedToPatient: function(id) {
        var url = URL.associatedHcpsToPatient.replace('PATIENTID', id);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
       * @ngdoc method
       * @name disassociateDoctorFromPatient
       * @description To disassciate a HCP from patient.
       *
       */
      disassociateHCPFromPatient: function(id, data) {
        var url = URL.disassociateHCPFromPatient.replace('PATIENTID', id);
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
       * @ngdoc method
       * @name getClinicsLinkedToPatient
       * @description To get list of clinics associated to patient.
       *
       */
      getClinicsLinkedToPatient: function(id) {
        var url = URL.clinicsAssociatedToPatient.replace('PATIENTID', id);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
       * @ngdoc method
       * @name disassociateClinicsFromPatient
       * @description To remove clinic(s) associated to patient.
       *
       */
      disassociateClinicsFromPatient: function(id, data) {
        var url = URL.disassociateClinicsFromPatient.replace('PATIENTID', id);
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getPatientsInClinic: function(filterArray) {
        var url = URL.patientInClinic;
        var flag = false;
        angular.forEach(filterArray, function(filter, index) {

          if (flag === true) {
            url = url + ',id:' + filterArray[index];
          } else {
            url = url + 'id:' + filterArray[index];
          }
          flag = true;
        });
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      /**
       * @ngdoc method
       * @name disassociatePatient
       * @description To remove patient.
       *
       */
      disassociatePatient: function(id) {
        var url = URL.userBaseUrl + id;
        return $http.delete(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      /**
       * @ngdoc method
       * @name associateClinicToPatient
       * @description To add clinics to patient.
       *
       */
      associateClinicToPatient: function(id, data) {
        var url = URL.associateClinicToPatient.replace('PATIENTID', id);
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      /**
       * @ngdoc method
       * @name getDevices
       * @description To get devices associated to patient.
       *
       */
      getDevices: function(id) {
        var url = URL.deviceAssociatedToPatient.replace('PATIENTID', id);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      /**
       * @ngdoc method
       * @name getCaregiversLinkedToPatient
       * @description To get caregivers associated to patient.
       *
       */
      getCaregiversLinkedToPatient: function(id) {
        var url = URL.caregiverAssociatedToPatient.replace('PATIENTID', id)
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      /**
       * @ngdoc method
       * @name disassociateCaregiversFromPatient
       * @description To remove caregivers associated to patient.
       *
       */
      disassociateCaregiversFromPatient: function(patientId, caregiverId) {
        var url = URL.disassociateCaregiversFromPatient.replace('PATIENTID', patientId).replace('CAREGIVERID', caregiverId);
        return $http.delete(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      /**
       * @ngdoc method
       * @name disassociateCaregiversFromPatient
       * @description To add caregivers associated to patient.
       *
       */
      associateCaregiversFromPatient: function(patientId, data) {
        var url = URL.caregiverAssociatedToPatient.replace('PATIENTID', patientId);
        return $http.post(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      addDevice: function(id, data) {
        var url = URL.addDevice.replace('PATIENTID', id);
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      deleteDevice: function(id, device) {
        var url = URL.deactivateDevice.replace('PATIENTID', id).replace('SERIALNUMBER', device.serialNumber);
        return $http.delete(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      getProtocol: function(id) {
        var url = URL.addEditProtocol.replace('PATIENTID', id);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      addProtocol: function(id, data) {
        var url = URL.addEditProtocol.replace('PATIENTID', id);
        return $http.post(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      editProtocol: function(id, data) {
        var url = URL.addEditProtocol.replace('PATIENTID', id);
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },

      deleteProtocol: function(id, protocolId) {
        var url = URL.protocolById.replace('PATIENTID', id).replace('PROTOCOLID', protocolId);
        return $http.delete(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      updateCaregiver: function(patientId, caregiverId, data) {
        var url = URL.caregiverById.replace('PATIENTID', patientId).replace('CAREGIVERID', caregiverId);
        return $http.put(url, data, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      getCaregiverById: function(patientId, caregiverId) {
        var url = URL.caregiverById.replace('PATIENTID', patientId).replace('CAREGIVERID', caregiverId);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      getProtocolById: function(patientId, protocolId) {
        var url = URL.protocolById.replace('', patientId).replace('PROTOCOLID', protocolId);
        return $http.get(url, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      },
      getTherapyDataAsCSV: function(patientId, startDate, endDate) {
         var url = URL.therapyDataAsCSV.replace('PATIENTID', patientId).replace('STARTDATE', startDate).replace('ENDDATE', endDate);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },

      getDeviceDataAsCSV: function(patientId, startDateTimestamp, endDateTimestamp){
        var url = URL.deviceDataAsCSV.replace('PATIENTID', patientId).replace('STARTDATE', startDateTimestamp).replace('ENDDATE', endDateTimestamp);
        return $http.get(url, {
          headers: headerService.getHeaderForXls(),responseType: "arraybuffer"
        });
      },

      getTransmissionDate: function(patientId){
        var url = URL.getTransmissionDate.replace('PATIENTID', patientId);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },

      getHCPsToLinkToPatient: function(patientId, searchString, pageNo, offset){
        var url = URL.getHCPsToLinkToPatient.replace('PATIENTID', patientId).replace('SEARCHSTRING', searchString).replace('PAGENO', pageNo).replace('OFFSET', offset);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },

      getUserSecurityQuestion: function(userId){
        var url = URL.getUserSecurityQuestion.replace('USERID', userId);
        return $http.get(url, {
          headers: headerService.getHeader()
        });
      },

      reactivatePatient: function(patientId){
        var url = URL.reactiavtePatient.replace('PATIENTID', patientId);
        return $http.put(url, null, {
          headers: headerService.getHeader()
        }).success(function(response) {
          return response;
        });
      }

      
    };
  }]);
