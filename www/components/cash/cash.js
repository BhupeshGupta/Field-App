'use strict';

receipt_module.controller('cashFlowController', function ($scope, $state, $q, $http, $cordovaCamera, DocumentService, $rootScope) {

    $scope.uploadConfirmation = function () {
        $state.go('root.cash.enter_data_manually');
    };

    var signaturePad = null;

    $scope.startTakeSignature = function () {
        $rootScope.cash_detail_image_detail = {
            image: '',
            width: '',
            height: ''
        };

        html2canvas(document.getElementById('cash_details'), {
            onrendered: function (canvas) {
                $rootScope.cash_detail_image_detail = {
                    image: canvas.toDataURL(),
                    width: canvas.width,
                    height: canvas.height
                };
                console.log($rootScope.cash_detail_image_detail);
                console.log('FROM CASH DETAIL CONTROLLER');
                $state.go('root.cash.review');
            }
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

    $scope.company_search = function (query) {
        var promise = $q.defer();
        DocumentService.search('Company', query, {}).success(function (data) {
            promise.resolve(data.results);
        });
        return promise.promise;
    };

    $scope.account_search = function (query) {
        var promise = $q.defer();
        DocumentService.search('Account', query, {
            company: $scope.user_input.company[0].value
        }).success(function (data) {
            promise.resolve(data.results);
        });
        return promise.promise;
    };

    $scope.user_input = {
        company: '',
        account: '',
        amount: ''
    }


    $scope.createVoucher = function () {
        DocumentService.create('Journal Voucher', {
            "naming_series": "KJV-",
            "voucher_type": "Journal Voucher",
            "doctype": "Journal Voucher",
//            "user_remark": $scope.user_input.remarks,
            "docstatus": 1,
            "company": $scope.user_input.company[0].value,
            "entries": [
                {
                    "doctype": "Journal Voucher Detail",
                    "debit": $scope.user_input.amount,
                    "account": $scope.user_input.bank_account[0].value
                },
                {
                    "doctype": "Journal Voucher Detail",
                    "credit": $scope.user_input.amount,
                    "account": $scope.user_input.customer_account[0].value
                }
            ],
            "posting_date": moment().format("YYYY-MM-DD")
        }).then(
            function (success) {
                console.log(success);
            });
    };


});


// Signature Pad Controller
receipt_module.controller('takeCashSignatureController', function ($scope, $rootScope, $q) {

    var make_canvas = function () {
        var cash_detail_image_detail = $rootScope.cash_detail_image_detail;
        console.log($rootScope.cash_detail_image_detail);
        console.log('FROM CASH REVIEW CONTROLLER');
        
        document.getElementById("signature_canvas_div").innerHTML = "<canvas id='signatureCanvas' style='border: 1px solid black;'></canvas>";
        var signatureCanvas = document.getElementById('signatureCanvas');

        var ctx = signatureCanvas.getContext("2d");
        signatureCanvas.width = window.innerWidth;
        signatureCanvas.height = window.innerHeight - 170;

        var background = new Image();
        background.src = cash_detail_image_detail.image;
        background.onload = function () {
            ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, cash_detail_image_detail.width, cash_detail_image_detail.height);
        }
        new SignaturePad(signatureCanvas);
    }

    make_canvas();


    $scope.clearCanvas = function () {
        make_canvas();
    };

    $rootScope.$on('signature_canvas_clear', function () {
        make_canvas();
        console.log("cleat invoked.");
    });

});
