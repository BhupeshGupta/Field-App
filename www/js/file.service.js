angular.module('starter')
    .factory('FileFactory', fileFactory);


function fileFactory($q, $cordovaFile) {

    return {
        moveFileFromCameraToExtrenalDir: moveFileFromCameraToExtrenalDir
    };

    function moveFileFromCameraToExtrenalDir(fileName) {
        return $cordovaFile.moveFile(
            cordova.file.externalCacheDirectory,
            fileName,
            cordova.file.dataDirectory
        ).then(function () {
            console.log(cordova.file.dataDirectory);
            console.log(fileName);
            return $q.when({
                dir: cordova.file.dataDirectory,
                file: fileName
            });
        });
    }
};



angular.module('starter')
    .factory('FileDataService', fileDataService);

function fileDataService($http, SettingsFactory, $cordovaFile) {
    return {
        uploadFileFromDisk: uploadFileFromDisk,
        uploadFile: uploadFile
    }

    function uploadFileFromDisk(file, requestId, tags, datauriformat) {
        return $cordovaFile
            .readAsDataURL(file.dir, file.file).then(function (file_data) {
                if (datauriformat) {
                    file_type = file_data.split(',')[0].split(';')[0].split(':')[1];
                    file_data = dataURItoBlob(file_data);
                }
                console.log(datauriformat);
                console.log(file_type);
                console.log(file_data);
                return uploadFile({
                    data: file_data,
                    name: 'file',
                    type: file_type
                }, requestId, tags);
            });
    };

    function uploadFile(file, requestId, tags) {
        // Preserve Order, Node Skipper Plugin expects add feilds before file data
        var fd = new FormData();
        fd.append('requestId', requestId);
        fd.append('tags', JSON.stringify(tags));
        fd.append('file', new Blob([file.data], {
            type: file.type
        }), file.name);

        var uploadUrl = SettingsFactory.getReviewServerBaseUrl() +
            '/file/uploadmultipart/';

        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (res) {
            console.log(JSON.stringify(res.data));
        })

    };

    function dataURItoBlob(dataURI, imgType) {
        var isSemicolonExist = (dataURI.indexOf(',') >= 0) ? true : false;
        alert(isSemicolonExist);
        var binary = [];
        if (isSemicolonExist)
            binary = atob(dataURI.split(',')[1]);
        else
            binary = atob(dataURI);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        var blob = new Blob([new Uint8Array(array)], {
            type: imgType
        });
        return blob;
    };

}
