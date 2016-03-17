angular.module('starter')

.factory('UploadService', function ($q, Persistence, FileDataService) {
    return {
        upload: upload,
    };

    function uploadAndSetStatus(file) {
        FileDataService.uploadFileFromDisk({
                file: file.fname,
                dir: file.fdir
            },
            '', '',
            false,
            file.opts ? JSON.parse(file.opts) : {}
        ).then(function () {

        });
    }

    function upload() {
        Persistence.Entities.Files.all()
            //            .filter('uploaded', '=', 0)
            .list(function (files) {
                files.each(uploadAndSetStatus);
            });
    }

});
