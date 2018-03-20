angular.module('starter')

.factory('GrQueueService', grQueueService);


function grQueueService($rootScope, $q, Persistence, DocumentService) {
    return {
        upload: upload,
        count: getNumberOfPendingFilesCount,
        enqueue: enqueue
    };

    function enqueue(gr) {
        var dbGR = new Persistence.Entities.GoodsReceiptQueue({
            serial: gr.goods_receipt_number,
            object: gr
        });
        $rootScope.$broadcast('GrQueueService:update');
        return Persistence.add(dbGR);
    }

    function uploadAndSetStatus(gr) {
        var obj = JSON.parse(gr.object);
        return DocumentService.create('Goods Receipt', obj, false)
            .then(function () {
                gr.uploaded = 1;
                persistence.flush();
                $rootScope.$broadcast('GrQueueService:update');
            });
    }

    function upload() {
        Persistence.Entities.GoodsReceiptQueue.all()
            .filter('uploaded', '=', 0)
            .list(function (grs) {
                angular.forEach(grs, function (gr, index) {
                    uploadAndSetStatus(gr);
                });
            });
    }

    function getNumberOfPendingFilesCount() {
        return $q(function (resolve, reject) {
            Persistence.GoodsReceiptQueue.Files.all()
                .filter('uploaded', '=', 0)
                .count(function (count) {
                    resolve(count);
                });
        });
    }

}
