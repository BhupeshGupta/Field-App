'use strict';

receipt_module.controller('chequeFlowController', function ($scope, $state, $q, $http, $cordovaCamera) {

    $scope.uploadConfirmation = function () {
        $state.go('root.invoice.enter_data_manually');
    };

    console.log("Hi from Cheque Controller");


    $scope.user_input = {
        'company': '',
        'account': '',
        'amount': '',
        'instumentnumber': '',
        'instumentdate': '',
        'instumentbank': '',
    };

    $scope.company_search = function (query) {
        var promise = $q.defer();
        $http.get('http://192.168.31.124:8080?' + $.param({
            txt: query,
            doctype: 'Company',
            cmd: 'frappe.widgets.search.search_link',
            _type: 'POST',
            sid: 'aee4b48ee2d8324794e75137a34ebf00c3842bd746f281da55905101'
        })).success(function (data) {
            promise.resolve(data.results);
        });
        return promise.promise;
    }

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
            sid: 'aee4b48ee2d8324794e75137a34ebf00c3842bd746f281da55905101'
        })).success(function (data) {
            promise.resolve(data.results);
        });
        return promise.promise;
    }

    $scope.instrumentDate = {
        inputDate: new Date(), //Optional
        templateType: 'popup', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        callback: function (val) { //Mandatory
            datePickerCallback(val);
        },
        dateFormat: 'yyyy-MM-dd', //Optional
        closeOnSelect: true, //Optional
    };

    var datePickerCallback = function (val) {
        if (typeof (val) === 'undefined') {
            console.log('No date selected');
        } else {
            console.log('Selected date is : ', val)
            $scope.instrumentDate.inputDate = val;
        }
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
    $scope.captureAndReview = function () {
        $scope.takePic1().then(function (image) {
            $state.go('root.cheque.review');
        })
    };

});
