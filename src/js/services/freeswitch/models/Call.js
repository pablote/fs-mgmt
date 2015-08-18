/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.models.Call', []);

    module.factory('Call', function () {
        var Call = function (callStr) {
            this.data = callStr;
        };

        return Call;
    });
}());