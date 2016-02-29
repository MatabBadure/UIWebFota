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
      tCapWidth:280
    };

  this.getPdf = function() {
    var pdf = new jsPDF(pdfServiceConstants.pdfDraw.p, pdfServiceConstants.pdfDraw.pt, pdfServiceConstants.pdfDraw.a4, true), specialElementHandlers = {
       '#bypassme': function(element, renderer){
        return true;
      }};
      return pdf;
  }

  this.setHeader = function(pdf) {
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    margins.t2TabLeft=(pageWidth/2)+5;

    
    pdf.setFont(pdfServiceConstants.style.font.helvetica);
    pdf.setFontType(pdfServiceConstants.style.font.bold);   
    pdf.setFontSize(8);
    pdf.setTextColor(0,0,0);
    pdf.text(margins.left,   margins.titleTop-15, dateService.getDateFromTimeStamp(new Date().getTime(), patientDashboard.dateFormat, "/"));

    pdf.setFont(pdfServiceConstants.style.font.helvetica);   
    pdf.setFontType(pdfServiceConstants.style.font.bold);
    pdf.setFontSize(8);
    pdf.setTextColor(0,0,0);
    pdf.text(margins.width-305,   margins.titleTop-15, pdfServiceConstants.text.hillromOverview);

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

    pdf.setFont(pdfServiceConstants.style.font.helvetica); 
    pdf.setFontType(pdfServiceConstants.style.font.normal);        
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.text(margins.left,   margins.titleTop+30, pdfServiceConstants.text.reportGenerationDate+pdfServiceConstants.text.colon);

    pdf.setFont(pdfServiceConstants.style.font.helvetica); 
    pdf.setFontType(pdfServiceConstants.style.font.normal);        
    pdf.setFontSize(8);
    pdf.setTextColor(128, 179, 227);
    pdf.text(margins.left+90,   margins.titleTop+30, dateService.getDateFromTimeStamp(new Date().getTime(),patientDashboard.dateFormat,'/'));

    return pdf;
  }

  this.setFooter = function(pdf, imgY, name) { 
    //imgY, is the Y position from where the signature will start.
    // the complete set i.e. name, date and signature is of height 50 px. 
    pdf.setFont(pdfServiceConstants.style.font.helvetica); 
    pdf.setFontType(pdfServiceConstants.style.font.bold);        
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);  
    pdf.text(40,imgY, name);
    pdf.line(90, imgY+4, 350,imgY+4); //left, top, right, top

    pdf.text(375,imgY, pdfServiceConstants.text.date);
    pdf.line(400, imgY+4, 560, imgY+4);// left, top, right, top

    pdf.text(40,imgY+30, pdfServiceConstants.text.signature);
    pdf.line(90, imgY+34, 350,imgY+34); //left, top, right, top
    
    //the line at the end of each page in pdf.
    // this line will always start at 30pts above the bottom of the page
    pdf.setDrawColor(0);
    pdf.setFillColor(114, 111, 111);
    pdf.rect(margins.left, pdf.internal.pageSize.height-30, margins.width-5, .5, pdfServiceConstants.pdfDraw.line.f);
    return pdf;
  }

  this.addSvgToPDF = function(pdf, canvasId, svgId, imageX, imageY, imageWidth, imageHeight, durationType, legends){
    var canvas = document.getElementById('loginAnalyticsCanvas');              
    var ctx = canvas.getContext('2d');
    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(document.getElementById(svgId).querySelector('svg'));          
    canvg(canvas, svgString);
    var img = $("#loginAnalyticsCanvas")[0].toDataURL('image/png', 1.0);
    pdf.addImage(img, 'png', imageX, imageY, imageWidth, imageHeight);
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

  this.exportLoginAnalyticsAsPDF = function(svgId, durationType, legends) {
    var pdf = this.getPdf();
    var pageHeight = pdf.internal.pageSize.height;
    var pageWidth = pdf.internal.pageSize.width;
    pdf = this.setHeader(pdf);
    pdf = this.addSvgToPDF(pdf, 'loginAnalyticsCanvas', svgId, 20, 150, 540, 200, durationType, legends);    
    pdf = this.setFooter(pdf, pdf.internal.pageSize.height-80, pdfServiceConstants.text.name);
    setTimeout(function(){     
      pdf.save('VisiView™.pdf'); 
    },1000); 
  }
}]);