'use strict';
angular.module('hillromvestApp')
.controller('fotaController',['$scope', '$location','$state', 'clinicadminService', 'notyService','$stateParams', 'clinicService', 'UserService', 'StorageService','$timeout', 'commonsUserService', 'TimService','dateService','fotaService','searchFilterService',
  function($scope, $location,$state, clinicadminService, notyService,$stateParams, clinicService, UserService, StorageService, $timeout, commonsUserService,TimService,dateService,fotaService,searchFilterService) {
  $scope.fota = {};
  $scope.fota.releaseDate = "";
  $scope.fota.effectiveDate = "";
  $scope.deviceListsearchItem = "";
  $scope.firmwareSearchItem = "";
  $scope.searchFilterdevicelist = {};
  $scope.searchFilterFirmwarelist = {};
  $scope.devicelistperpage = 10;
  $scope.firmwarelistperpage = 10;
  $scope.devicelistCurrentPageIndex = 1;
   $scope.firmwarelistCurrentPageIndex = 1;
  $scope.init = function()
  {
     $scope.searchFilterdevicelist.type = "ActivePublished";
        if($state.current.name === 'fotaHome'){
         
            $scope.getFirmwareList();
        }
        else if($state.current.name === 'deviceList'){
           $scope.searchFilterdevicelist.type = "Success";
            $scope.getFotaDeviceList();
        }
        else{

        }
        if ($stateParams.id !== undefined) {
         $scope.getFirmwareById($stateParams.id);
      } 
      if($stateParams.crcValue !== undefined){
        $scope.crcValueCheck = $stateParams.crcValue;
      }
      
       if($stateParams.fotaId !== undefined){
        $scope.fotaIdValue = $stateParams.fotaId;
      }
  };
  $scope.isActiveTab = function(tabname){
    if($state.current.name === tabname){
      return true;
    }
    else return false;
  }
                
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
    $scope.files = element.files;
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
    $scope.fileFillPattern = "";
    $scope.fileMCUSize = "";
    $scope.fileReleaseNum = "";
    $scope.fileSoftwareVersion = "";
    $scope.fileReleaseDate = "";
    $scope.fileDevicePartNumber = "";
    $scope.fileCrcCheckSum = "";
    $scope.uploadUser = "";
    $scope.startAddr = "";
    $scope.endAddr = "";
    $scope.CRCLocation = "";
    $scope.startAddr2 = "";
    $scope.endAddr2 = "";
    $scope.CRC2Location = "";
    $scope.productName = "";


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
          $scope.fileFillPattern = $scope.fileFillPattern + $scope.fourLines[i];
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
   if($scope.fota.releaseDate !== undefined){
    $scope.date = $scope.fota.releaseDate.split('/'); 
    $scope.formatedDate = $scope.date[0]+$scope.date[1]+$scope.date[2];
    
    $scope.hexDate = "";
    for (var i=0; i < $scope.formatedDate.length; i++) {
        $scope.hexDate += $scope.formatedDate.charCodeAt(i).toString(16);
      }

   }
   
    if($scope.fota.partNumber !== undefined){
      $scope.fota.partNumber = ("0000000000000000"+$scope.fota.partNumber).slice($scope.fota.partNumber.length);   
      $scope.hexDevicePartNumber = "";
    for (var i=0; i < $scope.fota.partNumber.length; i++) {
        $scope.hexDevicePartNumber += $scope.fota.partNumber.charCodeAt(i).toString(16);
      }
    }
    
   if($scope.fota.softwareMVersion1 !== undefined || $scope.fota.softwareMVersion2 !== undefined || $scope.fota.softwareMiVersion1 !== undefined || $scope.fota.softwareMiVersion1 !== undefined){
      $scope.softwareMVersion1 = $scope.fota.softwareMVersion1;
      if($scope.softwareMVersion1.length<2){
      $scope.softwareMVersion1 = "0"+$scope.softwareMVersion1;
    }
    $scope.softwareMVersion2 = $scope.fota.softwareMVersion2;
      if($scope.softwareMVersion2.length<2){
     $scope.softwareMVersion2 = "0"+$scope.softwareMVersion2;
    }
     $scope.softwareMiVersion1 = $scope.fota.softwareMiVersion1;
     if($scope.softwareMiVersion1.length<2){
     $scope.softwareMiVersion1 = "0"+$scope.softwareMiVersion1;
    }
    $scope.softwareMiVersion2 = $scope.fota.softwareMiVersion2;
    if($scope.softwareMiVersion2.length<2){
     $scope.softwareMiVersion2 = "0"+$scope.softwareMiVersion2;
    }
     $scope.userSoftwareVer = $scope.softwareMVersion1+$scope.softwareMVersion2+$scope.softwareMiVersion1+$scope.softwareMiVersion2;

   }
   
  if($scope.fileSoftwareVersion !== undefined){
    $scope.splitValue = $scope.fileSoftwareVersion.match(/.{1,2}/g);
    $scope.softVersion = $scope.splitValue[3]+$scope.splitValue[2]+$scope.splitValue[1]+$scope.splitValue[0]; 
  }
  
   if($scope.hexDevicePartNumber !== $scope.fileDevicePartNumber){
    $scope.validatePartNumber();
   }else if( $scope.hexDate !== $scope.fileReleaseDate){
    $scope.validateRelease();
   } else if($scope.softVersion !== $scope.userSoftwareVer){
      $scope.validateSoftVersion();
    }else {
      $scope.validateMatched();
  }
 };
$scope.validatePartNumber = function(){
    $scope.overrideMesg = false;
    $scope.uploadMsg = false;
    $scope.myvalue = false;
    $scope.matched = false; 
    $scope.btnok = false;
    $scope.unmatchedPartNo = true;
    $scope.unmatchedDate = false;
    $scope.unmatchedVersion = false;
    $scope.btnUpCancel = true;
    $scope.showModal = true;  
}

$scope.validateRelease = function(){
    $scope.overrideMesg = false;
    $scope.uploadMsg = false;
    $scope.myvalue = false;
    $scope.matched = false; 
    $scope.btnok = false;
    $scope.unmatchedPartNo = false;
    $scope.unmatchedDate = true;
    $scope.unmatchedVersion = false;
    $scope.btnUpCancel = true;
    $scope.showModal = true;
}

$scope.validateSoftVersion = function(){
    $scope.overrideMesg = false;
    $scope.uploadMsg = false;
    $scope.myvalue = false;
    $scope.matched = false; 
    $scope.btnok = false;
    $scope.unmatchedPartNo = false;
    $scope.unmatchedDate = false;
    $scope.unmatchedVersion = true;
    $scope.btnUpCancel = true;
    $scope.showModal = true;

  }
$scope.validateMatched = function(){
    $scope.unmatchedPartNo = false;
    $scope.unmatchedDate = false;
    $scope.unmatchedVersion = false;
    $scope.overrideMesg = false;
    $scope.cr32Invalid = false;
    $scope.uploadMsg = false;
    $scope.btnok = false;
    $scope.matched = true;
    $scope.myvalue = true; 
    $scope.showModal = true;
}


  $scope.verifyDetails = function(){
    $scope.showModal = false;
    $scope.overrideMesg = false;
    $scope.overrideBtn = false;
    
    var logged = StorageService.get('logged'); 
    $scope.uploadUser = logged.userFullName;
    console.log("Logged:",logged);
    
    fotaService.uploadfile($scope.files).then(function(response){
    //Once the file is uploaded the file path(in server folder) is returned from API
    $scope.filePath = response.data.filepath; 
    console.log("$scope.filePath:",$scope.filePath);
    var data = {
      "filePath" : $scope.filePath,
      "partNumber" : $scope.fota.partNumber,
      "region1StartAddress": $scope.fota.startAddr,
      "region1EndAddress": $scope.fota.endAddr,
      "region1CRCLocation": $scope.fota.CRCLocation,
      "region2StartAddress": $scope.fota.startAddr2,
      "region2EndAddress": $scope.fota.endAddr2,
      "region2CRCLocation": $scope.fota.CRC2Location
    }

    fotaService.CRC32Calculation(data).then(function(response){
    console.log("CRC32Calculation success response",response.data);
    var CRC32 = response.data.CRC32;
    $scope.oldRecord = response.data.oldRecord;
    console.log("oldRecord:",$scope.oldRecord);

    if(CRC32 == true ){  
      if($scope.oldRecord === true){
        $scope.matched = false; 
        $scope.myvalue = false;
        $scope.uploadMsg = false;
        $scope.btnok = false;
        $scope.unmatchedPartNo = false;
        $scope.unmatchedDate = false;
        $scope.unmatchedVersion = false;
        $scope.overrideMesg = true;
        $scope.overrideBtn = true;
            $scope.btnUpCancel = true;
        $scope.showModal = true;
      }else{
      $scope.startAddr = $scope.fota.startAddr;
      $scope.endAddr = $scope.fota.endAddr;
      $scope.CRCLocation = $scope.fota.CRCLocation;
      $scope.startAddr2 = $scope.fota.startAddr2;
      $scope.endAddr2 = $scope.fota.endAddr2;
      $scope.CRC2Location = $scope.fota.CRC2Location;
      $scope.productName = $scope.fota.productName;
      var data = {
      "modelId" : $scope.fileModelId,
      "boardId" : $scope.fileBoardId,
      "bedId" :  $scope.fileBedId,
      "bootCompVer" : $scope.fileBootCompVer,
      "fillPattern" : $scope.fileFillPattern,
      "mCUSize" : $scope.fileMCUSize,
      "releaseNumber" : $scope.fileReleaseNum,
      "productType" : $scope.fota.productName,
      "releaseDate" : $scope.formatedDate,
      "softVersion" : $scope.softVersion,
      "devicePartNumber" : $scope.fota.partNumber,
      "uploadUser" : $scope.uploadUser,
      "filePath" : $scope.filePath,
      "region1StartAddress": $scope.fota.startAddr,
      "region1EndAddress": $scope.fota.endAddr,
      "region1CRCLocation": $scope.fota.CRCLocation,
      "region2StartAddress": $scope.fota.startAddr2,
      "region2EndAddress": $scope.fota.endAddr2,
      "region2CRCLocation": $scope.fota.CRC2Location,
      "oldRecord":$scope.oldRecord
    }
      fotaService.create(data).then(function(response){
      console.log("Response:",response.data); 
      $scope.matched = false; 
      $scope.myvalue = false;
      $scope.overrideMesg = false;
      $scope.overrideBtn = false;
      $scope.btnUpCancel = false;

      $scope.unmatchedPartNo = false;
      $scope.unmatchedDate = false;
      $scope.unmatchedVersion = false;

      $scope.uploadMsg = true;
      $scope.showModal = true;
      $scope.btnok = true;

    }).catch(function(response){
        notyService.showError(response);
        });
      }

      }else{
          $scope.matched = false; 
          $scope.myvalue = false;
          $scope.overrideMesg = false;
          $scope.overrideBtn = false;
          $scope.uploadMsg = false;
          $scope.btnok = false;

          $scope.unmatchedPartNo = false;
          $scope.unmatchedDate = false;
          $scope.unmatchedVersion = false;

          $scope.btnUpCancel = true;
          $scope.cr32Invalid = true;
          $scope.showModal = true;

        }
      }).catch(function(response){
        notyService.showError(response);
      });
    }).catch(function(response){
        notyService.showError(response);
    });

  };
    $scope.override = function() {
      $scope.showModal = false;
      $scope.startAddr = $scope.fota.startAddr;
      $scope.endAddr = $scope.fota.endAddr;
      $scope.CRCLocation = $scope.fota.CRCLocation;
      $scope.startAddr2 = $scope.fota.startAddr2;
      $scope.endAddr2 = $scope.fota.endAddr2;
      $scope.CRC2Location = $scope.fota.CRC2Location;
      $scope.productName = $scope.fota.productName;
      var data = {
      "modelId" : $scope.fileModelId,
      "boardId" : $scope.fileBoardId,
      "bedId" :  $scope.fileBedId,
      "bootCompVer" : $scope.fileBootCompVer,
      "fillPattern" : $scope.fileFillPattern,
      "mCUSize" : $scope.fileMCUSize,
      "releaseNumber" : $scope.fileReleaseNum,
      "productType" : $scope.fota.productName,
      "releaseDate" : $scope.formatedDate,
      "softVersion" : $scope.softVersion,
      "devicePartNumber" : $scope.fota.partNumber,
      "uploadUser" : $scope.uploadUser,
      "filePath" : $scope.filePath,
      "region1StartAddress": $scope.fota.startAddr,
      "region1EndAddress": $scope.fota.endAddr,
      "region1CRCLocation": $scope.fota.CRCLocation,
      "region2StartAddress": $scope.fota.startAddr2,
      "region2EndAddress": $scope.fota.endAddr2,
      "region2CRCLocation": $scope.fota.CRC2Location,
      "oldRecord":$scope.oldRecord
    }
      fotaService.create(data).then(function(response){
      console.log("Response:",response.data); 
      $scope.matched = false; 
      $scope.myvalue = false;
      $scope.overrideMesg = false;
      $scope.overrideBtn = false;
      $scope.btnUpCancel = false;

      $scope.unmatchedPartNo = false;
      $scope.unmatchedDate = false;
      $scope.unmatchedVersion = false;

      $scope.uploadMsg = true;
      $scope.showModal = true;
      $scope.btnok = true;

    }).catch(function(response){
        notyService.showError(response);
        });
    }

    $scope.createFOTA = function(){
      $scope.startAddr = $scope.fota.startAddr;
      $scope.endAddr = $scope.fota.endAddr;
      $scope.CRCLocation = $scope.fota.CRCLocation;
      $scope.startAddr2 = $scope.fota.startAddr2;
      $scope.endAddr2 = $scope.fota.endAddr2;
      $scope.CRC2Location = $scope.fota.CRC2Location;
      $scope.productName = $scope.fota.productName;
      var data = {
      "modelId" : $scope.fileModelId,
      "boardId" : $scope.fileBoardId,
      "bedId" :  $scope.fileBedId,
      "bootCompVer" : $scope.fileBootCompVer,
      "fillPattern" : $scope.fileFillPattern,
      "mCUSize" : $scope.fileMCUSize,
      "releaseNumber" : $scope.fileReleaseNum,
      "productType" : $scope.fota.productName,
      "releaseDate" : $scope.formatedDate,
      "softVersion" : $scope.softVersion,
      "devicePartNumber" : $scope.fota.partNumber,
      "uploadUser" : $scope.uploadUser,
      "filePath" : $scope.filePath,
      "region1StartAddress": $scope.fota.startAddr,
      "region1EndAddress": $scope.fota.endAddr,
      "region1CRCLocation": $scope.fota.CRCLocation,
      "region2StartAddress": $scope.fota.startAddr2,
      "region2EndAddress": $scope.fota.endAddr2,
      "region2CRCLocation": $scope.fota.CRC2Location,
      "oldRecord":$scope.oldRecord
    }
    fotaService.create(data).then(function(response){
    console.log("Response:",response.data); 

    }).catch(function(response){
        notyService.showError(response);
        });

    };

    $scope.navigateTabsFota = function(tabname){
    
        $state.go(tabname);
     };
      /*$scope.navigateTabsWithValueFota = function(tabname,selectedFirmware){
        var value = "";
    if(selectedFirmware){
      if(selectedFirmware.region1CRCLocation && selectedFirmware.region2CRCLocation){
      value = 'both';
      }
      else if(selectedFirmware.region1CRCLocation && !selectedFirmware.region2CRCLocation){
        //if only 1st one
        value = 'one';
      }
      
    }
        $state.go(tabname,{'fotaId': selectedFirmware.id,'crcValue': value});
     };*/

     $scope.validateApprCRC = function(form){

      $scope.showModal = false;
      $scope.publishedUser = "";
      var logged = StorageService.get('logged'); 
      $scope.publishedUser = logged.userFullName;
      console.log("Logged:",logged);

      var data = 
      {
        "fotaId": $scope.selectedFirmware.id,
        "region1CRC": $scope.fota.region1CRC,
        "region2CRC": $scope.fota.region2CRC,
        "publishedUser": $scope.publishedUser
      }
      fotaService.approverCRC32(data).then(function(response){
      console.log("approverCRC32 success response",response.data);
      if(response.data.apvrCRC32 === true){
        $scope.isValideCRC32 = false;
        $scope.isValideCRC32 = response.data.apvrCRC32;
        $scope.cr32Invalid = false;
        $scope.btncancel = false;
        $scope.approveMsg = false;
        $scope.deleteMsg = false;
        $scope.deleteMsgReq = false;
        $scope.deleteAprMsg = false;
        $scope.btnok = false;
        $scope.deleteConfirmMsg = false;
        $scope.confirmDeleteBtn = false;
        $scope.btnApr = true;
        $scope.btncancel = true;
        $scope.showModal = true;
        $scope.cr32Valid = true;
      }else{
        $scope.cr32Valid = false;
        $scope.approveMsg = false;
        $scope.deleteMsg = false;
        $scope.deleteMsgReq = false;
        $scope.deleteAprMsg = false;
        $scope.btnok = false;
        $scope.btnApr = false;
        $scope.deleteConfirmMsg = false;
        $scope.confirmDeleteBtn = false;
        $scope.btncancel = true;
        $scope.showModal = true;
        $scope.cr32Invalid = true;
        console.log("Invalid approver CRC32",response.data.apvrCRC32);
      }
      
    }).catch(function(response){
        notyService.showError(response);
    });
}
    
    $scope.close = function () {
       $scope.showModal = false;
    };

    $scope.getFirmwareList = function(track){
//alert("Hi");

     if (track !== undefined) {
            if (track === "PREV" && $scope.firmwarelistCurrentPageIndex > 1) {
              $scope.firmwarelistCurrentPageIndex--;
            } else if (track === "NEXT" && $scope.firmwarelistCurrentPageIndex < $scope.FirmwareListPageCount) {
              $scope.firmwarelistCurrentPageIndex++;
            } else {
              return false;
            }
          } else {
            $scope.firmwarelistCurrentPageIndex = 1;
          }
      fotaService.getFirmwareList(($scope.firmwarelistCurrentPageIndex),$scope.firmwarelistperpage,$scope.searchFilterdevicelist.type,$scope.firmwareSearchItem).then(function(response){
      $scope.FirmwareList = response.data;
      $scope.FirmwareListPageCount = $scope.FirmwareList.totalPages;

      if($scope.FirmwareList.content){
       for (var i = 0 ; i < $scope.FirmwareList.content.length ; i++) { 
              $scope.FirmwareList.content[i].releaseConvertedDate = dateService.getDateFromTimeStamp($scope.FirmwareList.content[i].releaseDate,patientDashboard.dateFormat,'-')
              $scope.FirmwareList.content[i].uploadConvertedDate = dateService.getDateFromTimeStamp($scope.FirmwareList.content[i].uploadDatetime,patientDashboard.dateFormat,'-')
              
              if($scope.FirmwareList.content[i].publishedDateTime !== null){
                $scope.FirmwareList.content[i].publishedConvertedDate = dateService.getDateFromTimeStamp($scope.FirmwareList.content[i].publishedDateTime,patientDashboard.dateFormat,'-');
              }
              $scope.FirmwareList.content[i].convertDevicePartNo = Number($scope.FirmwareList.content[i].devicePartNumber);               
             }
            }
    });
  }

    $scope.selectFirmware = function(firmware) {
           $state.go('firmwareView', {
              'id': firmware.id
            });
    };

    $scope.getFirmwareById = function(id){
      fotaService.getFirmwareInfo(id).then(function(response){
      $scope.selectedFirmware = response.data.fotaInfo;
      $scope.releaseConvertedDate = dateService.getDateTimeFromTimeStamp($scope.selectedFirmware.releaseDate,patientDashboard.dateFormat,'-')
      $scope.uploadConvertedDate = dateService.getDateTimeFromTimeStamp($scope.selectedFirmware.uploadDatetime,patientDashboard.dateFormat,'-')
     if($scope.selectedFirmware.publishedDateTime !== null){
           $scope.publishedConvertedDate = dateService.getDateTimeFromTimeStamp($scope.selectedFirmware.publishedDateTime,patientDashboard.dateFormat,'-')
      }
      $scope.convertDevicePartNo = Number($scope.selectedFirmware.devicePartNumber);
      }).catch(function(response){
        notyService.showError(response);
      });
    };


    $scope.approverCRC32 = function(){
      $scope.showModal = false;
      $scope.publishedUser = "";
      var logged = StorageService.get('logged'); 
      $scope.publishedUser = logged.userFullName;
      console.log("Logged:",logged);

      var data = 
      {
        "fotaId": $scope.selectedFirmware.id,
        "region1CRC": $scope.fota.region1CRC,
        "region2CRC": $scope.fota.region2CRC,
        "publishedUser": $scope.publishedUser,
        "isValideCRC32" : $scope.isValideCRC32
      }
      fotaService.approverCRC32(data).then(function(response){
      console.log("approverCRC32 success response",response.data);
      if(response.data.apvrCRC32 === true){
        console.log("Published",response.data.apvrCRC32);
        $scope.cr32Invalid = false;
        $scope.cr32Valid = false;
        $scope.btnApr = false;
        $scope.deleteMsg = false;
        $scope.deleteMsgReq = false;
        $scope.deleteAprMsg = false;
        $scope.approveMsg = true;
        $scope.btncancel = false;
        $scope.deleteConfirmMsg = false;
        $scope.confirmDeleteBtn = false;
        $scope.btnok = true;
        $scope.showModal = true;
        
        }
      }).catch(function(response){
        notyService.showError(response);
      });

    }

  $scope.deleteFirmware = function(){
        $scope.cr32Invalid = false;
        $scope.cr32Valid = false;
        $scope.btnApr = false;
        $scope.approveMsg = false;
        $scope.deleteMsg = false;
        $scope.deleteAprMsg = false;
        $scope.deleteMsgReq = false;
        $scope.deleteMsgReq = false;
        $scope.btnok = false;
        $scope.deleteConfirmMsg = true;
        $scope.confirmDeleteBtn = true;
        $scope.btncancel = true;
        $scope.showModal = true;
  }

 $scope.deleteFirmwareConfirm = function(id){ 
      $scope.showModal = false;
      $scope.userRole = "";
      var logged = StorageService.get('logged'); 
      console.log("logged:",logged);
      $scope.userRole = logged.role;
      console.log("Role:",$scope.userRole );
      fotaService.firmwareSoftDelete(id,$scope.userRole).then(function(response){
      $scope.softDeleateObj = response.data.fotaInfo;
      console.log("softDeleateObj",response.data.fotaInfo);
      if($scope.userRole === "FOTA_ADMIN" && $scope.softDeleateObj.softDeleteFlag === true && $scope.softDeleateObj.deleteRequestFlag === true ){
        $scope.cr32Invalid = false;
        $scope.cr32Valid = false;
        $scope.btnApr = false;
        $scope.approveMsg = false;
        $scope.btncancel = false;
        $scope.deleteMsg = true;
        $scope.deleteAprMsg = false;
        $scope.deleteConfirmMsg = false;
        $scope.confirmDeleteBtn = false;
        $scope.deleteMsgReq = false;
        $scope.btnok = true;
        $scope.showModal = true;
      }else if($scope.userRole === "FOTA_ADMIN" && $scope.softDeleateObj.softDeleteFlag === false && $scope.softDeleateObj.activePublishedFlag === true && $scope.softDeleateObj.deleteRequestFlag === true ){
        $scope.cr32Invalid = false;
        $scope.cr32Valid = false;
        $scope.btnApr = false;
        $scope.approveMsg = false;
        $scope.btncancel = false;
        $scope.deleteMsg = false;
        $scope.deleteAprMsg = false;
        $scope.deleteConfirmMsg = false;
        $scope.confirmDeleteBtn = false;
        $scope.deleteMsgReq = true;
        $scope.btnok = true;
        $scope.showModal = true;
      }else if($scope.userRole === "FOTA_APPROVER"){
        if($scope.softDeleateObj === true){
        $scope.cr32Invalid = false;
        $scope.cr32Valid = false;
        $scope.btnApr = false;
        $scope.approveMsg = false;
        $scope.btncancel = false;
        $scope.deleteMsgReq = false;
        $scope.deleteMsg = false;
        $scope.deleteConfirmMsg = false;
        $scope.confirmDeleteBtn = false;
        $scope.deleteAprMsg = true;
        $scope.btnok = true;
        $scope.showModal = true;
        }else{
        $scope.cr32Invalid = false;
        $scope.cr32Valid = false;
        $scope.btnApr = false;
        $scope.approveMsg = false;
        $scope.btncancel = false;
        $scope.deleteMsgReq = false;
        $scope.deleteAprMsg = false;
        $scope.deleteConfirmMsg = false;
        $scope.confirmDeleteBtn = false;
        $scope.deleteMsg = true;
        $scope.btnok = true;
        $scope.showModal = true;
        }
        
      }
      
      }).catch(function(response){
        notyService.showError(response);
      });


 }

  $scope.approveDeleteFirmware = function(){

        $scope.cr32Invalid = false;
        $scope.cr32Valid = false;
        $scope.btnApr = false;
        $scope.approveMsg = false;
        $scope.deleteMsg = false;
        $scope.deleteAprMsg = false;
        $scope.deleteMsgReq = false;
        $scope.deleteMsgReq = false;
        $scope.btnok = false;
        $scope.deleteConfirmMsg = true;
        $scope.confirmDeleteBtn = true;
        $scope.btncancel = true;
        $scope.showModal = true;

  }

  $scope.getFotaDeviceList = function(track){

     if (track !== undefined) {
            if (track === "PREV" && $scope.devicelistCurrentPageIndex > 1) {
              $scope.devicelistCurrentPageIndex--;
            } else if (track === "NEXT" && $scope.devicelistCurrentPageIndex < $scope.devicelistPageCount) {
              $scope.devicelistCurrentPageIndex++;
            } else {
              return false;
            }
          } else {
            $scope.devicelistCurrentPageIndex = 1;
          }
      fotaService.getDeviceList(($scope.devicelistCurrentPageIndex-1),$scope.devicelistperpage,$scope.searchFilterdevicelist.type,$scope.deviceListsearchItem).then(function(response){
      $scope.Fotadeviceslist = response.data;
      $scope.devicelistPageCount = $scope.Fotadeviceslist.totalPages;
      if($scope.Fotadeviceslist.content){
       for (var i = 0 ; i < $scope.Fotadeviceslist.content.length; i++) { 
                $scope.Fotadeviceslist.content[i].currentDownloadStartDateTime = dateService.getDateTimeFromTimeStamp($scope.Fotadeviceslist.content[i].downloadStartDateTime,patientDashboard.dateFormat,'-')
                console.log("dateServiceStrt.",dateService.getDateTimeFromTimeStamp($scope.Fotadeviceslist.content[i].downloadStartDateTime,patientDashboard.dateFormat,'-'));
                $scope.Fotadeviceslist.content[i].currentDownloadEndDateTime = dateService.getDateTimeFromTimeStamp($scope.Fotadeviceslist.content[i].downloadEndDateTime,patientDashboard.dateFormat,'-')
                console.log("dateServiceEnd.",dateService.getDateTimeFromTimeStamp($scope.Fotadeviceslist.content[i].downloadEndDateTime,patientDashboard.dateFormat,'-'));          
              }
            }
    });
  }
  $scope.redirectBack = function(){
      $state.go('fotaHome');
 };
 $scope.redirectBackToView = function(){
      $state.go('firmwareView', {
              'id': $scope.fotaIdValue
            });
 };

$scope.downloadHexFile = function(firmware){
    fotaService.getDownloadFirmware(firmware.id).then(function(response){
        if(response && response.status === 204){
          //showpopup
          $("#no-xls-modal").css("display", "block");
        }else{
          saveAs(new Blob([response.data],{type:"application/hex"}), "Firmware.hex");          
        }
      });
}
    $scope.init();  
}]);