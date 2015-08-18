/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.models.Call', []);

    module.factory('Call', function () {
        var Call = function (callStr) {
            this.uuid = callStr[0];
            this.direction = callStr[2];
            this.created = callStr[4];
            this.name = callStr[8];
            this.state = callStr[10];
            this.callerIdName = callStr[12];
            this.callerIdNumber = callStr[14];
            this.ipAddress = callStr[16];
            this.destination = callStr[18];
        };

        return Call;
    });
}());