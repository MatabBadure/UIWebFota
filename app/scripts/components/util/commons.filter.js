
angular.module('hillromvestApp')
.filter("languageFromKey", [function() {
   return function(input) {
    if(input === "en"){
    	return "English";
    }else if(input === "fr"){
    	return "French";
    }
  };
}])
.filter("phoneFormat", [function(){
	return function (tel) {
        if (!tel) { return ''; }
        var value = tel.toString().trim();
        if (value.match(/[^0-9]/)) {
            return tel;
        }
        var city, number;
        city = value.slice(0, 3);
        number = value.slice(3);
        number = number.slice(0, 3) + '-' + number.slice(3);
        return ("(" + city + ")-" + number).trim();
    };
}]);
