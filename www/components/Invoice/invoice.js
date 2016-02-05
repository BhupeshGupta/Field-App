'use strict';

receipt_module.controller('InvoiceFlowController', function ($ionicModal, $scope, $state, $cordovaBarcodeScanner, getInvoiceMetaData, $cordovaCamera, $q) {

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

                console.log(data.data.message);

                var final_data = [];
                for (var key in $scope.metadata) {
                    final_data.push({
                        "key": key,
                        "value": $scope.metadata[key]
                    });
                }

                $scope.metadata_list = final_data;

                console.log(JSON.stringify($scope.metadata_list));

                $state.go('root.invoice.invoicereview');

                //$scope.takePicture();
            },
            function (error) {
                alert(error);
            }
        );
    };

    $scope.showImage = function (index) {
        $scope.selectedImage = $scope.docs[index];
        $scope.selectedImage.index = index;
    };

    $scope.docs = [
        {
            label: "Material Bill",
            src: "img/ionic.png"
        },
        {
            label: "Consignment Note",
            src: "img/fc19.jpg"
        },
        {
            label: "Excise Invoice",
            src: "img/ionic.png"
        },
        {
            label: "Consignment Note",
            src: "img/ionic.png"
        },
        {
            label: "Material Bill",
            src: "img/ionic.png"
        },
        {
            label: "Excise Invoice",
            src: "img/ionic.png"
        },
        {
            label: "Consignment Note",
            src: "img/ionic.png"
        },
        {
            label: "Material Bill",
            src: "img/ionic.png"
        },
        {
            label: "Excise Invoice",
            src: "img/ionic.png"
        }
    ];

    $scope.selectedImage = $scope.docs[0];
    $scope.selectedImage.index = 0;

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
    };

    $scope.takePic2 = function () {
        return $q(function (resolve, reject) {
            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.pic2 = "data:image/jpeg;base64," + imageData;
                resolve();
            }, function (err) {
                reject();
            });
        });
    };


    $scope.takePicture = function () {
        $scope.takePic1().then(function () {
            $scope.takePic2().then(function () {
                $state.go('root.invoice.invoicereview');
            });
        });
    };

    $scope.showImagesInModel = function () {
        $scope.showModal('templates/image-zoom-view.html');
    };

    $scope.showModal = function (templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
        $scope.modal.remove();
    };

    $scope.deleteImage = function () {
        var index = $scope.selectedImage.index;
        $scope.docs.splice(index, 1);
        $scope.selectedImage = $scope.docs[index];
        $scope.selectedImage.index = 0;
    };

});
