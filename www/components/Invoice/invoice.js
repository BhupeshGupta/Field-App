'use strict';

receipt_module.controller('InvoiceFlowController', function ($scope, $state, $cordovaBarcodeScanner, getInvoiceMetaData) {

//    $scope.invoiceScanCode = function () {
//        $state.go('invoice.scan');
//    };

    $scope.invoiceEnterMaually = function () {
        $state.go('root.invoice.enter_data_manually');
    };

    console.log("Hi from Invoice Controller");

    $scope.scanBarcode = function () {
        $cordovaBarcodeScanner.scan().then(function (code) {
            alert(code.text);
            getInvoiceMetaData.get_meta(code.text).then(
                function (data) {
                    alert(JSON.stringify(data));
                },
                function (error) {
                    alert(error);
                }
            );
        }, function (error) {
            alert("Unable to scan code. Proceed Manually");
        });
    };
    
    $scope.user_input = {
        'type': '',
        'id': ''
    };
    
    
    $scope.getMetedata = function(meta){
        console.log(JSON.stringify(meta));
        getInvoiceMetaData.get_meta(JSON.stringify(meta)).then(
                function (data) {
                    $scope.metadata = JSON.parse(data.data.message);
                    $state.go('root.invoice.invoicereview');
                },
                function (error) {
                    alert(error);
                }
            );
    }
    
    
});
