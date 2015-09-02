'use strict';

angular.module('hillromvestApp').controller('patientprofileController', function ($scope, $state, $stateParams, notyService, patientService, UserService, AuthServerProvider,Password, Auth) {
	$scope.init = function(){
		var currentRoute = $state.current.name;	
		$scope.profileTab = currentRoute;	
		$scope.userRole = localStorage.getItem('role');			
		if (currentRoute === 'patientProfile') {
			$scope.initProfileView();        
		}else if(currentRoute === 'patientProfileEdit'){
			$scope.initProfileEdit();
		}else if(currentRoute === 'patientResetPassword'){
			$scope.initResetPassword();
		}else if(currentRoute === 'patientSettings'){
			$scope.initPatientSettings();
		}
		
	};

	$scope.isProfileTabActive = function(tab) {
      if ($scope.profileTab.indexOf(tab) !== -1) {
        return true;
      } else {
        return false;
      }
    };

	$scope.switchProfileTabs = function(tab){
		$scope.profileTab = tab;
		$state.go(tab);	
	};

	$scope.getPatientById = function(patientId){
      patientService.getPatientInfo(patientId).then(function(response){
        $scope.patientView = response.data;
      }).catch(function(response){});
    };

	$scope.initProfileView = function(){
		UserService.getUser(localStorage.getItem('patientID')).then(function(response){
			$scope.patientView = response.data.user;
		}).catch(function(response){});
		AuthServerProvider.getSecurityQuestions().then(function(response){
			$scope.questions = response.data
		}).catch(function(response){});		
	};

	$scope.openEditDetail = function(){
		$state.go("patientProfileEdit");	
	};

	$scope.initProfileEdit = function(){
		UserService.getUser(localStorage.getItem('patientID')).then(function(response){
			$scope.editPatientProfile = response.data.user;
		}).catch(function(response){});
		AuthServerProvider.getSecurityQuestions().then(function(response){
			$scope.questions = response.data
		}).catch(function(response){});		
	};

	$scope.cancelEditProfile = function(){
		$state.go("patientProfile");
		$scope.editPatientProfile = "";
	};	

	$scope.updateProfile = function(){
      $scope.submitted = true;
      if($scope.form.$invalid){
        return false;
      }
      if($scope.resetAccount){
        var data = {
          "questionId": $scope.resetAccount.question.id,
          "answer": $scope.resetAccount.answer
        };
        AuthServerProvider.changeSecurityQuestion(data, $scope.editPatientProfile.id).then(function(response){
        }).catch(function(response){
          if(response.data.message){
            notyService.showMessage(response.data.message, 'warning');
          } else if(response.data.ERROR){
            notyService.showMessage(response.data.ERROR, 'warning');
          }
        });
      }
      $scope.editPatientProfile.role = $scope.editPatientProfile.authorities[0].name;
      $scope.editPatientProfile.dob = null;
      UserService.editUser($scope.editPatientProfile).then(function(response){
        notyService.showMessage(response.data.message, 'success');
        $state.go('patientProfile');
      }).catch(function(response){
        if(response.data.message){
          notyService.showMessage(response.data.message, 'warning');
        } else if(response.data.ERROR){
          notyService.showMessage(response.data.ERROR, 'warning');
        }
      });
    };

    $scope.initResetPassword = function(){
    	$scope.profile = {};
    	//$scope.profile.password = null;
    };

    $scope.updatePassword = function(){
      $scope.submitted = true;
      if($scope.form.$invalid){
        return false;
      }
      var data = {
        'password': $scope.profile.password,
        'newPassword': $scope.profile.newPassword
      };
      Password.updatePassword(localStorage.getItem('patientID'), data).then(function(response){
        Auth.logout();
        notyService.showMessage(response.data.message, 'success');
        $state.go('login');
      }).catch(function(response){
      	if(response && response.data && response.data.ERROR)
        notyService.showMessage(response.data.ERROR, 'warning');
      });
    };


   

    $scope.initPatientSettings = function(){ 	
		UserService.getPatientUserNotification(localStorage.getItem('patientID')).then(function(response){
			$scope.patientUser = response.data.user;
		}).catch(function(){
		   // show the error message
		});
    };

    $scope.toggleNotification = function(notification){
    	var data = {"isHMRNotification" : $scope.patientUser.hmrnotification, "isAcceptHMRNotification": $scope.patientUser.acceptHMRNotification, "isAcceptHMRSetting": $scope.patientUser.acceptHMRSetting };
    	if(notification === 'hmrnotification'){
    		data.isHMRNotification = !$scope.patientUser.hmrnotification;
    	}
    	if(notification === 'acceptHMRNotification'){
    		data.isAcceptHMRNotification = !$scope.patientUser.acceptHMRNotification;
    	}
    	if(notification === 'acceptHMRSetting'){
    		data.isAcceptHMRSetting = !$scope.patientUser.acceptHMRSetting;
    	}
    	UserService.updatePatientUserNotification(localStorage.getItem('patientID'), data).then(function(response){
			$scope.patientUser = response.data.user;    
		}).catch(function(){

		});

    };

	$scope.init();
    
  });