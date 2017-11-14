window.onscroll = function(){
  var y = window.pageYOffset || document.documentElement.scrollTop || document.body.scroll;
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