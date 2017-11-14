'use strict';
angular.module('hillromvestApp')
  .service('graphService', ['dateService', function(dateService) {
      	this.getPdfForSVGGraph = function(graphData) {
	        canvg('canvas', new XMLSerializer().serializeToString(document.querySelector('svg')));		
			var canvas = document.getElementById("canvas");
			var img = canvas.toDataURL("image/png");		
	        var doc = new jsPDF('p', 'pt');
	        doc.addImage(img,'PNG',0,0,1000,1000);	
	        var columns = [
	        {title: "Date", key: "date"},
	        {title: "Treatments/Day", key:"treatmentsPerDay"},
	        {title: "Avg Frequency", key:"weightedAvgFrequency"},
	        {title: "Avg Pressure", key:"weightedAvgPressure"},
	        {title: "Normal Cough  Pauses", key:"normalCoughPauses"},
	        {title: "Cough Pauses", key:"coughPauses"},
	        {title: "HMR", key:"hmr"}
	        ]; 
	        var data = []; 
	        var datarowProgrammedCoughPauses, dataRowNormalCoughPauses, dataRowCoughPauses, dataRowDate, dataRowTreatments, dataRowAvgFrequency, dataRowAngPressure, dataRowStartDate, dataRowEndDate, dataRowHMR;      			
				angular.forEach(graphData.actual, function(graphDataRow) {	
				dataRowDate = dateService.getDateFromTimeStamp(graphDataRow.timestamp,patientDashboard.dateFormat,'/');
				dataRowTreatments = graphDataRow.treatmentsPerDay;
				dataRowStartDate = dateService.getDateFromTimeStamp(graphDataRow.start,patientDashboard.dateFormat,'/');
				dataRowEndDate = dateService.getDateFromTimeStamp(graphDataRow.end,patientDashboard.dateFormat,'/');
				dataRowAvgFrequency = graphDataRow.weightedAvgFrequency;
				dataRowAngPressure = graphDataRow.weightedAvgPressure;
				dataRowHMR = graphDataRow.hmr;
				datarowProgrammedCoughPauses = graphDataRow.programmedCoughPauses;
				dataRowNormalCoughPauses = 	graphDataRow.normalCoughPauses;
				dataRowCoughPauses = graphDataRow.coughPauses;		  
				  data.push({
				  	"date":  dataRowDate,
				  	"treatmentsPerDay": dataRowTreatments, 
				  	"weightedAvgFrequency": dataRowAvgFrequency, 
				  	"weightedAvgPressure": dataRowAngPressure, 
				  	"programmedCoughPauses": datarowProgrammedCoughPauses, 
				  	"normalCoughPauses": dataRowNormalCoughPauses, 
				  	"coughPauses": dataRowCoughPauses,
				  	"hmr": dataRowHMR });
				});		
			doc.addPage();
			doc.autoTable(columns, data);
	        doc.save('sample-file.pdf');
	        doc = null;
	    } 

	    this.downloadAsCSVFile = function(csvText, filename, dataType){ 
	    	if (!csvText.match(/^data:text\/csv/i)) { 
	            csvText = 'data:text/csv;charset=utf-8,' + csvText; 
	        } 
	        var data = encodeURI(csvText); 
	    	var link = document.createElement('a'); 
	        link.setAttribute('href', data); 
	        link.setAttribute('id', dataType);
	        link.setAttribute('download', filename); 
	        document.body.appendChild(link);
	        link.click(); 	         	 
	    }	    
  }]);
