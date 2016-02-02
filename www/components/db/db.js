'use strict';

angular.module('starter')
    .controller('DbController', dbController);

function dbController(Persistence) {
    var vm = this;
    vm.files = [];

    Persistence.getAllFiles().then(function (files) {
        alert('Files Lenght: ' + files.length);
        vm.files = files;
    }).catch(function (error) {
        console.log(error);
    });

}
