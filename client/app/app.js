(function() {

angular
  .module('myApp', [
    'ngMaterial', 
    'ngRoute', 
    'ngMessages'
    ])


// seriously dude, put this somewhere else
// from kan, to kan.
$(".nano").nanoScroller();

emojify.setConfig({
  img_dir: 'bower_components/emojify.js/dist/images/basic',  
});

})();

