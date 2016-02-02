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
        // Request Id
        parentId: 'TEXT',
        // File uploaded Flag
        uploaded: 'INT',
        // File Directory & File Name
        fdir: 'TEXT',
        fname: 'TEXT'
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
        }
    };
});
