/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.models.Member', []);

    module.factory('FreeswitchMember', function () {
        var FreeswitchMember = function (memberStr) {
            var memberAttributes = memberStr.split(';');

            this.id= memberAttributes[0];
            this.participantRegister= memberAttributes[1];
            this.channelId= memberAttributes[2];
            this.callerIdName= memberAttributes[3];
            this.callerIdNumber= memberAttributes[4];
            this.entitlements= memberAttributes[5];
            this.isInternalCall= (memberAttributes[1].indexOf("sofia/internal/conf_") > -1 ||
                memberAttributes[1].indexOf("sofia/internal/00000") > -1) || memberAttributes[1].indexOf("loopback") > -1
        };

        return FreeswitchMember;
    });
}());