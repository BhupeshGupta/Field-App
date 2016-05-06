angular.module('starter')

.factory('Persistence', function ($q) {
    //persistence.store.memory.config(persistence);

    persistence.store.cordovasql.config(
        persistence,
        'field_app_db',
        '0.0.1',
        'Database description',
        5 * 1024 * 1024,
        0
    );

    var entities = {};

    entities.Files = persistence.define('Files', {
        fileName: 'TEXT',
        enabled: 'TEXT',
        uploaded: 'INT',
        // File Directory & File Name
        fdir: 'TEXT',
        fname: 'TEXT',
        opts: 'TEXT'
    });

    entities.Customer = persistence.define('Customer', {
        name: 'STRING',
        enabled: 'INT',
        sale_enabled: 'INT',
        object: 'JSON'
    });

    entities.Address = persistence.define('Address', {
        customer: 'STRING',
        object: 'JSON'
    });

    entities.Contact = persistence.define('Contact', {
        customer: 'STRING',
        object: 'JSON'
    });

    persistence.debug = true;
    persistence.schemaSync();

    return {
        Entities: entities,

        add: function (entity) {
            persistence.add(entity);
            persistence.flush();
        },

        getAllFiles: function () {
            var defer = $q.defer();

            entities.Files.all().list(null, function (files) {
                defer.resolve(files);
            });

            return defer.promise;
        },

        search: function (query, collection, searchOn, limit) {
            //            limit = limit || 10;
            //            var queryLike = query.split(' ').join('%') + '%';
            //
            //            var sqlQuery = [
            //                'select * from ' + collection,
            //                'where name like "' + queryLike + '"',
            //                'order by case WHEN name like "' + query + '%" THEN 0 else 1 end',
            //                'limit ' + limit
            //            ].join('\n');
            //
            //            return $q(function (resolve, reject) {
            //                persistence.transaction(
            //                    function (txn) {
            //                        txn.executeSql(
            //                            sqlQuery, [],
            //                            function (x) {
            //                                console.log(x);
            //                                return resolve(x);
            //                            }
            //                        );
            //                    });
            //            });

            limit = limit || 10;
            return $q(function (resolve, reject) {
                var queryLike = query.split(' ').join('%') + '%';
                entities[collection].all().filter(searchOn, 'like', queryLike).limit(limit).list(function (rs) {
                    return resolve(rs);
                });
            });

        }
    };




});
