'use strict';

receipt_module.controller('cashFlowController', function ($scope, $state, $q, $http, $cordovaCamera) {

    $scope.uploadConfirmation = function () {
        $state.go('root.cash.enter_data_manually');
    };

    var signaturePad = null;

    $scope.startTakeSignature = function () {
        $state.go('root.cash.review').then(function () {
            var canvas = document.getElementById('signatureCanvas');
            signaturePad = new SignaturePad(canvas);
        });
    };

    console.log("Hi from Cash Controller");


    $scope.clearCanvas = function () {
        signaturePad.clear();
    };

    $scope.saveCanvas = function () {
        var sigImg = signaturePad.toDataURL();
        $scope.signature = sigImg;
    };

});
