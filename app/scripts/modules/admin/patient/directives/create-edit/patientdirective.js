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

      controller: ['$scope', '$state', 'notyService', 'dateService', 'UserService', 'StorageService', 'loginConstants',
      function ($scope, $state, notyService, dateService, UserService, StorageService, loginConstants) {

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
          UserService.getState().then(function (response) {
            $scope.states = response.data.states;
          });
        };

        $scope.init();

        $scope.createPatient = function () {
          if($scope.form.$invalid){
            return false;
          }
          angular.forEach($scope.patient, function(value, key){
            if(!value){
              $scope.patient[key] = null;
            }
          });
          if($scope.patientStatus.editMode){
            var data = $scope.patient;
            data.role = 'PATIENT';
            $scope.editUSer(data);
          } else {
            var data = $scope.patient;
            data.role = 'PATIENT';
            $scope.newUser(data);
          }
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

        $scope.$watch("patient.formatedDOB", function(value) {
          if(value && !$scope.isValidDate(value)){
           $scope.form.dob.$invalid = true;
          }
         });

        $scope.isValidDate = function(dob) {
          var parts   = dob.split("/"),
            month   = parseInt(parts[0], 10),
            day     = parseInt(parts[1], 10),
            year    = parseInt(parts[2], 10),
            monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
          if(year < 1000 || year > 3000 || month == 0 || month > 12) {
            return false;
          }
          //For leap years
          if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
            monthLength[1] = 29;
          }

          return day > 0 && day <= monthLength[month - 1];
        };

        angular.element('#dp2').datepicker({
          autoclose: true}).
          on('changeDate', function(ev) {
          var selectedDate = angular.element('#dp2').datepicker("getDate");
          var currentDate = new Date();
          if(selectedDate > currentDate || $scope.form.dob.$error.pattern){
            $scope.form.dob.$invalid = true;
            $scope.patient.age = '';
          } else{
            var _month = (selectedDate.getMonth()+1).toString();
            _month = _month.length > 1 ? _month : '0' + _month;
            var _day = (selectedDate.getDate()).toString();
            _day = _day.length > 1 ? _day : '0' + _day;
            var _year = (selectedDate.getFullYear()).toString();
            var dob = _month+"/"+_day+"/"+_year;
            if($scope.isValidDate(dob)) {
              $scope.patient.dob = dob;
              var age = dateService.getAge(selectedDate);
              angular.element('.age').val(age);
              $scope.patient.age = age;
              if (age === 0) {
                $scope.form.$invalid = true;
              }
            } else {
              $scope.form.dob.$invalid = true;
            }
          }
          angular.element("#dp2").datepicker('hide');
          $scope.$digest();
        });
      }]
    };
  });
