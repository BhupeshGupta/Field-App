'use strict';

receipt_module.controller('LoginController', ['$scope', '$state', function($scope, $state) {
  $scope.login = function() {
//    $state.go('root.home');
      window.location = '#/home'
  };
}]);
