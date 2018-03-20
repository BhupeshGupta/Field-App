angular.module('starter')

.factory('UploadService', function ($rootScope, $q, Persistence, FileDataService) {
    return {
        upload: upload,
        count: getNumberOfPendingFilesCount,
        enqueue: enqueue
    };

    function enqueue(file) {
        var dbFile = new Persistence.Entities.Files(file);
        Persistence.add(dbFile);
        $rootScope.$broadcast('uploadService:update');
    }

    function uploadAndSetStatus(file) {
        FileDataService.uploadFileFromDisk({
                    file: file.fname,
                    dir: file.fdir
                },
                '', '',
                false,
                file.opts ? JSON.parse(file.opts) : {}
            )
            .then(function () {
                file.uploaded = 1;
                persistence.flush();
                $rootScope.$broadcast('uploadService:update');
            });
    }

    function upload() {
        Persistence.Entities.Files.all()
            .filter('uploaded', '=', 0)
            .list(function (files) {
                angular.forEach(files, function (file, index) {
                    uploadAndSetStatus(file);
                });
            });
    }

    function getNumberOfPendingFilesCount() {
        return $q(function (resolve, reject) {
            Persistence.Entities.Files.all()
                .filter('uploaded', '=', 0)
                .count(function (count) {
                    resolve(count);
                });
        });


    }


});
