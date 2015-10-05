/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.models.Call', []);

    module.factory('Call', function () {
        var Call = function (callStr) {
            //console.log(JSON.stringify(callStr));
            this.bLeg = {};
            this.uuid = callStr[0];
            this.direction = callStr[2];
            this.created = callStr[4];
            this.createdEpoch = callStr[6];
            this.name = callStr[8];
            this.state = callStr[10];
            this.callerIdName = callStr[12];
            this.callerIdNumber = callStr[14];
            this.ipAddress = callStr[16];
            this.destination = callStr[18];
            this.application = callStr[20];
            this.applicationData = callStr[22];
            this.dialplan = callStr[24];
            this.context = callStr[26];
            this.readCodec = callStr[28];
            this.readRate = callStr[30];
            this.readBitrate = callStr[32];
            this.writeCodec = callStr[34];
            this.writeRate = callStr[36];
            this.writeBitrate = callStr[38];
            this.secure = callStr[40];
            this.hostname = callStr[42];
            this.presenceId = callStr[44];
            this.presenceData = callStr[46];
            this.callState = callStr[48];
            this.calleeName = callStr[50];
            this.calleeNumber = callStr[52];
            this.calleeDirection = callStr[54];
            this.callUuid = callStr[56];
            this.sentCalleeName = callStr[58];
            this.sentCalleNum = callStr[60];
            this.bLeg.uuid = callStr[62];
            this.bLeg.direction = callStr[64];
            this.bLeg.created = callStr[66];
            this.bLeg.createdEpoch = callStr[68];
            this.bLeg.name = callStr[70];
            this.bLeg.state = callStr[72];
            this.bLeg.cidName = callStr[74];
            this.bLeg.cidNumber = callStr[76];
            this.bLeg.ipAddress = callStr[78];
            this.bLeg.destination = callStr[80];
        };

        return Call;
    });
}());