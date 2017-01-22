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
            this.accountCode = callStr[48];
            this.callState = callStr[50];
            this.calleeName = callStr[52];
            this.calleeNumber = callStr[54];
            this.calleeDirection = callStr[56];
            this.callUuid = callStr[58];
            this.sentCalleeName = callStr[60];
            this.sentCalleNum = callStr[62];
            this.bLeg.uuid = callStr[64];
            this.bLeg.direction = callStr[66];
            this.bLeg.created = callStr[68];
            this.bLeg.createdEpoch = callStr[70];
            this.bLeg.name = callStr[72];
            this.bLeg.state = callStr[74];
            this.bLeg.cidName = callStr[76];
            this.bLeg.cidNumber = callStr[78];
            this.bLeg.ipAddress = callStr[80];
            this.bLeg.destination = callStr[82];
        };

        return Call;
    });
}());