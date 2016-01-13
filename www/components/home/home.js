'use strict';

receipt_module.controller('HomeController', ['$scope', '$state', function($scope, $state) {
    
 $scope.goodsReceiptFlow = function() {
   $state.go('root.home');
 };
    
 $scope.paymentReceiptFlow = function() {
   $state.go('root.home');
 };
    
 $scope.cashFlow = function() {
   $state.go('root.cash');
 };
    
 $scope.invoiceFlow = function() {
   $state.go('root.invoice.selection');
 };
    
 $scope.chequeFlow = function() {
   $state.go('root.cheque');
 };

console.log("Hi from Home Controller");
//    $scope.msg = 'Working';
}]);
