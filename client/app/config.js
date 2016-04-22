(function() { 

angular
  .module('myApp')
  .config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('Open2Pallete', {
      '50': 'FFBC4F',
      '100': 'FFBC4F',
      '200': 'FFBC4F',
      '300': 'FFBC4F',
      '400': 'FFBC4F',
      '500': 'FFBC4F', //this is our bar color
      '600': 'e53935', //mouse hover over NEW EVENT button color
      '700': '7CFC00',
      '800': '7CFC00',
      '900': '7CFC00',
      'A100': '7CFC00',
      'A200': '7CFC00',
      'A400': '7CFC00',
      'A700': '7CFC00',
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('Open2Pallete')
  })

  // NOTIFICATION BOX
  .config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('ojo', {
      '50': '#fffefe',
      '100': '#ffcfb2',
      '200': '#ffac7a',
      '300': '#ff7f32',
      '400': '#ff6c14',
      '500': '#f45c00',
      '600': '#d55000',
      '700': '#b74500',
      '800': '#983900',
      '900': '#7a2e00',
      'A100': '#fffefe',
      'A200': '#ffcfb2',
      'A400': '#ff6c14',
      'A700': '#b74500',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 400 A100 A200 A400'
    });
  })

  //route config
  .config(function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl: 'app/login/login.html',
      controller: 'loginCtrl'
    })
    .when('/dashboard', {
      templateUrl: 'app/dashboard/dashboard.html'
    })
    .when('/signup', {
      templateUrl: 'app/signup/signup.html',
      controller: 'signupCtrl'
    })
    .otherwise({
      redirectTo: '/'
    })
  });



})();
