'use strict';

angular.module('hillromvestApp')
.service('exportutilService', ['dateService', 'pdfServiceConstants',
  function (dateService, pdfServiceConstants) {  
  var g_pdfMetaData = {
      rTitle: 'HillRom'
      ,rTitle1: 'VisiView™ Health Portal'               
  }

  var margins = {
      top: 70,
      bottom: 60,
      left: 15,
      width: 575,
      titleTop:40,
      tCellWidth:140,
      tCapWidth:280,
      patientPageTop: 40
    };

    this.isMobile = function(){
      if( navigator.userAgent.match(/Android/i)
     || navigator.userAgent.match(/webOS/i)
     || navigator.userAgent.match(/iPhone/i)
     || navigator.userAgent.match(/BlackBerry/i)
     || navigator.userAgent.match(/Windows Phone/i)
     ){
        return true;
      }
     else {
        return false;
      }
    };

  this.ordinal_suffix_of = function (i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
  };

  this.getPdf = function() {
    var pdf = new jsPDF(pdfServiceConstants.pdfDraw.p, pdfServiceConstants.pdfDraw.pt, pdfServiceConstants.pdfDraw.a4, true), specialElementHandlers = {
       '#bypassme': function(element, renderer){
        return true;
      }};
      return pdf;
  }

  this.setDateRange = function(pdf, fromDate, toDate, isPateintPage){
    var top = (isPateintPage) ? margins.titleTop+5: margins.titleTop;
    pdf.setFont(pdfServiceConstants.style.font.helvetica); 
    pdf.setFontType(pdfServiceConstants.style.font.normal);        
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.text(margins.left,   top+30, pdfServiceConstants.text.reportGenerationDate+pdfServiceConstants.text.colon);

    pdf.setFont(pdfServiceConstants.style.font.helvetica); 
    pdf.setFontType(pdfServiceConstants.style.font.normal);        
    pdf.setFontSize(8);
    pdf.setTextColor(128, 179, 227);
    pdf.text(margins.left+94,   top+30, dateService.getDateFromTimeStamp(new Date().getTime(),patientDashboard.dateFormat,'/'));
    
    var daterange = fromDate;
    if(fromDate && toDate){
      if(fromDate === toDate){ 
        pdf.setFont(pdfServiceConstants.style.font.helvetica); 
        pdf.setFontType(pdfServiceConstants.style.font.normal);        
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);  
        pdf.text(pdf.internal.pageSize.width-135,   top+30, pdfServiceConstants.text.dateRangeOfReportLabel+pdfServiceConstants.text.colon);     
        pdf.setFont(pdfServiceConstants.style.font.helvetica); 
        pdf.setFontType(pdfServiceConstants.style.font.normal);        
        pdf.setFontSize(8);
        pdf.setTextColor(128, 179, 227);
        pdf.text(pdf.internal.pageSize.width-49,   top+30, daterange);
      }else{
        pdf.setFont(pdfServiceConstants.style.font.helvetica); 
        pdf.setFontType(pdfServiceConstants.style.font.normal);        
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);  
        pdf.text(pdf.internal.pageSize.width-185,   top+30, pdfServiceConstants.text.dateRangeOfReportLabel+pdfServiceConstants.text.colon);
        pdf.setFont(pdfServiceConstants.style.font.helvetica); 
        pdf.setFontType(pdfServiceConstants.style.font.normal);        
        pdf.setFontSize(8);
        pdf.setTextColor(128, 179, 227);
        var daterange = fromDate +pdfServiceConstants.text.hyphen+ toDate;      
        pdf.text(pdf.internal.pageSize.width-98,   top+30, daterange);
      }
    }
    return pdf;
  }

  this.setTopHeader = function(pdf, fromDate, toDate, pageHeader){
    pageHeader = (pageHeader) ? pageHeader : pdfServiceConstants.text.pdfpageHeader;      
    /*pdf.setFont(pdfServiceConstants.style.font.helvetica);
    pdf.setFontType(pdfServiceConstants.style.font.bold);   
    pdf.setFontSize(8);
    pdf.setTextColor(0,0,0);
    pdf.text(margins.left,   margins.titleTop-15, dateService.getDateFromTimeStamp(new Date().getTime(), patientDashboard.dateFormat, "/"));
*/
    pdf.setFont(pdfServiceConstants.style.font.helvetica);   
    pdf.setFontType(pdfServiceConstants.style.font.bold);
    pdf.setFontSize(8);
    pdf.setTextColor(0,0,0);
    pdf.text((pdf.internal.pageSize.width/2)-((pageHeader.length*3.5)/2),   margins.titleTop-15, pageHeader);

    pdf.setFont(pdfServiceConstants.style.font.helvetica);  
    pdf.setFontType(pdfServiceConstants.style.font.bold); 
    pdf.setFontSize(11);
    pdf.setTextColor(124,163,220);
    pdf.text(margins.width-30, margins.titleTop,g_pdfMetaData.rTitle);

    pdf.setFont(pdfServiceConstants.style.font.helvetica);   
    pdf.setFontType(pdfServiceConstants.style.font.bold);      
    pdf.setFontSize(7);
    pdf.setTextColor(114, 111, 111);
    pdf.text(margins.width-70,   margins.titleTop+10, g_pdfMetaData.rTitle1);

    pdf.setDrawColor(0);
    pdf.setFillColor(114, 111, 111);
    pdf.rect(margins.left, margins.titleTop+13, margins.width-5, .5, pdfServiceConstants.pdfDraw.line.f); 
    
    return pdf;
  }

  this.setHeader = function(pdf, fromDate, toDate, pageHeader) {
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    margins.t2TabLeft=(pageWidth/2)+5;
    
    pdf = this.setTopHeader(pdf, fromDate, toDate, pageHeader);
    pdf = this.setDateRange(pdf, fromDate, toDate);
    return pdf;
  }

  this.setFooter = function(pdf, imgY, name) { 
    //imgY, is the Y position from where the signature will start.
    // the complete set i.e. name, date and signature is of height 50 px. 
    if(name){
    pdf.setFont(pdfServiceConstants.style.font.helvetica); 
    pdf.setFontType(pdfServiceConstants.style.font.bold);        
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);  
    pdf.text(40,imgY, pdfServiceConstants.text.name);
    pdf.line(80, imgY+4, 350,imgY+4); //left, top, right, top

    pdf.text(375,imgY, pdfServiceConstants.text.date);
    pdf.line(400, imgY+4, 560, imgY+4);// left, top, right, top

    pdf.text(40,imgY+30, pdfServiceConstants.text.signature);
    pdf.line(90, imgY+34, 350,imgY+34); //left, top, right, top    
    }
    
    //the line at the end of each page in pdf.
    // this line will always start at 30pts above the bottom of the page
    pdf.setDrawColor(0);
    pdf.setFillColor(114, 111, 111);
    pdf.rect(margins.left, pdf.internal.pageSize.height-30, margins.width-5, .5, pdfServiceConstants.pdfDraw.line.f);
    return pdf;
  }

  this.addSvgToPDF = function(pdf, canvasId, svgId, imageX, imageY, imageWidth, imageHeight, graphTitle, durationType, legends, startGraphTitleX){
    if(graphTitle){
      pdf.setFont(pdfServiceConstants.style.font.helvetica); 
      pdf.setFontType(pdfServiceConstants.style.font.bold);        
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);  
      if(startGraphTitleX) {
        pdf.text(startGraphTitleX,    imageY-30, graphTitle); 
      }else{
        pdf.text((pdf.internal.pageSize.width/2)-((graphTitle.length*4)/2),   imageY-30, graphTitle);
        //pdf.text((pdf.internal.pageSize.width/2)-(20+graphTitle.length),   imageY-30, graphTitle); 
      }                
    }  

    var canvasImgHeight = imageHeight;
    var canvasImgWidth = imageWidth;
    if(this.isMobile()){
      canvasImgHeight = 390;
      canvasImgWidth = 300;
    }  

    var canvas = document.getElementById(canvasId);

    var ctx = canvas.getContext('2d');
    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(document.getElementById(svgId).querySelector('svg'));          
    canvg(canvas, svgString);
    var img = $("#"+canvasId)[0].toDataURL('image/png', 1.0);
    pdf.addImage(img, 'png', imageX, imageY, canvasImgWidth, canvasImgHeight);
    if(durationType && durationType === pdfServiceConstants.loginanalytics.day){
      //chart footer
      pdf.setDrawColor(0);
      pdf.setFillColor(230, 241, 244);
      pdf.rect(imageX, imageY+imageHeight-1, imageWidth, 40, pdfServiceConstants.pdfDraw.line.f); 

      //square 1  

      pdf.setDrawColor(0);
      if(legends.isPatient){
        pdf.setFillColor(255, 152, 41);
      }else{
        pdf.setFillColor(204, 204, 204);
      }       
      pdf.rect(imageX+(imageWidth/3), imageY+imageHeight+14, 6, 6, pdfServiceConstants.pdfDraw.line.f); 
      
      //text 1
      pdf.setFont(pdfServiceConstants.style.font.helvetica); 
      pdf.setFontType(pdfServiceConstants.style.font.bold);        
      pdf.setFontSize(6);
      if(legends.isPatient){
        pdf.setTextColor(0, 0, 0);  
      }else{
        pdf.setTextColor(204, 204, 204);
      }  
      
      pdf.text(imageX+(imageWidth/3)+10,imageY+imageHeight+20, pdfServiceConstants.loginanalytics.patient);

      //square 2
      pdf.setDrawColor(0);
      if(legends.isHCP){
        pdf.setFillColor(53, 151, 143);
      }else{
        pdf.setFillColor(204, 204, 204);
      }       
      pdf.rect(imageX+(imageWidth/3)+40, imageY+imageHeight+14, 6, 6, pdfServiceConstants.pdfDraw.line.f); 

      //text 2
      pdf.setFont(pdfServiceConstants.style.font.helvetica); 
      pdf.setFontType(pdfServiceConstants.style.font.bold);        
      pdf.setFontSize(6);
      if(legends.isHCP){
        pdf.setTextColor(0, 0, 0);
      }else{
        pdf.setTextColor(204, 204, 204);
      }
      
      pdf.text(imageX+(imageWidth/3)+50,imageY+imageHeight+20, pdfServiceConstants.loginanalytics.hcp);

      ////square 3
      pdf.setDrawColor(0);
      if(legends.isClinicAdmin){
        pdf.setFillColor(77, 149, 196);
      }else{
        pdf.setFillColor(204, 204, 204);
      }        
      pdf.rect(imageX+(imageWidth/3)+75, imageY+imageHeight+14, 6, 6, pdfServiceConstants.pdfDraw.line.f); 

      //text 3
      pdf.setFont(pdfServiceConstants.style.font.helvetica); 
      pdf.setFontType(pdfServiceConstants.style.font.bold);        
      pdf.setFontSize(6);
      if(legends.isClinicAdmin){
        pdf.setTextColor(0, 0, 0);  
      }else{
        pdf.setTextColor(204, 204, 204);
      }       
      pdf.text(imageX+(imageWidth/3)+85,imageY+imageHeight+20, pdfServiceConstants.loginanalytics.clinicadmin);


      ////square 4
      pdf.setDrawColor(0);
      if(legends.isCaregiver){
        pdf.setFillColor(139, 107, 175);
      }else{
        pdf.setFillColor(204, 204, 204);
      }        
      pdf.rect(imageX+(imageWidth/3)+135, imageY+imageHeight+14, 6, 6, pdfServiceConstants.pdfDraw.line.f); 

      //text 4
      pdf.setFont(pdfServiceConstants.style.font.helvetica); 
      pdf.setFontType(pdfServiceConstants.style.font.bold);        
      pdf.setFontSize(6);
      if(legends.isCaregiver){
        pdf.setTextColor(0, 0, 0);  
      }else{
        pdf.setTextColor(204, 204, 204);
      }      
      pdf.text(imageX+(imageWidth/3)+145,imageY+imageHeight+20, pdfServiceConstants.loginanalytics.caregiver);

    }
    return pdf;
  }

  this.exportLoginAnalyticsAsPDF = function(svgId, durationType, legends, fromDate, toDate) {
    var pdf = this.getPdf();
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    pdf = this.setHeader(pdf, fromDate, toDate);
    pdf = this.addSvgToPDF(pdf, 'loginAnalyticsCanvas', svgId, 20, 150, 540, 200, pdfServiceConstants.text.loginanalytic, durationType, legends);    
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80);
    pdf = this.setPageNumber(pdf, "1", "1");  
    setTimeout(function(){
      pdf.save('VisiView™.pdf');
    },1000);
  }

  this.exportSurveyAsPDF = function(svgId, canvasId, fromDate, toDate, questions, graphTitle){
    var pdf = this.getPdf();
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    pdf = this.setHeader(pdf, fromDate, toDate);
    pdf = this.addSvgToPDF(pdf, canvasId, svgId, 20, 150, 540, 200, graphTitle);
    pdf = this.addQuestions(pdf, questions);
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80);
    pdf = this.setPageNumber(pdf, "1", "1");  
    setTimeout(function(){     
      pdf.save('VisiView™.pdf'); 
    },1000); 
  }

  this.exportBenchmarkPDF = function(svgId, canvasId, fromDate, toDate, graphTitle){
    var pdf = this.getPdf();
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    pdf = this.setHeader(pdf, fromDate, toDate);
    pdf = this.addSvgToPDF(pdf, canvasId, svgId, 20, 150, 540, 200, graphTitle);
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80);
    setTimeout(function(){
      pdf.save('VisiView™.pdf');
    },1000);
  }

  this.addQuestions = function(pdf, questions){
    var height = 400;
    pdf.setFont(pdfServiceConstants.style.font.helvetica);
    pdf.setFontSize(8);
    pdf.setTextColor(100, 101, 104);
    angular.forEach(questions, function(question, $index){
      var index = $index+1;
      pdf.text(20, height, 'Q-'+ index +' '+ question);
      height = height + 20;
    });
    return pdf;
  }

  this.addBody = function(pdf, slectedPatient, userFullName, currentDate, protocols, deviceType){
    var dob = (slectedPatient && slectedPatient.dob) ? slectedPatient.dob : "";
    if(deviceType == 'VEST'){
      var deviceName = pdf.splitTextToSize('VisiVest™ System', 50);
    }
    else{
      var deviceName = pdf.splitTextToSize('Monarch™ System', 50);
    }
    pdf.setFont(pdfServiceConstants.style.font.helvetica);
    pdf.setFontSize(8);
    pdf.setTextColor(100, 101, 104);
    pdf.text(15, 100,'Patient Name');
    
    pdf.setDrawColor(241,241,241);
    pdf.setFillColor(241,241,241);
    pdf.rect(85, 85, 110, 20, 'FD');
    var patientName = slectedPatient.firstName+' '+slectedPatient.lastName;
    if(patientName.length > 17) {
      patientName = patientName.slice(0, 17) + '...'; 
    }
    pdf.text(90, 100, patientName);

    pdf.text(300, 100, 'Patient DOB');
    pdf.setDrawColor(241,241,241);
    pdf.setFillColor(241,241,241);
    pdf.rect(365, 85, 110, 20, 'FD');
    pdf.text(370, 100, dob);

    pdf.text(15, 130, 'Prescriber Name');
    pdf.setDrawColor(241,241,241);
    pdf.setFillColor(241,241,241);
    pdf.rect(85, 118, 110, 20, 'FD');
    if(userFullName.length > 17){
      var tempUserFullName = userFullName.slice(0, 17) + '...'; 
      pdf.text(90, 130, tempUserFullName);
    }else{
      pdf.text(90, 130, userFullName);
    }

    pdf.text(300, 130, 'Date');
    pdf.setDrawColor(241,241,241);
    pdf.setFillColor(241,241,241);
    pdf.rect(365, 118, 110, 20, 'FD');
    pdf.text(370, 130, currentDate);

    pdf.setFontSize(12);
    pdf.setTextColor(124,163,218);
    pdf.text(15, 170, 'Protocol');
    pdf.setFontSize(8);

    pdf.text(30, 190,'Device');
    pdf.text(100, 190,'Type');
    pdf.text(200, 190,'Treatment Per Day');
    pdf.text(290, 190,'Minutes Per Treatment');
    pdf.text(390, 190,'Frequency Per Treatment');
    if(deviceType == 'VEST'){
    pdf.text(490, 190,'Pressure Per Treatment');
  }
  else{
    pdf.text(490, 190,'Intensity Per Treatment');
  }

    pdf.setDrawColor(0);
    pdf.setFillColor(114, 111, 111);
    pdf.setTextColor(100, 101, 104);
    pdf.rect(margins.left, 200, margins.width-5, .5, pdfServiceConstants.pdfDraw.line.f);
    var x =30 , y = 210;
    angular.forEach(protocols, function(protocol, key){
      x = 30;
      if(protocol.type === 'Normal'){
        pdf.text(x, y, deviceName);
        x = x + 70;
        pdf.text(x, y, protocol.type);
        x = x + 240;
        pdf.text(x, y, protocol.minMinutesPerTreatment.toString());
        x = x + 90;
        pdf.text(x, y, protocol.minFrequency+'-'+protocol.maxFrequency);
        x = x + 90;
        if(deviceType == 'VEST'){
        pdf.text(x, y, protocol.minPressure+'-'+protocol.maxPressure);
      }
      else{
         pdf.text(x, y, protocol.minIntensity+'-'+protocol.maxIntensity);
      }
      }else{
        
        x = x + 70;
        pdf.text(x, y, protocol.type+' '+protocol.treatmentLabel);
        x = x + 240;
        if(key !== protocols.length-1){
          pdf.rect(100, y+5, x-250, .5, pdfServiceConstants.pdfDraw.line.f);//pdf.rect(horizontal startpoint in x terms,vertical start point in y terms, length of the line, width of line,function to draw line )
          pdf.rect(x-50, y+5, margins.width-230, .5, pdfServiceConstants.pdfDraw.line.f);
        }
        pdf.text(x, y, protocol.minMinutesPerTreatment.toString());
        x = x + 90;
        pdf.text(x, y, protocol.minFrequency.toString());
        x = x + 90;
        if(deviceType == 'VEST'){
        pdf.text(x, y, protocol.minPressure.toString());
      }
      else{
        pdf.text(x, y, protocol.minIntensity.toString());
      }
      }
      y = y + 30;
    });
    var treatmentsPerDay = protocols[0].treatmentsPerDay.toString();
    if(protocols[0].type === 'Normal'){
      pdf.text( 225, 210, treatmentsPerDay);
    }else{
      pdf.text( 225, (210 + y - 30)/2, treatmentsPerDay);
      pdf.text(40, (210 + y - 30)/2, deviceName);
    }

    var splittedDate = (new Date()).toString().split(":");
    var splittedDay = (splittedDate[0]).toString().split(" ");
    var signatureContent = pdfServiceConstants.text.signatureContent + userFullName + " on "+ splittedDay[1] + " " +this.ordinal_suffix_of(parseInt( splittedDay[2])) + ", " + splittedDay[3] + ", " +  splittedDay[4] + ":" + splittedDate[1]; 

    pdf.setTextColor(0, 0, 0); 
    pdf.setFontType(pdfServiceConstants.style.font.normal);    
    pdf.text(15, y + 60, pdfServiceConstants.text.signature);
    pdf.text(55, y + 60, signatureContent);
    pdf.setDrawColor(0);
    pdf.setFillColor(114, 111, 111);
    pdf.rect(55, y+63, signatureContent.length * 3.75, .5, pdfServiceConstants.pdfDraw.line.f);

    pdf.setDrawColor(0);
    pdf.setFillColor(114, 111, 111);
    pdf.rect(margins.left, y - 15, margins.width-5, .5, pdfServiceConstants.pdfDraw.line.f);

    return pdf;
  }

  this.exportChangePrescPDF = function(slectedPatient, userFullName, currentDate, protocols, deviceType) {
    var pdf = this.getPdf();
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    pdf = this.setHeader(pdf);
    pdf = this.addBody(pdf, slectedPatient, userFullName, currentDate, protocols, deviceType);
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80);
    pdf = this.setPageNumber(pdf, "1", "1");
    setTimeout(function(){
      pdf.save('VisiView™.pdf');
    },1000);
  }

  this.setPageNumber = function(pdf, currentPageNo, totalPageNo){
    var pageHeight = pdf.internal.pageSize.height;
    pdf.setFontType("normal");
    pdf.setFontSize(6);
    pdf.setTextColor(0,0,0);
    pdf.text(margins.width-295,pageHeight-13, "Page");

    pdf.setFontType("bold");
    pdf.setFontSize(6);
    pdf.setTextColor(0,0,0);
    pdf.text(margins.width-280,pageHeight-13, currentPageNo);   //15

    pdf.setFontType("normal");
    pdf.setFontSize(6);
    pdf.setTextColor(0,0,0);
    pdf.text(margins.width-275,pageHeight-13, "of "); //5

    pdf.setFontType("bold");
    pdf.setFontSize(6);
    pdf.setTextColor(0,0,0);
    pdf.text(margins.width-268,pageHeight-13, totalPageNo + " ");
    return pdf;
  }

  this.addAllSvgsToPDF = function(pdf, canvasId, svgId, imageX, imageY, imageWidth, imageHeight, chartName){    
    if(chartName){
      pdf.setFont(pdfServiceConstants.style.font.helvetica); 
      pdf.setFontType(pdfServiceConstants.style.font.bold);        
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text((pdf.internal.pageSize.width/2)-((chartName.length*3.5)/2),   imageY-30, chartName);
    }

    var canvasImgWidth = imageWidth;
    var canvasImgHeight = 100;
    if(this.isMobile()){
      canvasImgWidth = 300;
      canvasImgHeight = 158;
    }
   imageY -= 15;
    var canvas = document.getElementById(canvasId);              
    var ctx = canvas.getContext('2d');
    var serializer = new XMLSerializer();
    var allSvgs = document.getElementById(svgId).querySelectorAll('svg');
    var count = 0;
    for (count = 0; count < allSvgs.length; count++) {
      $("#"+canvasId).empty();
      var svgString = serializer.serializeToString(allSvgs[count]);          
      canvg(canvas, svgString);
      var img = $("#"+canvasId)[0].toDataURL('image/png', 1.0);
      pdf.addImage(img, 'png', imageX, imageY, canvasImgWidth, canvasImgHeight);
      imageY += canvasImgHeight;
    }

    return pdf;
  }

  this.addPatientInfoToHMRCReport = function(pdf, patientInfo, fromDate , toDate){
    var patientDetails = (patientInfo && patientInfo.patient) ? patientInfo.patient : null;
    var pdfClinic = (patientInfo && patientInfo.clinics && patientInfo.clinics.length > 0) ? patientInfo.clinics[0] : null;
    var pdfClinicAddress = (pdfClinic !== null && pdfClinic.address) ? pdfClinic.address : stringConstants.notAvailable;
    var pdfClinicPhone = (pdfClinic !== null && pdfClinic.phoneNumber) ? pdfClinic.phoneNumber : stringConstants.notAvailable;
    var reportGenerationDate = dateService.getDateFromTimeStamp(new Date().getTime(),patientDashboard.dateFormat,'/');
    var patientMrnId = (patientDetails !== null && patientDetails.mrnId)? patientDetails.mrnId : stringConstants.notAvailable;
    var patientName = (patientDetails !== null && patientDetails.firstName && patientDetails.firstName !== null)? patientDetails.firstName+stringConstants.space : "";
    patientName = (patientDetails.lastName  && patientDetails.lastName  !== null) ? patientName+patientDetails.lastName : patientName;
    patientName = (patientName && patientName.length > 0) ? patientName : stringConstants.notAvailable;
    var completePatientAddress = (patientDetails !== null && patientDetails.address) ? patientDetails.address : stringConstants.emptyString;
    completePatientAddress = (patientDetails !== null && patientDetails.city) ? ((completePatientAddress.length > 1) ? (completePatientAddress+stringConstants.comma+patientDetails.city) : patientDetails.city) : completePatientAddress;
    completePatientAddress = (patientDetails !== null && patientDetails.state) ? ((completePatientAddress.length > 1) ? (completePatientAddress+stringConstants.comma+patientDetails.state) : patientDetails.state) : completePatientAddress;            
    completePatientAddress = (patientDetails !== null && patientDetails.zipcode) ? ((completePatientAddress.length > 1) ? (completePatientAddress+stringConstants.comma+patientDetails.zipcode) : patientDetails.zipcode) : completePatientAddress;      
    var patientPhone = (patientDetails !== null && patientDetails.mobilePhone)? patientDetails.mobilePhone : stringConstants.notAvailable;
    var patientDOB = (patientDetails !== null && patientDetails.dob)? dateService.getDateFromTimeStamp(patientDetails.dob,patientDashboard.dateFormat,'/') : stringConstants.notAvailable;    
    var patientDeviceType ='';
    var patientDeviceSlNo ='';
    var patientDeviceSlNoVest='';
    var patientDeviceSlNoMonarch='';

    if(patientInfo.deviceType == 'MONARCH'){
        patientDeviceType = stringConstants.deviceTypeMonarch;
      for(var  i=0 ; i<patientInfo.patientDevices.length ; i++){
        if(patientInfo.patientDevices[i].active==true){
            patientDeviceSlNo = (patientInfo.patientDevices && patientInfo.patientDevices[i] && patientInfo.patientDevices[i].serialNumber) ? patientInfo.patientDevices[i].serialNumber: stringConstants.notAvailable;
       }
     }
    }
    else if(patientInfo.deviceType == 'VEST'){
     patientDeviceType = stringConstants.deviceType;
      for(var  i=0 ; i<patientInfo.patientDevices.length ; i++){
        if(patientInfo.patientDevices[i].active==true){
            patientDeviceSlNo = (patientInfo.patientDevices && patientInfo.patientDevices[i] && patientInfo.patientDevices[i].serialNumber) ? patientInfo.patientDevices[i].serialNumber: stringConstants.notAvailable;
        }
      }
    }
  else {
     patientDeviceType = stringConstants.deviceTypeBoth;
    var count=0; 
    for(var  i=0 ; i<patientInfo.patientDevices.length ; i++){       
            if(patientInfo.patientDevices[i].active==true){                
                 count=count+1;  
                 if(count==1){
                   patientDeviceSlNoVest=(patientInfo.patientDevices && patientInfo.patientDevices[i] && patientInfo.patientDevices[i].serialNumber) ? patientInfo.patientDevices[i].serialNumber: stringConstants.notAvailable;
                 }else if(count==2){
                   patientDeviceSlNoMonarch =(patientInfo.patientDevices && patientInfo.patientDevices[i] && patientInfo.patientDevices[i].serialNumber) ? patientInfo.patientDevices[i].serialNumber: stringConstants.notAvailable;
                 }
            }
          patientDeviceSlNo =  patientDeviceSlNoVest  +' '+','+' '+patientDeviceSlNoMonarch ;
          }
     }
 
    var pdfMissedTherapyDays = (patientInfo.missedtherapyDays !== null && patientInfo.missedtherapyDays >= 0) ? patientInfo.missedtherapyDays : stringConstants.notAvailable;
    var pdfHMRNonAdherenceScore = (patientInfo.adherenceScore !== null && patientInfo.adherenceScore >= 0) ? patientInfo.adherenceScore : 0;
    var pdfSettingDeviation = (patientInfo.settingsDeviatedDaysCount !== null && patientInfo.settingsDeviatedDaysCount >= 0) ? patientInfo.settingsDeviatedDaysCount : stringConstants.notAvailable;
    completePatientAddress = (completePatientAddress === stringConstants.emptyString) ? stringConstants.notAvailable : completePatientAddress;      
      
    g_pdfMetaData = {
      rTitle: 'HillRom'
      ,rTitle1: 'VisiView™ Health Portal'
      ,rGenDtLbl : stringConstants.reportGenerationDateLabel
      , rGenDt : reportGenerationDate
      , rRngLble : stringConstants.dateRangeOfReportLabel+stringConstants.colon
      , rRngDt : fromDate+stringConstants.minus+toDate
      , rTablePatInfo : {
          title: stringConstants.patientInformationLabel
          , tData:  [
            stringConstants.mrn+stringConstants.colon, patientMrnId
            ,stringConstants.name+stringConstants.colon, patientName
            ,stringConstants.address+stringConstants.colon, completePatientAddress
            ,stringConstants.phone+stringConstants.colon, patientPhone
            ,stringConstants.DOB+stringConstants.colon, patientDOB
            ,stringConstants.adherenceScore, pdfHMRNonAdherenceScore
          ]
      }
      , rDeviceInfo :{
         title: stringConstants.deviceInformationLabel
          , tData:[
            stringConstants.type+stringConstants.colon, patientDeviceType
            , stringConstants.serialNumber+stringConstants.colon, patientDeviceSlNo
           ]
      }
      , rNoteInfo :{
         title: stringConstants.NotificationLabel
          , tData: [
            stringConstants.consecutiveMissedDays+stringConstants.colon, pdfMissedTherapyDays
            ,stringConstants.averageSessionMinutes+stringConstants.colon, patientInfo.hmrRunRate
            ,stringConstants.consecutiveFrequencyDeviationDays+stringConstants.colon, pdfSettingDeviation
          ]
      }

    };    
    pdf.cellInitialize();

    pdf.margins = 1;
    pdf.setFont("helvetica");
                   
    pdf.cellInitialize();
         
    var tabInfo = g_pdfMetaData.rTablePatInfo.tData;
    var rCount =0;

    for(var i=0;i<tabInfo.length;i=i+2){
         rCount++;
        if(i==0){  
          pdf.setDrawColor(0);
          pdf.setFillColor(124,163,220);
          pdf.rect(margins.left, margins.top+50, margins.tCapWidth, 20, 'F');           
          
          //pdf.setFont("helvetica"); 
          pdf.setFontType("bold");        
          pdf.setFontSize(6);
          pdf.setTextColor(234, 238, 242);
          pdf.cell(margins.left, margins.top+50, margins.tCapWidth, 20, g_pdfMetaData.rTablePatInfo.title); 
        }
        pdf.setFontType("normal");
        pdf.setTextColor(0,0,0)
        pdf.cell(margins.left, margins.top+70, 80, 21, tabInfo[i].toString(), rCount+1);                     
        pdf.cell(margins.left, margins.top+70, 200, 21, tabInfo[i+1].toString(), rCount+1);  
    }

    pdf.cellInitialize();
    tabInfo = g_pdfMetaData.rDeviceInfo.tData;
    var rCount =0;
    for(var i=0;i<tabInfo.length;i=i+2){
         rCount++;
        if(i==0){
          pdf.setDrawColor(0);
          pdf.setFillColor(124,163,220);
          pdf.rect(margins.t2TabLeft, margins.top+50, margins.tCapWidth, 20, 'F');           

          //pdf.setFont("helvetica"); 
          pdf.setFontType("bold");
          pdf.setFontSize(6);
          pdf.setTextColor(234, 238, 242);
          pdf.cell(margins.t2TabLeft, margins.top+50, margins.tCapWidth, 20, g_pdfMetaData.rDeviceInfo.title); 
        }
        pdf.setTextColor(0,0,0)
        pdf.setFontType("normal");
        pdf.cell(margins.t2TabLeft, margins.top+70, margins.tCellWidth, 20, tabInfo[i], rCount+1);  
        if(tabInfo[i].toString() === "Type:"){   
          pdf.setTextColor(128, 179, 227);
          pdf.setFontType("normal");           
          pdf.cell(margins.t2TabLeft, margins.top+40, margins.tCellWidth, 20, tabInfo[i+1].toString(), rCount+1);
        }else{
          pdf.setTextColor(0,0,0);
          pdf.setFontType("normal");              
          pdf.cell(margins.t2TabLeft, margins.top+40, margins.tCellWidth, 20, tabInfo[i+1].toString(), rCount+1);  
        }                     
    }
         

    pdf.cellInitialize();
    tabInfo = g_pdfMetaData.rNoteInfo.tData;
    var rCount =0;
    for(var i=0;i<tabInfo.length;i=i+2){      
        rCount++;
        if(i==0){
          pdf.setDrawColor(0);
          pdf.setFillColor(124,163,220);
          pdf.rect(margins.t2TabLeft, margins.top+115, margins.tCapWidth, 20, 'F');

          pdf.setFontType("bold");
          pdf.setFontSize(6);
          pdf.setTextColor(234, 238, 242);
          pdf.cell(margins.t2TabLeft, margins.top+115, margins.tCapWidth, 20, g_pdfMetaData.rNoteInfo.title); 
        }
        pdf.setTextColor(0,0,0)
        pdf.setFontType("normal");
        pdf.cell(margins.t2TabLeft, margins.top+135, margins.tCellWidth, 20, tabInfo[i].toString(), rCount+1);   
        pdf.cell(margins.t2TabLeft, margins.top+40, margins.tCellWidth, 20, tabInfo[i+1].toString(), rCount+1);  
    }
    return pdf;
  }

  this.exportHMRCGraphAsPDF = function(divId, canvasId, fromDate, toDate, patientInfo, clinicDetails){
    var pdf = this.getPdf();
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    if(clinicDetails && clinicDetails !== null){
      this.setHeaderAsClinic(pdf, fromDate, toDate, clinicDetails);
    }else{
      pdf = this.setHeader(pdf, fromDate, toDate, pdfServiceConstants.text.pdfpageHeader);
    }
    pdf = this.addPatientInfoToHMRCReport(pdf, patientInfo, fromDate, toDate); 
    pdf = this.addAllSvgsToPDF(pdf, canvasId, divId, 30, 350, 540, 200, pdfServiceConstants.text.complianceStatistics);
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80);
    pdf = this.setPageNumber(pdf, "1", "2");  
    pdf.addPage(); 
    pdf = this.setTopHeader(pdf, fromDate, toDate);
    pdf = this.addSvgToPDF(pdf, canvasId, "HMRGraph", 30, 150, 540, 200, pdfServiceConstants.text.hmrStatistics); 
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80, true);
    pdf = this.setPageNumber(pdf, "2", "2");
    setTimeout(function(){     
      pdf.save('VisiView™.pdf'); 
    },1000); 
  }

  /*
  For Adherence Trend
  */
  this.exportHMRCGraphAsPDFForAdherenceTrend = function(divId, canvasId, fromDate, toDate, patientInfo, clinicDetails){
    var pdf = this.getPdf();
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    if(clinicDetails && clinicDetails !== null){
      this.setHeaderAsClinic(pdf, fromDate, toDate, clinicDetails);
    }else{
      pdf = this.setHeader(pdf, fromDate, toDate, pdfServiceConstants.text.pdfpageHeader);
    }
    pdf = this.addPatientInfoToHMRCReport(pdf, patientInfo, fromDate, toDate); 
    pdf = this.addAllSvgsToPDF(pdf, canvasId, divId, 30, 350, 540, 200, pdfServiceConstants.text.protocolGraph);
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80);
    pdf = this.setPageNumber(pdf, "1", "2");  
    pdf.addPage(); 
    pdf = this.setTopHeader(pdf, fromDate, toDate);
    pdf = this.addSvgToPDF(pdf, canvasId, "HMRGraph", 30, 150, 540, 200, pdfServiceConstants.text.hmrStatistics); 
    pdf = this.addSvgToPDF(pdf, canvasId, "AdherenceTrendGraph", 30, 420, 540, 200, pdfServiceConstants.text.adherenceTrend); 
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80, true);
    pdf = this.setPageNumber(pdf, "2", "2");
    setTimeout(function(){     
      pdf.save('VisiView™.pdf'); 
    },1000); 
  }

  this.exportHMRCGraphAsPDFForAdherenceTrendForAll = function(divId,divId1,canvasId, fromDate, toDate, patientInfo, clinicDetails,hmrChartData1){
    var pdf = this.getPdf();
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    if(clinicDetails && clinicDetails !== null){
      this.setHeaderAsClinic(pdf, fromDate, toDate, clinicDetails);
    }else{
      pdf = this.setHeader(pdf, fromDate, toDate, pdfServiceConstants.text.pdfpageHeader);
    }

    pdf = this.addPatientInfoToHMRCReport(pdf, patientInfo, fromDate, toDate); 

    pdf = this.addAllSvgsToPDF(pdf, canvasId, divId, 30, 350, 540, 200, pdfServiceConstants.text.protocolGraph);

    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80);
    pdf = this.setPageNumber(pdf, "1", "3");  
    pdf.addPage(); 
    pdf = this.setTopHeader(pdf, fromDate, toDate);
    pdf = this.addSvgToPDF(pdf, canvasId, "HMRGraph", 30, 150, 540, 200, pdfServiceConstants.text.hmrStatistics); 
    pdf = this.addSvgToPDF(pdf, canvasId, "AdherenceTrendGraph", 30, 420, 540, 200, pdfServiceConstants.text.adherenceTrend); 
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80);
    pdf = this.setPageNumber(pdf, "2", "3");
    pdf.addPage(); 
    pdf = this.setTextForMonarch(pdf);


   if(hmrChartData1==undefined )
        {
          pdf = this.setTextForNoGraphForAll(pdf);
        }else{
        pdf = this.addAllSvgsToPDF(pdf, canvasId, divId1, 30, 130, 540, 250, pdfServiceConstants.text.protocolGraph);
        pdf = this.addSvgToPDF(pdf, canvasId, "HMRGraph1", 30, 490, 540, 200, pdfServiceConstants.text.hmrStatistics);
        }
    


    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80, true);
    pdf = this.setPageNumber(pdf, "3", "3");
    setTimeout(function(){     
      pdf.save('VisiView™.pdf'); 
    },1000); 
  }




  /*
  For Adherence Trend when HMR and Adherence Trend graph is not there
  */
  this.exportHMRCGraphAsPDFForAdherenceTrendHavingNoHMR = function(divId, canvasId, fromDate, toDate, patientInfo, clinicDetails){
    var pdf = this.getPdf();
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    if(clinicDetails && clinicDetails !== null){
      this.setHeaderAsClinic(pdf, fromDate, toDate, clinicDetails);
    }else{
      pdf = this.setHeader(pdf, fromDate, toDate, pdfServiceConstants.text.pdfpageHeader);
    }
    pdf = this.addPatientInfoToHMRCReport(pdf, patientInfo, fromDate, toDate); 
    pdf = this.addSvgToPDF(pdf, canvasId, "AdherenceTrendGraph", 30, 350, 540, 200, pdfServiceConstants.text.adherenceTrend); 
    pdf = this.setTextForNoGraph(pdf);
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80,true);
    pdf = this.setPageNumber(pdf, "1", "1");  
    setTimeout(function(){     
      pdf.save('VisiView™.pdf'); 
    },1000); 
  }

  this.setTextForNoGraph = function(pdf)
  {
    pdf.setFont(pdfServiceConstants.style.font.helvetica);   
    pdf.setFontType(pdfServiceConstants.style.font.bold);
    pdf.setFontSize(8);
    pdf.setTextColor(0,0,0);
    pdf.text((pdf.internal.pageSize.width/2)-((66*3.5)/2), 630, pdfServiceConstants.text.noHMRGraphContentForPDF);
    return pdf;
  }
  
   this.setTextForNoGraphForAll = function(pdf)
  {
    pdf.setFont(pdfServiceConstants.style.font.helvetica);   
    pdf.setFontType(pdfServiceConstants.style.font.bold);
    pdf.setFontSize(8);
    pdf.setTextColor(0,0,0);
    pdf.text((pdf.internal.pageSize.width/2)-((66*3.5)/2), 330, pdfServiceConstants.text.noHMRGraphContentForPDF);
    return pdf;
  }

  this.setTextForMonarch = function(pdf)
  {
    pdf.setFont(pdfServiceConstants.style.font.helvetica);   
    pdf.setFontType(pdfServiceConstants.style.font.bold);
    pdf.setFontSize(12);
    pdf.setTextColor(0,0,0);
    pdf.text((pdf.internal.pageSize.width/2)-((10*3.5)/2), 80, pdfServiceConstants.text.monarch);
    return pdf;
  }



  this.exportHCPCharts = function(cdivId, tdivId, canvasId, fromDate, toDate){
    var pdf = this.getPdf();
    var imgY = 150;
    pdf = this.setHeader(pdf, fromDate, toDate);
    if(cdivId){
      pdf = this.addSvgToPDF(pdf, canvasId, cdivId, 20, imgY, 540, 200, pdfServiceConstants.text.cumulativeStatistics); 
      imgY = imgY + 250;
    }
    if(tdivId){
      pdf = this.addSvgToPDF(pdf, canvasId, tdivId, 20, imgY, 540, 200, pdfServiceConstants.text.treatmentsStatistics); 
    }    
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80);
    pdf = this.setPageNumber(pdf, "1", "1");
    setTimeout(function(){     
      pdf.save('VisiView™.pdf'); 
    },1000); 
  }

  this.setTopHeaderForClinic = function(pdf, fromDate, toDate, clinic){
    var top = margins.titleTop-15;
    pdf.setFont(pdfServiceConstants.style.font.helvetica);   
    pdf.setFontType(pdfServiceConstants.style.font.bold);
    pdf.setFontSize(8);
    pdf.setTextColor(0,0,0);
    pdf.text((pdf.internal.pageSize.width/2)-((clinic.name.length*3.5)/2), top, clinic.name);
    top += 8;

    if(clinic.address){
      pdf.setFont(pdfServiceConstants.style.font.helvetica);   
      pdf.setFontType(pdfServiceConstants.style.font.bold);
      pdf.setFontSize(8);
      pdf.setTextColor(0,0,0);
      pdf.text((pdf.internal.pageSize.width/2)-((clinic.address.length*3.5)/2), top, clinic.address);
      top += 8;
    }
    
    if(clinic.address2){
      pdf.setFont(pdfServiceConstants.style.font.helvetica);   
      pdf.setFontType(pdfServiceConstants.style.font.bold);
      pdf.setFontSize(8);
      pdf.setTextColor(0,0,0);
      pdf.text((pdf.internal.pageSize.width/2)-((clinic.address2.length*3.5)/2), top, clinic.address2);
      top += 8;
    }

    if(clinic.city || clinic.state || clinic.zipcode){
      var addressText = (clinic.city) ? clinic.city : null;
      addressText = (clinic.state) ?  (addressText ? addressText+", "+clinic.state: clinic.state ) : (addressText ? addressText: null) ;
      addressText = (clinic.zipcode) ?  (addressText ? addressText+", "+clinic.zipcode.toString(): clinic.zipcode.toString() ) : (addressText ? addressText: "") ;
      pdf.setFont(pdfServiceConstants.style.font.helvetica);   
      pdf.setFontType(pdfServiceConstants.style.font.bold);
      pdf.setFontSize(8);
      pdf.setTextColor(0,0,0);
      pdf.text((pdf.internal.pageSize.width/2)-((addressText.length*3.5)/2), top, addressText);
      top += 8;
    }

    if(clinic.phoneNumber || clinic.faxNumber){
      var addressText = (clinic.phoneNumber.toString()) ? "Phone Number : " + clinic.phoneNumber.toString() : null;
      addressText = (clinic.faxNumber) ?  (addressText ? addressText+", Fax : "+clinic.faxNumber.toString(): clinic.faxNumber.toString() ) : (addressText ? addressText: "") ;
      pdf.setFont(pdfServiceConstants.style.font.helvetica);   
      pdf.setFontType(pdfServiceConstants.style.font.bold);
      pdf.setFontSize(8);
      pdf.setTextColor(0,0,0);
      pdf.text((pdf.internal.pageSize.width/2)-((addressText.length*3.5)/2), top, addressText);  
      top += 8;    
    }
    top -= 8;

    pdf.setFont(pdfServiceConstants.style.font.helvetica);  
    pdf.setFontType(pdfServiceConstants.style.font.bold); 
    pdf.setFontSize(11);
    pdf.setTextColor(124,163,220);
    pdf.text(margins.width-30, top-10,g_pdfMetaData.rTitle); // top-10

    pdf.setFont(pdfServiceConstants.style.font.helvetica);   
    pdf.setFontType(pdfServiceConstants.style.font.bold);      
    pdf.setFontSize(7);
    pdf.setTextColor(114, 111, 111);
    pdf.text(margins.width-70,   top, g_pdfMetaData.rTitle1); //top

    pdf.setDrawColor(0);
    pdf.setFillColor(114, 111, 111);
    pdf.rect(margins.left, top+5, margins.width-5, .5, pdfServiceConstants.pdfDraw.line.f); 

    pdf.setFont(pdfServiceConstants.style.font.helvetica); 
    pdf.setFontType(pdfServiceConstants.style.font.normal);        
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.text(margins.left,   top+30, pdfServiceConstants.text.reportGenerationDate+pdfServiceConstants.text.colon);

    pdf.setFont(pdfServiceConstants.style.font.helvetica); 
    pdf.setFontType(pdfServiceConstants.style.font.normal);        
    pdf.setFontSize(8);
    pdf.setTextColor(128, 179, 227);
    pdf.text(margins.left+94,   top+30, dateService.getDateFromTimeStamp(new Date().getTime(),patientDashboard.dateFormat,'/'));
    
    var daterange = fromDate;
    if(fromDate && toDate){
      if(fromDate === toDate){ 
        pdf.setFont(pdfServiceConstants.style.font.helvetica); 
        pdf.setFontType(pdfServiceConstants.style.font.normal);        
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);  
        pdf.text(pdf.internal.pageSize.width-135,   top+30, pdfServiceConstants.text.dateRangeOfReportLabel+pdfServiceConstants.text.colon);     
        pdf.setFont(pdfServiceConstants.style.font.helvetica); 
        pdf.setFontType(pdfServiceConstants.style.font.normal);        
        pdf.setFontSize(8);
        pdf.setTextColor(128, 179, 227);
        pdf.text(pdf.internal.pageSize.width-49,   top+30, daterange);
      }else{
        pdf.setFont(pdfServiceConstants.style.font.helvetica); 
        pdf.setFontType(pdfServiceConstants.style.font.normal);        
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);  
        pdf.text(pdf.internal.pageSize.width-185,   top+30, pdfServiceConstants.text.dateRangeOfReportLabel+pdfServiceConstants.text.colon);
        pdf.setFont(pdfServiceConstants.style.font.helvetica); 
        pdf.setFontType(pdfServiceConstants.style.font.normal);        
        pdf.setFontSize(8);
        pdf.setTextColor(128, 179, 227);
        var daterange = fromDate +pdfServiceConstants.text.hyphen+ toDate;      
        pdf.text(pdf.internal.pageSize.width-98,   top+30, daterange);
      }
    }
    
    return pdf;
  }

  this.setHeaderAsClinic = function(pdf, fromDate, toDate, clinic){    
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    margins.t2TabLeft=(pageWidth/2)+5;
    
    pdf = this.setTopHeaderForClinic(pdf, fromDate, toDate, clinic);
    //pdf = this.setDateRange(pdf, fromDate, toDate, true);
    return pdf;
  }


  this.downloadPatientBMAsPDF = function(divId, canvasId, fromDate, toDate, clinicDetails){
    var pdf = this.getPdf();
    var imgY = 150;    
   /* if(clinicDetails && clinicDetails !== null){
      this.setHeaderAsClinic(pdf, fromDate, toDate, clinicDetails);
    }else{*/
      pdf = this.setHeader(pdf, fromDate, toDate, pdfServiceConstants.text.pdfpageHeader);
    //y}
    if(divId){
      pdf = this.addSvgToPDF(pdf, canvasId, divId, 30, imgY, 540, 200, null,null,null, 140); 
      imgY = imgY + 250;
    }    
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80);
    pdf = this.setPageNumber(pdf, "1", "1");
    setTimeout(function(){     
      pdf.save('VisiView™.pdf'); 
    },1000); 
  }

  
  
}]);