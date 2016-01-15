'use strict';

receipt_module.controller('HomeController', ['$scope', '$state', function ($scope, $state) {

    $scope.goodsReceiptFlow = function () {
        console.log("gr flow init");
        $state.go('root.good_receipt.customer_name');
    };

    $scope.paymentReceiptFlow = function () {
        $state.go('root.payment_receipt.payment_receipt_information');
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
    //    $scope.msg = 'Working';
}]);
