'use strict';

angular.module('starter')
    .controller('GoodsReceiptController', goodsReceiptController);

function goodsReceiptController(
    $scope, $state, Persistence, DocumentService, $q, gr_config, Utils,
    $cordovaCamera, FileFactory, $cordovaGeolocation, FileDataService, $cordovaFile,
    UploadService, $http, SettingsFactory, $ionicHistory, $localStorage, NamingService,
    GrQueueService
) {

    var vm = this;
    vm.autocomplete_customer = autocomplete_customer;
    vm.autocomplete_vehicle = autocomplete_vehicle;
    vm.gr_config = gr_config;
    vm.set_item = set_item;
    vm.moveToSignatureForm = moveToSignatureForm;
    vm.captureSignatureAndCaptureImage = captureSignatureAndCaptureImage;
    vm.acceptAndUpload = acceptAndUpload;
    vm.retakeImage = retakeImage;
    vm.settings = SettingsFactory.get();

    //UI Utils
    vm.getItemDict = getItemDict;
    vm.cleardata = cleardata;
    vm.customerSelected = customerSelected;

    vm.signature = {
        bg: ''
    };

    vm.serial = '';

    function resetUserInput() {
        vm.user_input = angular.copy({
            "goods_receipt_number": "",
            "transaction_date": new Date(moment().format("YYYY-MM-DD")),
            "customer": {},
            "vehicle": {},

            "item_delivered": "",
            "delivered_quantity": "",
            "delivered_remarks": "",

            "item_received": "",
            "received_quantity": "",
            "received_remarks": "",

            "customer_document_id": "",
            "delivery_type": "Refill",
            "excess": "",
            "residue": "",
            "short": "",
            "remarks": "",


            "doctype": "Goods Receipt",
            "docstatus": 1,
            "company": vm.settings.company || "Arun Logistics",

            "posting_date": moment().format("YYYY-MM-DD"),
            "location_latitude": "",
            "location_longitude": "",
            "warehouse": vm.settings.warehouse || "Sherpur Godwon - AL",
            "$processing": false
        });

        //NamingService.registerSeries('GR', 1, 100)
        //    .then(function () {
        //        generateSeries();
        //    })
        //    .catch(function () {
        //        generateSeries();
        //    });

        //        generateSeries();

        function generateSeries() {

            NamingService.getNext()
                .then(function (serial) {
                    vm.user_input.goods_receipt_number = serial.getSerial();
                    serial.commitSerial();
                    console.log('Serial aquired ' + serial);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }

    resetUserInput();

    function autocomplete_vehicle(query) {

        return Persistence.search('%' + query, 'Vehicle', 'id')
            .then(function (vehicles) {
                return vehicles.map(function (vehicle) {
                    return vehicle.id;
                });
            });

        //        return DocumentService.search('Transportation Vehicle', query, {})
        //            .then(function (success) {
        //                return success.data.results;
        //            });
    }

    function autocomplete_customer(query) {

        return Persistence.search(query, 'Customer', 'name')
            .then(function (customers) {
                return customers.map(function (customer) {
                    return customer.name;
                });
            });
        //        return DocumentService.search('Customer', query, {
        //            enabled: 1,
        //            sale_enabled: 1
        //        }).then(function (success) {
        //            return success.data.results;
        //        });
    }

    function set_item(mode, item) {
        vm.user_input['item_' + mode] = item.id;
    }

    function moveToSignatureForm() {
        html2canvas(document.getElementById('review_template'), {
            onrendered: function (canvas) {
                vm.signature.bg = canvas.toDataURL();
                $state.transitionTo('root.good_receipt.step6');
            },
            logging: true
        });

    }

    function captureSignatureAndCaptureImage() {
        // Dump Signature To File
        var signature = vm.acceptSignaturePad();
        var file_name = Utils.guid();
        var signature_blob = FileDataService.dataURItoBlob(signature.dataUrl, 'image/png');
        $cordovaFile.writeFile(cordova.file.dataDirectory, file_name, signature_blob, true)
            .then(function (file) {
                vm.signature.signatureFile = {
                    dir: cordova.file.dataDirectory,
                    file: file_name
                };
            });

        // Start Geo-lock
        $cordovaGeolocation.getCurrentPosition({
            timeout: 10000,
            enableHighAccuracy: true
        }).then(function (location) {
            vm.user_input.location_latitude = location.coords.latitude;
            vm.user_input.location_longitude = location.coords.longitude;
            //location.coords.accuracy;
            console.log(location);
        }).catch(function (error) {
            console.log(error);
            alert(error);
        });

        // Capture & dump file
        captureImage()
            .then(function (cameraFile) {
                vm.signature.cameraFile = cameraFile;
                $state.transitionTo('root.good_receipt.step7');
            })
            .catch(function (err) {
                console.log(err);
            });

    }

    function retakeImage() {
        captureImage();
    }

    function acceptAndUpload() {
        // Disable confirm button in UI
        vm.user_input.$processing = true;

        var gr_response = prepareForErp(vm.user_input);

        return GrQueueService.enqueue(gr_response)
            .then(function (success) {
                // gr_response = success.data;
                // Submit file with upload service
                UploadService.enqueue({
                    fileName: gr_response.requestId + '_camera',
                    parentId: gr_response.requestId,
                    uploaded: 0,
                    fdir: vm.signature.cameraFile.dir,
                    fname: vm.signature.cameraFile.file,
                    opts: JSON.stringify({
                        server: 'erp',
                        doctype: 'Goods Receipt',
                        docname: gr_response.name,
                        file_field: 'customer_image',
                        filename: gr_response.name + '_customer.jpg'
                    })
                });

                // Submit file with upload service
                UploadService.enqueue({
                    fileName: gr_response.requestId + '_signature',
                    parentId: gr_response.requestId,
                    uploaded: 0,
                    fdir: vm.signature.signatureFile.dir,
                    fname: vm.signature.signatureFile.file,
                    opts: JSON.stringify({
                        server: 'erp',
                        doctype: 'Goods Receipt',
                        docname: gr_response.name,
                        file_field: 'signature',
                        filename: gr_response.name + '_signature.jpg'
                    })
                });
                vm.user_input.goods_receipt_number = gr_response.name;
                //UploadService.upload();

                // Clear history stack
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.go('root.good_receipt.step8');

                $localStorage.lastGR = angular.copy(vm.user_input);

                vm.user_input.$processing = false;

            })
            .catch(function (error) {
                console.log(error);
                alert('GR: Upload of images failed.');
                vm.user_input.$processing = false;
            });
    }

    function captureImage() {

        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1200,
            targetHeight: 1600,
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
    }

    function prepareForErp(data) {
        // Create a deep copy
        var transformed_data = JSON.parse(JSON.stringify(data));
        transformed_data.goods_receipt_number = transformed_data.goods_receipt_number.toString();
        transformed_data.customer = transformed_data.customer.value;
        transformed_data.vehicle = transformed_data.vehicle.value;
        transformed_data.transaction_date = moment(transformed_data.transaction_date).format("YYYY-MM-DD");
        transformed_data.remarks = transformed_data.delivered_remarks + '\n' + transformed_data.received_remarks;
        return transformed_data;
    }

    function getItemDict(itemId) {
        var returnItem = {};
        var itemList = vm.gr_config.empty.concat(vm.gr_config.filled);
        angular.forEach(itemList, function (item, index) {
            if (item.id == itemId) {
                returnItem = item;
            }
        });
        return returnItem;
    }

    function cleardata() {
        resetUserInput();
    }

    function customerSelected(callback) {
        //var url = SettingsFactory.getERPServerBaseUrl() + '/api/method/erpnext.accounts.party.get_party_details/';
        //vm.user_input.aditionalData = {};
        //$http
        //    .get(url, {
        //        params: {
        //            party: callback.item.value
        //        }
        //    })
        //    .then(function (data) {
        //        var content = data.data.message;
        //        vm.user_input.aditionalData = {
        //            address: content.address_display || 'N/A',
        //            contact: content.contact_display || 'N/A',
        //            mobile: content.contact_phone || 'Mobile Not Avaliable'
        //        };
        //    });

        vm.user_input.aditionalData = {};

        Persistence.search(callback.item, 'Address', 'customer', 1)
            .then(function (addresses) {

                var address = {};
                if (addresses)
                    address = JSON.parse(addresses[0].object);

                var addr_template = ['address_line1', 'address_line2', 'city', 'state', 'pincode', 'country']
                    .map(
                        function (key) {
                            return address[key];
                        }
                    );

                addr_template = addr_template.reduce(
                    function (str, elem, index) {
                        if (index === 0) {
                            return elem;
                        }
                        return elem && elem.trim() ? (str + ', ' + elem) : str;
                    }, ''
                );

                addr_template = addr_template || 'Address Not Found!';

                vm.user_input.aditionalData.address = addr_template.trim();

            });


        Persistence.search(callback.item, 'Contact', 'customer', 5)
            .then(function (contacts) {

                var contact_string = contacts.map(function (contact) {
                    contact = JSON.parse(contact.object);
                    return [contact.first_name, contact.last_name, '-', contact.phone].join(' ');
                }).join(', ');

                vm.user_input.aditionalData.contact = contact_string || 'Not Avaliable';

            });


    }
}
