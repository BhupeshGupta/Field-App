'use strict';

receipt_module.controller('InvoiceFlowController', function ($ionicPopup, $ionicModal, $scope, $state, $cordovaBarcodeScanner, getInvoiceMetaData, $cordovaCamera, $q, FileFactory) {

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
        var object = $scope.docs[index];
        if (object.action == "addNew") {

            $scope.data = {};

            var myPopup = $ionicPopup.show({
                templateUrl: 'templates/invoice-selection-popup.html',
                title: 'Select Documrnt Type',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel',
                        type: 'button-default',
                    },
                    {
                        text: '<b>Capture</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.response) {
                                e.preventDefault();
                            } else {
                                return $scope.data.response;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (label) {
                if (!label) return;
                $scope.takePic1().then(function (image) {
                    console.log(JSON.stringify(image));
                    $scope.docs.splice(-1, 0, {
                        label: label,
                        src: image.dir + image.file
                    });
                });
            });



        } else if (object.action == "addSelf") {
            $scope.takePic1().then(function (image) {
                $scope.docs.splice(object.index, 1, {
                    label: object.label,
                    src: image.dir + image.file
                });
            });

        } else {
            $scope.selectedImage = $scope.docs[index];
            $scope.selectedImage.index = index;
        }
    };

    $scope.docs = [
        {
            label: "Material Bill",
            src: "img/icon-plus.png",
            action: "addSelf"
        },
        {
            label: "Consignment Note",
            src: "img/fc19.jpg"
        },
        {
            label: "Add",
            src: "img/icon-plus.png",
            action: "addNew"
        }
    ];

    $scope.selectedImage = $scope.docs[0];
    $scope.selectedImage.index = 0;


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
    $scope.captureAndReview = function () {
        $state.go('root.invoice.step_3');
    };

    $scope.takePic1 = function () {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1960,
            targetHeight: 2560,
            cameraDirection: Camera.Direction.FRONT,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        return $cordovaCamera.getPicture(options).then(
            function (imageURI) {
                var image_name = imageURI.substring(imageURI.lastIndexOf('/') + 1);
                return FileFactory.moveFileFromCameraToExtrenalDir(image_name);
            }).then(
            function (fileInfo) {
                $cordovaCamera.cleanup();
                return $q.when(fileInfo);
            });
    };


});
