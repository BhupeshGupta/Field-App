'use strict';

angular.module('starter')
    .controller('HistoryController', historyController);

function historyController($localStorage) {
    var vm = this;
    vm.user_input = $localStorage.lastGR;
}
