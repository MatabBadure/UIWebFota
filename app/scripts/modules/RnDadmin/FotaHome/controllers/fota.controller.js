'use strict';
angular.module('hillromvestApp')
.controller('fotaController',['$scope', '$location','$state', 'clinicadminService', 'notyService','$stateParams', 'clinicService', 'UserService', 'StorageService','$timeout', 'commonsUserService', 'TimService','dateService','fotaService','searchFilterService',
  function($scope, $location,$state, clinicadminService, notyService,$stateParams, clinicService, UserService, StorageService, $timeout, commonsUserService,TimService,dateService,fotaService,searchFilterService) {
$scope.fota = {};

$scope.fota.releaseDate = "";
$scope.fota.effectiveDate = "";
      $scope.init = function(){
        console.log("hello fota admin");
      };
            
       
     $scope.HandleBrowseClick = function(){   
      $scope.showModalOverwrite = false;
      $scope.fileinput = document.getElementById("browse");
      
      $scope.fileinput.click();
      
    };
        
     $scope.Handlechange = function(element)
  {
      $scope.fileinput = document.getElementById("browse");
      var textinput = document.getElementById("filename");
      textinput.value = $scope.fileinput.value;
      $scope.files = element.files;
      //console.log($scope.fota.partNumber);
      /*var res = $scope.fileinput.value.split('\\');
        textinput.value = "...\\" + res[res.length-1];
      var ext = $scope.files[0].name.split('.');
      for(var i =0;i<ext.length;i++){
        if(ext[i]=="pdf"){
    $scope.uploadFile();
    $scope.nonPDF = false;
    break;    
    }
    else{
      $scope.nonPDF = true;
      }
      } */


  };

  $scope.Handlechange = function(element)
  {
       $scope.fileinput = document.getElementById("browse");
      var textinput = document.getElementById("filename");
      //textinput.value = $scope.fileinput.value;
       $scope.files = element.files;
      console.log(" elementfiles",$scope.fileinput.files[0]);
      var fileToLoad = $scope.fileinput.files[0];
      var fileReader = new FileReader();

      fileReader.onload = function(fileLoadedEvent){
        $scope.textFromFileLoaded = "";
        var textFromFileLoaded = fileLoadedEvent.target.result;

    $scope.allLines = textFromFileLoaded.split('\n');
    
        $scope.fourLines = "";
       angular.forEach($scope.allLines, function(line,index) {
        if(index<9){
            $scope.fourLines = $scope.fourLines + line + '\n';
          }
        });

      console.log("$scope.fourLines",$scope.fourLines); 

      
      
      $scope.fileModelId = "";
      $scope.fileBoardId = "";
      $scope.fileBedId = "";
      $scope.fileBootCompVer = "";
      $scope.fileFilePattern = "";
      $scope.fileMCUSize = "";
      $scope.fileReleaseNum = "";
      $scope.fileSoftwareVersion = "";
      $scope.fileReleaseDate = "";
      $scope.fileDevicePartNumber = "";
      $scope.fileCrcCheckSum = "";
      $scope.uploadUser = "";
       for(var i = 0; i < $scope.fourLines.length; i++){

        if(i > 25 && i<28){
             $scope.fileModelId = $scope.fileModelId + $scope.fourLines[i];
        }
     
        if(i > 27 && i<30){
             $scope.fileBoardId = $scope.fileBoardId + $scope.fourLines[i];
        }
     
        if(i > 29 && i<32){
             $scope.fileBedId = $scope.fileBedId + $scope.fourLines[i];
        }
     
        if(i > 31 && i<34){
             $scope.fileBootCompVer = $scope.fileBootCompVer + $scope.fourLines[i];
        }
     
        if(i > 33 && i<42){
             $scope.fileFilePattern = $scope.fileFilePattern + $scope.fourLines[i];
        }
     
        if(i > 41 && i<50){
             $scope.fileMCUSize = $scope.fileMCUSize + $scope.fourLines[i];
        }
     
        if(i > 49 && i<58){
             $scope.fileSoftwareVersion = $scope.fileSoftwareVersion + $scope.fourLines[i];
        }

         if(i > 70 && i<79){
             $scope.fileReleaseNum = $scope.fileReleaseNum + $scope.fourLines[i];
        }
     
        if(i > 78 && i<95){
          $scope.fileReleaseDate = $scope.fileReleaseDate + $scope.fourLines[i];
        }

        if(i > 94 && i<103){
          $scope.fileDevicePartNumber = $scope.fileDevicePartNumber + $scope.fourLines[i];
        }

        if(i > 115 && i<140){
          $scope.fileDevicePartNumber = $scope.fileDevicePartNumber + $scope.fourLines[i];
        }
        if(i > 319 && i<328){
          $scope.fileCrcCheckSum = $scope.fileCrcCheckSum + $scope.fourLines[i];
        }
     
      }
      
    };
      fileReader.readAsText(fileToLoad, "UTF-8");
      var res = $scope.fileinput.value.split('\\');
       textinput.value = "...\\" + res[res.length-1];
      var ext = $scope.files[0].name.split('.');
      /*for(var i =0;i<ext.length;i++){
        if(ext[i]=="pdf"){
      $scope.uploadFile();
      $scope.nonPDF = false;
      break;  
      }
  else{
      $scope.nonPDF = true;
    }
    }  */
};

    $scope.fotaUploadModule = function(form){ 
   $scope.overrideMesg = false;
   $scope.overrideBtn = false;
    $scope.date = $scope.fota.releaseDate.split('/'); 
    $scope.formatedDate = $scope.date[0]+$scope.date[1]+$scope.date[2];
    //Efeec
    $scope.effectiveDate = $scope.fota.effectiveDate.split('/');
    $scope.formatedEffectiveDate = $scope.effectiveDate[0]+$scope.effectiveDate[1]+$scope.effectiveDate[2];
    $scope.hexDate = "";
    for (var i=0; i < $scope.formatedDate.length; i++) {
          $scope.hexDate += $scope.formatedDate.charCodeAt(i).toString(16);
        }
    $scope.fota.partNumber = ("0000000000000000"+$scope.fota.partNumber).slice($scope.fota.partNumber.length);

    $scope.hexDevicePartNumber = "";
    for (var i=0; i < $scope.fota.partNumber.length; i++) {
          $scope.hexDevicePartNumber += $scope.fota.partNumber.charCodeAt(i).toString(16);
        }
    $scope.softwareMVersion1 = $scope.fota.softwareMVersion1;
  
    $scope.softwareMVersion2 = $scope.fota.softwareMVersion2;
   
    $scope.softwareMiVersion1 = $scope.fota.softwareMiVersion1;
    
    $scope.softwareMiVersion2 = $scope.fota.softwareMiVersion2;
    
    if($scope.softwareMVersion1.length<2){
      $scope.softwareMVersion1 = "0"+$scope.softwareMVersion1;
    }
    if($scope.softwareMVersion2.length<2){
      $scope.softwareMVersion2 = "0"+$scope.softwareMVersion2;
    }
    if($scope.softwareMiVersion1.length<2){
      $scope.softwareMiVersion1 = "0"+$scope.softwareMiVersion1;
    }
    if($scope.softwareMiVersion2.length<2){
      $scope.softwareMiVersion2 = "0"+$scope.softwareMiVersion2;
    }

    $scope.userSoftwareVer = $scope.softwareMVersion1+$scope.softwareMVersion2+$scope.softwareMiVersion1+$scope.softwareMiVersion2;
    
    $scope.splitValue = $scope.fileSoftwareVersion.match(/.{1,2}/g);
    $scope.softVersion = $scope.splitValue[3]+$scope.splitValue[2]+$scope.splitValue[1]+$scope.splitValue[0];
    
    if( $scope.hexDate === $scope.fileReleaseDate && $scope.softVersion === $scope.userSoftwareVer && $scope.hexDevicePartNumber === $scope.fileDevicePartNumber){
      //alert("verified")
      $scope.unmatched = false;
      $scope.overrideMesg = false;
      $scope.matched = true;
      $scope.myvalue = true; 
      $scope.effectiveDate = true;

      $scope.showModal = true;

      
      
    } else {
      //alert("Mismatched");
      $scope.overrideMesg = false;
       $scope.myvalue = false;
      $scope.matched = false; 
       $scope.effectiveDate = false; 
      $scope.unmatched = true;
    
      $scope.showModal = true;

    
      }
    };
  $scope.verifyDetails = function(){
    $scope.showModal = false;
    $scope.overrideMesg = false;
   $scope.overrideBtn = false;
    $scope.isOldFileV = true;
    $scope.existingVersion = "";
    fotaService.getExistingVersion($scope.fota.partNumber,$scope.isOldFileV).then(function(response){
    //Once the file is uploaded the file path(in server folder) is returned from API
    $scope.existingVersion = response.data.existingVersion; 
    console.log("$scope.existingVersion:",$scope.existingVersion);  
    }).catch(function(response){
      notyService.showError(response);
    });
  var logged = StorageService.get('logged'); 
      $scope.uploadUser = logged.userFullName;
      console.log("Logged:",logged);
    if($scope.existingVersion === null){

      console.log("In if");

    fotaService.uploadfile($scope.files).then(function(response){
    //Once the file is uploaded the file path(in server folder) is returned from API
    $scope.filePath = response.data.filepath; 
    console.log("$scope.filePath:",$scope.filePath);
     if($scope.filePath != null){
     
      var data = {
      "modelId" : $scope.fileModelId,
      "boardId" : $scope.fileBoardId,
      "bedId" :  $scope.fileBedId,
      "bootCompVer" : $scope.fileBootCompVer,
      "filePattern" : $scope.fileFilePattern,
      "mCUSize" : $scope.fileMCUSize,
      "releaseNumber" : $scope.fileReleaseNum,
      "checksum" : $scope.fileCrcCheckSum,
      "releaseDate" : $scope.formatedDate,
      "softVersion" : $scope.softVersion,
      "devicePartNumber" : $scope.fota.partNumber,
      "effectiveDate" : $scope.formatedEffectiveDate,
      "uploadUser" : $scope.uploadUser,
      "filePath" : $scope.filePath
    }
      fotaService.verify(data).then(function(response){
      console.log("success response");
    }).catch(function(response){
      notyService.showError(response);
      });
      }  
    }).catch(function(response){
      notyService.showError(response);
    });
    
     
   
    } else{
      console.log("in else");
      $scope.matched = false;
       $scope.unmatched = false;
       $scope.myvalue = false;
       $scope.overrideMesg = true;
       $scope.overrideBtn = true;
       $scope.effectiveDate = false; 
       $scope.showModal = true;
       
      /* $scope.override();*/
     
    }
    // $scope.overrideBtn = false;


  };
 $scope.override = function() {
      $scope.isOldFileD = true;
      $scope.showModal = false;
      fotaService.softDelete($scope.fota.partNumber,$scope.isOldFileD).then(function(response){
    //Once the file is uploaded the file path(in server folder) is returned from API
    $scope.FOTASoftDelete = response.data.FOTASoftDelete; 
    console.log("Inside softDelete");
    $scope.uploadFileAfterDelete();
    console.log("$scope.FOTASoftDelete:",$scope.FOTASoftDelete);  
    }).catch(function(response){
      notyService.showError(response);
    });
       }
       $scope.uploadFileAfterDelete = function(){
        fotaService.uploadfile($scope.files).then(function(response){
    //Once the file is uploaded the file path(in server folder) is returned from API
    $scope.filePath = response.data.filepath; 
    console.log("$scope.filePath:",$scope.filePath);
     if($scope.filePath != null){
     
      var data = {
      "modelId" : $scope.fileModelId,
      "boardId" : $scope.fileBoardId,
      "bedId" :  $scope.fileBedId,
      "bootCompVer" : $scope.fileBootCompVer,
      "filePattern" : $scope.fileFilePattern,
      "mCUSize" : $scope.fileMCUSize,
      "releaseNumber" : $scope.fileReleaseNum,
      "checksum" : $scope.fileCrcCheckSum,
      "releaseDate" : $scope.formatedDate,
      "softVersion" : $scope.softVersion,
      "devicePartNumber" : $scope.fota.partNumber,
      "effectiveDate" : $scope.formatedEffectiveDate,
      "uploadUser" : $scope.uploadUser,
      "filePath" : $scope.filePath
    }

      fotaService.verify(data).then(function(response){
      console.log("success response");
    }).catch(function(response){
      notyService.showError(response);
        });
      }  
    }).catch(function(response){
      notyService.showError(response);
    });
       }

     

    $scope.close = function () {
       $scope.showModal = false;
        };

    $scope.init();  
   }]);