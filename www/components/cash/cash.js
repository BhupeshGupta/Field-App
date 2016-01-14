'use strict';

receipt_module.controller('cashFlowController', function ($scope, $state, $q, $http, $cordovaCamera) {

    $scope.uploadConfirmation = function () {
        $state.go('root.cash.enter_data_manually');
    };

    var signaturePad = null;

    $scope.startTakeSignature = function () {
        console.log(document.getElementById('cash_details'));
        $state.go('root.cash.review');
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
        $http.get('http://192.168.31.124:8080?' + $.param({
            txt: query,
            doctype: 'Company',
            cmd: 'frappe.widgets.search.search_link',
            _type: 'POST',
            sid: 'b1fada65342ae09985e9baf01da6d992e36d7e4d108039c934cb448f'
        })).success(function (data) {
            promise.resolve(data.results);
        });
        return promise.promise;
    };

    $scope.account_search = function (query) {
        var promise = $q.defer();
        $http.get('http://192.168.31.124:8080?' + $.param({
            txt: query,
            filters: JSON.stringify({
                company: $scope.user_input.company[0].value
            }),
            doctype: 'Account',
            cmd: 'frappe.widgets.search.search_link',
            _type: 'POST',
            sid: 'b1fada65342ae09985e9baf01da6d992e36d7e4d108039c934cb448f'
        })).success(function (data) {
            promise.resolve(data.results);
        });
        return promise.promise;
    };

    $scope.user_input = {
        company: '',
        account: '',
        amount: ''
    }


});


// Signature Pad Controller
receipt_module.controller('take_signature_controller', function ($scope, $rootScope, $q) {


    var deferred = $q.defer();
    var render_promise = deferred.promise;
    var cash_detail_image_detail = {};

    html2canvas(document.getElementById('cash_details'), {
        onrendered: function (canvas) {
            cash_detail_image_detail.image = canvas.toDataURL();
            cash_detail_image_detail.width = canvas.width;
            cash_detail_image_detail.height = canvas.height;
            deferred.resolve();
        }
    });

    var make_canvas = function () {
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

    render_promise.then(function () {
        console.log(cash_detail_image_detail.image);
        make_canvas();
    });


    $scope.clear_canvas = function () {
        make_canvas();
    };

    $rootScope.$on('signature_canvas_clear', function () {
        make_canvas();
    });

});
