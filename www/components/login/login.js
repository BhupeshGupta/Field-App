'use strict';

receipt_module.controller('LoginController', ['$scope', '$state', function($scope, $state) {
  $scope.login_func = function() {
    $state.go('root.home');
    console.log("Hi from Login Function");
  };

console.log("Hi from Login Controller");
    $scope.msg = 'Working';
}]);
