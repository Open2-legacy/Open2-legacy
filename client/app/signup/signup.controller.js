(function() {

angular
  .module('myApp')
	// signup controller
  .controller('signupCtrl', function($rootScope, $scope, Services, $location) {

  $rootScope.bodyClass = "bluebg no-scroll";

  $scope.pageClass = "signup auth";
  $scope.loading = false;

  $scope.submit = function() {
    $scope.loading = true;

    var user = {
      username: $scope.username,
      password: $scope.password,
      imageUrl: $scope.imageUrl
    };

    Services.signup(user);
  };

  $scope.redirectToLogin = function() {
    $location.path('/login');
  }
});

})();
