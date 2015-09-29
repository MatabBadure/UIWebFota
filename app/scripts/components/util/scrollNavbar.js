window.onscroll = function(){
  var y = window.pageYOffset || docElem.scrollTop || body.scrollTop;
  if( y > 40 ){
    var opacity = y/20;
    document.querySelector("#top-shadow").style.display = 'block';
    document.querySelector("#top-shadow").style.opacity = opacity.toString();
  } else {
    var opacity = y/20;
    document.querySelector("#top-shadow").style.display = 'none';
    document.querySelector("#top-shadow").style.opacity = opacity.toString();
  }
};