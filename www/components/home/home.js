'use strict';

receipt_module.controller('HomeController', ['$scope', '$state', '$rootScope', 'UserService', '$q', function ($scope, $state, $rootScope, UserService, $q) {

    $scope.goodsReceiptFlow = function () {
        console.log("gr flow init");
        $state.go('root.good_receipt.step1');
    };

    $scope.paymentReceiptFlow = function () {
        $state.go('root.payment_receipt.step1');
    };

    $scope.cashFlow = function () {
        $state.go('root.cash.details');
    };

    $scope.invoiceFlow = function () {
        $state.go('root.invoice.selection');
    };

    $scope.chequeFlow = function () {
        $state.go('root.cheque.details');
    };

    console.log("Hi from Home Controller");

    $scope.isAuthorized = function (doctype) {
        return $.inArray(doctype, $rootScope.startup.can_write) > -1;
    };

}]);
