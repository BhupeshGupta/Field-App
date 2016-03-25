'use strict';

receipt_module.controller('HomeController', homeController);


function homeController($scope, $state, $rootScope, SessionService) {

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
        $state.go('root.invoice.step1');
    };

    $scope.chequeFlow = function () {
        $state.go('root.cheque.details');
    };

    console.log("Hi from Home Controller");

    $scope.isAuthorized = SessionService.isWriteAuth;

}
