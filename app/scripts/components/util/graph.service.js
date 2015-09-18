'use strict';
angular.module('hillromvestApp')
  .service('graphService', function() {
      	this.getPdfForSVGGraph = function(graphData) {
	        canvg('canvas', new XMLSerializer().serializeToString(document.querySelector('svg')));		
			var canvas = document.getElementById("canvas");
			var img = canvas.toDataURL("image/png");		
			//document.querySelector('#pngdataurl').innerHTML = '<img src="'+img+'" width="800" height="800"/>';
	        var doc = new jsPDF();
	        doc.addImage(img,'PNG',0,0,350,350);
	        /*doc.cellInitialize();
	        for(var i=0; i<graphData.actual.length; i++){
	        	//todo
	        }*/
	        doc.save('sample-file.pdf');
	    } 

	    this.convertArrayOfObjectsToCSV = function(args) {  
	        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

	        data = args.data || null;
	        if (data == null || !data.length) {
	            return null;
	        }

	        columnDelimiter = args.columnDelimiter || ',';
	        lineDelimiter = args.lineDelimiter || '\n';

	        keys = Object.keys(data[0]);

	        result = '';
	        result += keys.join(columnDelimiter);
	        result += lineDelimiter;

	        data.forEach(function(item) {
	            ctr = 0;
	            keys.forEach(function(key) {
	                if (ctr > 0) result += columnDelimiter;

	                result += item[key];
	                ctr++;
	            });
	            result += lineDelimiter;
	        });

	        return result;
	    } 

	    this.downloadCSV = function(csvData) {  
	        var data, filename, link;
	        var csv = this.convertArrayOfObjectsToCSV({
	            data: csvData
	        });
	        if (csv == null) return;

	        filename = csvData.filename || 'export.csv';

	        if (!csv.match(/^data:text\/csv/i)) {
	            csv = 'data:text/csv;charset=utf-8,' + csv;
	        }
	        data = encodeURI(csv);
			console.log(data);
	        link = document.createElement('a');
	        link.setAttribute('href', data);
	        link.setAttribute('download', filename);
	        link.click();
	    }

	    this.getCSVForData = function(graphData){
	    	this.downloadCSV(graphData.actual);
	    	/*var actualData = graphData.actual;
	    	var csvData = "";
	    	var csvContent = "data:text/csv;charset=utf-8,";
	    	actualData.forEach(function(data, index){
	    	   csvData = (JSON.stringify(data)).replace("{", "");
	    	   (index == actualData.length-1) ? csvData.replace("}", "") : csvData.replace("}", ",") ;	    	   
			   csvContent += index < actualData.length ? csvData+ "\n" : csvData;			  
			});
			 alert("csvContent : " +csvContent );
			var encodedUri = encodeURI(csvContent);
			var link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", "my_data.csv");
			link.click();*/
	    }
  });
