/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.models.Conference', []);

    module.factory('FreeswitchConference', function () {
        var FreeswitchConference = function (conferenceStr) {
            this.name= conferenceStr.substring(11, conferenceStr.indexOf(' ', 11)).s;
            this.members= [];
            this.flags = conferenceStr.substring(conferenceStr.indexOf('flags: ') + 7, conferenceStr.length - 1)
                .replaceAll('|', ', ').s;
            this.isRecording = this.flags.indexOf('recording') !== -1
        };

        return FreeswitchConference;
    });
}());