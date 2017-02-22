angular.module('hillromvestApp')
.controller('changePrescriptionController',['$scope', '$state', 'clinicadminPatientService', 'notyService', '$stateParams', 'commonsUserService', 'patientService', '$rootScope', 'UserService', 'StorageService', 'exportutilService',
function($scope, $state, clinicadminPatientService, notyService, $stateParams, commonsUserService, patientService, $rootScope, UserService, StorageService, exportutilService) {

	$scope.init = function(){
		if($state.current.name === 'clinicAdminUpdateProtocol'|| $state.current.name === 'hcpUpdateProtocol'){
      $scope.initUpdateProtocol();
    }else if($state.current.name === 'clinicadminGenerateProtocol' || $state.current.name === 'hcpGenerateProtocol'){
      $scope.initGenerateProtocol();
    }
	};

	$scope.initUpdateProtocol = function(){
    $scope.getPatientInfo($stateParams.patientId);
    $scope.getProtocolById($stateParams.patientId, $stateParams.protocolId);
  };

  $scope.initGenerateProtocol = function(){
    if(!$rootScope.protocols){
    	if(StorageService.get('logged').role === 'HCP'){
    		$state.go('hcppatientProtocol', {'patientId': $stateParams.patientId});
    	}else if(StorageService.get('logged').role  === 'CLINIC_ADMIN'){
    		$state.go('clinicadminpatientProtocol', {'patientId': $stateParams.patientId});
    	}
    }else{
      var date = new Date();
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      if(dd < 10){
        dd='0'+dd
      }
      if(mm < 10){
        mm = '0'+mm;
      }
      $scope.currentDate = mm + '/' + dd + '/' +  date.getFullYear();
      $scope.getPatientInfo($stateParams.patientId);
    }
  };

  $scope.getPatientInfo = function(patinetId, callback){
    clinicadminPatientService.getPatientInfo(patinetId, $stateParams.clinicId,StorageService.get('logged').userId).then(function(response){
      $scope.patient = response.data.patientUser;
      if($scope.patient.zipcode){
        $scope.patient.zipcode = commonsUserService.formatZipcode($scope.patient.zipcode);
      }
      if (typeof callback === 'function') {
        callback($scope.patient);
      }
    }).catch(function(response){
      notyService.showError(response);
      if(StorageService.get('logged').role === 'HCP'){
      	$state.go('hcppatientdashboard',{'clinicId':$stateParams.clinicId});
      }else if(StorageService.get('logged').role  === 'CLINIC_ADMIN'){
      	$state.go('clinicadminpatientdashboard',{'clinicId':$stateParams.clinicId});
      }
    });
  };

  $scope.getProtocolById = function(patientId, protocolId){
    patientService.getProtocolById(patientId, protocolId).then(function(response){
      $scope.protocol = response.data;
      $scope.protocol.edit = true;
      $scope.newProtocolPoint = ($scope.protocol.protocol) ? $scope.protocol.protocol.length : 1;
      if(!$scope.protocol){
        $scope.protocol = {};
        $scope.protocol.type = 'Normal';
        $scope.protocol.protocolEntries = [{}];
      } else {
        $scope.protocol.type = $scope.protocol.protocol[0].type;
        $scope.protocol.treatmentsPerDay = $scope.protocol.protocol[0].treatmentsPerDay;
        $scope.protocol.protocolEntries = $scope.protocol.protocol;
      }
      $scope.tempProtocol = {};
      angular.copy($scope.protocol, $scope.tempProtocol);
    }).catch(function(response){
      notyService.showError(response);
    });
  };

  $scope.showPrtocolUpdateModal = function(){
    $scope.submitted = true;
    if($scope.updateProtocolForm.$invalid){
      return false;
    }
    if(!$scope.isProtocolChange()){
      $scope.isNoChange = true;
    }else{
      if($scope.protocol.id){
        delete $scope.protocol.id;
      }
      if($scope.protocol.patient){
        delete $scope.protocol.patient;
      }
      var data = $scope.protocol.protocolEntries;
      if($scope.protocol.type === 'Custom'){
        angular.forEach(data, function(value, key){          
          if(value){
            value.type = 'Custom';
            value.treatmentsPerDay = $scope.protocol.treatmentsPerDay;           
          }          
          if(!value.treatmentLabel){
            value.treatmentLabel = 'point'+(key+1);
          } 
          if(!value.protocolKey){
            value.protocolKey = $scope.protocol.protocol[0].protocolKey;
          }          
        });        
      }else{
        data[0].treatmentsPerDay = $scope.protocol.treatmentsPerDay; 
        if(!data[0].protocolKey){
           data[0].protocolKey = $scope.protocol.protocol[0].protocolKey;
         }       
        if(!data[0].type){
          data[0].type = 'Normal';
        }         
      }

      if(data && data[0]){
        data[0].id = $scope.protocol.protocol[0].id;
      }
     /* angular.forEach(data, function(protocol){
        protocol.id = $scope.protocol.protocol[0].id;
      });*/
      $rootScope.protocols = data;
      $scope.isAuthorizeProtocolModal = true;
    }
  };

  $scope.isProtocolChange = function(){
    if($scope.protocol.protocol.length !== $scope.tempProtocol.protocol.length){
      return true;
    }else if(JSON.stringify($scope.protocol) !== JSON.stringify($scope.tempProtocol)){
      return true;
    }
    return false;
  };

  $scope.closeAlert = function(){
  	$scope.isNoChange = false;
  	$scope.isAuthorizeProtocolModal = false;
  };

  $scope.openProtocolDetailPage = function(){
  	if(StorageService.get('logged').role === 'HCP'){
    	$state.go('hcpGenerateProtocol', {'protocolId': $stateParams.protocolId});
  	}else if(StorageService.get('logged').role  === 'CLINIC_ADMIN'){
  		$state.go('clinicadminGenerateProtocol', {'protocolId': $stateParams.protocolId});
  	}
  };

  $scope.openVerificationModal = function(){
    $scope.isProtocolSubmited = false;
    $scope.isAuthorizeFormSubmited = true;
    if($scope.authorizeForm.$invalid){
      return false;
    }
    $rootScope.$broadcast('initializeCaptcha');
    $scope.password = '';
    $scope.isVerificationModal = true;
  };

  $scope.closeVerificationModal = function(){
    $scope.isVerificationModal = false;
  };

  $scope.updateProtocol = function(){
    $rootScope.$broadcast('validateCaptcha');
    $scope.isProtocolSubmited = true;
    setTimeout(function(){
      if($scope.protocolVerificationForm.$invalid || !$scope.captchaValid){
        return false;
      }
      var data = {
        'password': $scope.password
      };
      UserService.validateCredentials(data).then(function(response){
        angular.forEach($rootScope.protocols, function(protocol){
          if(!protocol.type){
            protocol.type = $rootScope.protocols[0].type;
          }
        });
        patientService.editProtocol($stateParams.patientId, $rootScope.protocols, localStorage.getItem('deviceType')).then(function(response){
          $scope.isVerificationModal = false;
          var userFullName = $rootScope.username + ' ' + $rootScope.userLastName;
          exportutilService.exportChangePrescPDF($scope.patient, userFullName, $scope.currentDate, $rootScope.protocols);
          notyService.showMessage(response.data.message, 'success');
          if(StorageService.get('logged').role === 'HCP'){
           $state.go('hcppatientProtocol', {'patientId': $stateParams.patientId});
          }else if(StorageService.get('logged').role  === 'CLINIC_ADMIN'){
           $state.go('clinicadminpatientProtocol', {'patientId': $stateParams.patientId});
          }
        }).catch(function(response){
          notyService.showError(response);
        });
      }).catch(function(response){
        notyService.showError(response);
        $scope.password = '';
        $rootScope.$broadcast('initializeCaptcha');
      });
    }, 250);
  };

  $scope.addNewProtocolPoint = function (){
    $scope.submitted = false;
    $scope.newProtocolPoint += 1;
    $scope.protocol.protocolEntries.push({});
  };

  $scope.cancelProtocolUpdate = function() {
  	if(StorageService.get('logged').role === 'HCP'){
  		$state.go('hcppatientProtocol', {'patientId': $stateParams.patientId});	
  	}else if(StorageService.get('logged').role  === 'CLINIC_ADMIN'){
  		$state.go('clinicadminpatientProtocol', {'patientId': $stateParams.patientId});	
  	}
  };

  $scope.switchProtocolType = function(){
    $scope.submitted = false;
    $scope.updateProtocolForm.$setPristine();
    $scope.protocol.treatmentsPerDay = '';
    if(this.protocol.type === $scope.tempProtocol.type){
      $scope.protocol = {};
      angular.copy($scope.tempProtocol, $scope.protocol);
      delete $scope.protocol.protocolEntries;
      var tempProtocolEntries = $scope.tempProtocol.protocol
      $scope.protocol.protocolEntries = tempProtocolEntries;
    }else{
      $scope.newProtocolPoint = 1;
      delete $scope.protocol.protocolEntries;
      $scope.protocol.protocolEntries = [{}];
    }
  };

	$scope.init();
}]);