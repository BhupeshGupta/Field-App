'use strict';

receipt_module.controller('InvoiceFlowController', function ($scope, $state, $cordovaBarcodeScanner, getInvoiceMetaData, $cordovaCamera, $q) {

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
            $scope.getMetedata(JSON.parse(code.text));
        }, function (error) {
            alert("Unable to scan code. Proceed Manually");
        });
    };

    $scope.user_input = {
        'type': 'Consignment Note',
        'id': ''
    };


    $scope.getMetedata = function (meta) {
        console.log(JSON.stringify(meta));
        getInvoiceMetaData.get_meta(JSON.stringify(meta)).then(
            function (data) {
                $scope.metadata = JSON.parse(data.data.message);
                $scope.takePicture();
            },
            function (error) {
                alert(error);
            }
        );
    };

    var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };

    $scope.takePic1 = function () {
        return $q(function (resolve, reject) {
            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.pic1 = "data:image/jpeg;base64," + imageData;
                resolve();
            }, function (err) {
                reject();
            });
        });
    }

    $scope.takePic2 = function () {
        return $q(function (resolve, reject) {
            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.pic2 = "data:image/jpeg;base64," + imageData;
                resolve();
            }, function (err) {
                reject();
            });
        });
    }


    $scope.takePicture = function () {
        $scope.takePic1().then(function () {
            $scope.takePic2().then(function () {
                $state.go('root.invoice.invoicereview');
            })
        });
    }

});
