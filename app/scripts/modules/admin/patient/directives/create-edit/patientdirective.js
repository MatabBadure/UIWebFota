'use strict';

angular.module('hillromvestApp')
  .directive('patient', function () {
    return {
      templateUrl: 'scripts/modules/admin/patient/directives/create-edit/create.html',
      restrict: 'E',
      scope: {
        patient: '=patientData',
        onSuccess: '&',
        patientStatus: '=patientStatus'
      },

      controller: ['$scope', '$state', 'notyService', 'dateService', 'UserService', 'StorageService', 'loginConstants', 'commonsUserService', 'addressService', 'patientService',
      function ($scope, $state, notyService, dateService, UserService, StorageService, loginConstants, commonsUserService, addressService, patientService) {

        $scope.open = function () {
          $scope.showModal = true;
        };

        $scope.close = function () {
          $scope.showModal = false;
        };
        $scope.submitted = false;
        $scope.formSubmit = function () {
          $scope.submitted = true;
        };
           $scope.localLang = {
        selectAll       : "Select all",
        selectNone      : "Select none",
        search          : "Type here to search...",
        nothingSelected : "Please select the Device",
        allSelected : "All Selected",
        Cancel : "Cancel",
        OK:"OK"
      };
        $scope.init = function () {
          $scope.userRole = StorageService.get('logged').role;
          $scope.states = [];
          $scope.isAssociateDoctor = false;
          $scope.languages = [{
            "name": "English"
          }, {
            "name": "French"
          }];
          $scope.patient.gender = "Male";
          $scope.showVestGarmentFields = false;
          $scope.showMonarchGarmentFields = false;
          UserService.getState().then(function (response) {
            $scope.states = response.data.states;
          });
          $scope.getGarmentValues();
          $scope.getDeviceTypeValues();
        };
        $scope.getGarmentValues = function(){
          patientService.getGarmentSizeCodeValues().then(function(response){
        $scope.garmentSizeResponse = response.data;
         $scope.garmentSize = $scope.garmentSizeResponse.typeCode;
      }).catch(function(response){
        notyService.showError(response);
      });
          patientService.getGarmentColorCodeValues().then(function(response){
        $scope.garmentColorResponse = response.data;
        $scope.garmentColor = $scope.garmentColorResponse.typeCode;
      }).catch(function(response){
        notyService.showError(response);
      });
       
        patientService.getGarmentTypeCodeValues().then(function(response){
        $scope.garmentTypeResponse = response.data;
          $scope.garmentType = $scope.garmentTypeResponse.typeCode;
      }).catch(function(response){
        notyService.showError(response);
      });
        };
        $scope.getDeviceTypeValues = function(){
          var deviceTypes = [searchFilters.VisiVest_Full,searchFilters.Monarch_Full];
            // $scope.processClinics = function(clinics){
      $scope.deviceTypeNames = [];
       angular.forEach(deviceTypes, function(deviceType, key){
        var obj = {
          'name': deviceType,
          'ticked': true
        };
        $scope.deviceTypeNames.push(obj);
        console.log('devicetype:',$scope.deviceTypeNames)  
      });
   // };
        };

        $scope.selectDeviceTypes = function(){
          console.log("$scope.deviceType",$scope.deviceType);
          $scope.patient.devicetype = "";
          if($scope.deviceType.length){
            for(var i=0;i<$scope.deviceType.length;i++){
              if($scope.deviceType[i].name === searchFilters.VisiVest_Full){
              $scope.patient.devicetype = $scope.patient.devicetype + searchFilters.VisiVest;
            }
            else if($scope.deviceType[i].name === searchFilters.Monarch_Full){
              $scope.patient.devicetype = $scope.patient.devicetype + searchFilters.Monarch;
            }
            else{
               $scope.patient.devicetype = $scope.patient.devicetype + $scope.deviceType[i].name;
            }
            if(i != $scope.deviceType.length-1){
              $scope.patient.devicetype = $scope.patient.devicetype + ',';
            }
            }
          }
          if($scope.patient.devicetype == searchFilters.VisiVest){
          $scope.showVestGarmentFields = true;
          $scope.showMonarchGarmentFields = false;
          }
          else if($scope.patient.devicetype == searchFilters.Monarch){
            $scope.showVestGarmentFields = false;
          $scope.showMonarchGarmentFields = true;
          }
          else if($scope.patient.devicetype == searchFilters.VisiVest+','+searchFilters.Monarch){
              $scope.showVestGarmentFields = true;
          $scope.showMonarchGarmentFields = true;
          }
          else{
            $scope.showVestGarmentFields = false;
          $scope.showMonarchGarmentFields = false;
          }
          console.log("$scope.patient.devicetype",$scope.patient.devicetype);
        };
        $scope.checkforgarmentfields = function(device){
          if(device === searchFilters.VisiVest_Full){
          if($scope.patient.devicetype == searchFilters.VisiVest || $scope.patient.devicetype == searchFilters.VisiVest+','+searchFilters.Monarch)
              {
                return true;
              }
              else return false;
          }
           else if(device === searchFilters.Monarch_Full){
           if($scope.patient.devicetype == searchFilters.Monarch || $scope.patient.devicetype == searchFilters.VisiVest+','+searchFilters.Monarch)
              {
                return true;
              }
              else return false;
          }
        };
        $scope.init();

        $scope.createPatient = function () {
          $scope.submitted = true;
          if(!$scope.patient.city || $scope.form.$invalid || $scope.form.dob.$invalid){
            return false;
          }
          angular.forEach($scope.patient, function(value, key){
            if(!value){
              $scope.patient[key] = null;
            }
          });
          console.log("patient",$scope.patient);
          addressService.getCityStateByZip($scope.patient.zipcode).then(function(response){
            $scope.patient.city = response.data[0].city;
            $scope.patient.state = response.data[0].state;
            if($scope.patientStatus.editMode){
              var data = $scope.patient;
              data.role = 'PATIENT';
              $scope.editUSer(data);
            } else {
              var data = $scope.patient;
              data.role = 'PATIENT';
              $scope.newUser(data);
            }
          }).catch(function(response){ 
            $scope.patient.state = null;
            $scope.patient.city = null;
            $scope.serviceError = response.data.ERROR;
            $scope.isServiceError = true;
          });
        };

        $scope.newUser = function(data) {
          UserService.createUser(data).then(function (response) {
            if(response.status === 201) {
              $scope.patientStatus.isMessage = true;
              $scope.patientStatus.message = "Patient created successfully";
              notyService.showMessage($scope.patientStatus.message, 'success');
              $scope.patientStatus.editMode = false;
              $scope.patientStatus.isCreate = false;
            } else {
              $scope.patientStatus.message = 'Error occured! Please try again';
              notyService.showMessage($scope.patientStatus.message, 'warning');
            }
            $scope.reset();
          }).catch(function (response) {
            $scope.patientStatus.isMessage = true;
            if(response.status == '400' && response.data.message == "HR Id already in use."){
              $scope.patientStatus.message = 'Patient ID ' + $scope.patient.HRID + " already in use.";
            }
            else if(response.data.ERROR !== undefined){
              $scope.patientStatus.message = response.data.ERROR;
            } else {
              $scope.patientStatus.message = 'Error occured! Please try again';
            }
            notyService.showMessage($scope.patientStatus.message, 'warning');
          });
        };

        $scope.editUSer = function(data) {
          UserService.editUser(data).then(function (response) {
            if(response.status === 200) {
              $scope.patientStatus.isMessage = true;
              $scope.patientStatus.message = "Patient updated successfully";
              notyService.showMessage($scope.patientStatus.message, 'success');
            } else {
              $scope.patientStatus.message = 'Error occured! Please try again';
              notyService.showMessage($scope.patientStatus.message, 'warning');
            }
            $scope.reset();
          }).catch(function (response) {
            $scope.patientStatus.isMessage = true;
            if (response.data.message !== undefined) {
              $scope.patientStatus.message = response.data.message;
            } else if(response.data.ERROR !== undefined) {
              $scope.patientStatus.message = response.data.ERROR;
            } else {
              $scope.patientStatus.message = 'Error occured! Please try again';
            }
            notyService.showMessage($scope.patientStatus.message, 'warning');
          });
        };

        if ($scope.patientStatus.editMode) {
          var selectedDate = new Date($scope.patient.dob);
          $scope.patient.age = dateService.getAge(selectedDate);
        }

        $scope.validateADMINorASP = function() {
          if ($scope.patientStatus.editMode &&
            $scope.patientStatus.role != 'ADMIN' &&
            $scope.patientStatus.role != 'Account Services Professional') {
            return true;
          }
        }

        $scope.addHCP = function(){

        }

        $scope.deletePatient = function() {
          UserService.deleteUser($scope.patient.id).then(function(response) {
            $scope.showModal = false;
            $scope.patientStatus.isMessage = true;
            $scope.patientStatus.message = response.data.message;
            notyService.showMessage($scope.patientStatus.message, 'success');
            $scope.reset();
          }).catch(function(response) {
            $scope.patientStatus.isMessage = true;
            $scope.showModal = false;
            if (response.data.message !== undefined) {
              $scope.patientStatus.message = response.data.message;
            }else if(response.data.ERROR !== undefined){
               $scope.patientStatus.message = response.data.ERROR;
            } else {
              $scope.patientStatus.message = 'Error occured! Please try again';
            }
            notyService.showMessage($scope.patientStatus.message, 'warning');
          });
        };

        $scope.cancel = function(){
          $scope.reset();
        };

        $scope.reset = function(){
          $scope.patientStatus.editMode = false;
          $scope.patientStatus.isCreate = false;
          $scope.submitted = false;
          $scope.patient = {};
          $scope.form.$setPristine();
          if($scope.userRole === loginConstants.role.admin){
            $state.go('patientUser');
          }else if($scope.userRole === loginConstants.role.acctservices){
            $state.go('rcadminPatients');
          }
        };

        $scope.getCityState = function(zipcode){   
          delete $scope.serviceError;
          $scope.isServiceError = false;
          if(zipcode){
            addressService.getCityStateByZip(zipcode).then(function(response){
              $scope.patient.city = response.data[0].city;
              $scope.patient.state = response.data[0].state;
            }).catch(function(response){
              $scope.patient.state = null;
              $scope.patient.city = null;
              $scope.serviceError = response.data.ERROR;
              $scope.isServiceError = true;
            });  
          }else{
            delete $scope.patient.city;
            delete $scope.patient.state;
            if($scope.form.zip.$dirty && $scope.form.zip.$showValidationMessage && $scope.form.zip.$invalid){
            }else{
              $scope.serviceError = 'Invalid Zipcode';  
              $scope.isServiceError = true;
            }
          }
        };

        $scope.clearMessages = function(){
          if($scope.patient.zipcode){
            delete $scope.serviceError;
          }
        };

        $scope.$watch("patient.formatedDOB", function(value) {
          if(value && (commonsUserService.isValidDOBDate(value))){
            $scope.patient.dob = value;
              var age = dateService.getAge(new Date(value));
              $scope.patient.age = age;
              if (age === 0) {
                $scope.form.$invalid = true;
              }
          }else{
            $scope.form.dob.$invalid = true;
            $scope.form.$invalid = true;
            $scope.patient.age = '';
          }
         });

        angular.element('#dp2').datepicker({
          endDate: '+0d',
          startDate: '-100y',
          autoclose: true});
         angular.element('#dp3').datepicker({
          endDate: '-1d',
          startDate: '-100y',
          autoclose: true});
      }]
    };
  });
