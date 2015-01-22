/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.FreeswitchClient', [
        'fsmgmt.services.freeswitch.parsers.ListParser'
    ]);

    module.factory('FreeswitchClient', function ($q, $http, FreeswitchListParser) {
        var FreeswitchClient = function (server, username, password) {
            this.server = server;
            this.username = username;
            this.password = password;
            this.basicAuthHeader = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
        };

        FreeswitchClient.prototype.list = function() {
            var self = this;
            return $q(function (resolve, reject) {
                $http
                    .get('http://' + self.server + ':8080/webapi/conference?list', {
                        headers: { Authorization: self.basicAuthHeader }
                    })
                    .then(function (getResponse) {
                        var parser = new FreeswitchListParser();
                        return parser.parse(getResponse.data);
                    })
                    .then(function (parseResponse) {
                        resolve({
                            name: self.server,
                            conferences: parseResponse
                        });
                    })
                    .catch(function (listError) {
                        reject(listError);
                    })
            });
        };

        FreeswitchClient.prototype.hangup = function(conferenceName, memberId) {
            var self = this;
            var whattohup = memberId || 'all';
            return $q(function (resolve, reject) {
                $http
                    .get('http://' + self.server + ':8080/webapi/conference?' + conferenceName + ' hup ' + whattohup, {
                        headers: { Authorization: self.basicAuthHeader }
                    })
                    .then(function (hangupResponse) {
                        resolve(hangupResponse.data);
                    })
                    .catch(function (hangupError) {
                        reject(hangupError);
                    })
            });
        };

        FreeswitchClient.prototype.recordingCheck = function(conferenceName) {
            var self = this;
            return $q(function (resolve, reject) {
                $http
                    .get('http://' + self.server + ':8080/webapi/conference?' + conferenceName + ' recording check', {
                        headers: { Authorization: self.basicAuthHeader }
                    })
                    .then(function (recordingCheckResponse) {
                        resolve(recordingCheckResponse.data);
                    })
                    .catch(function (recordingCheckError) {
                        reject(recordingCheckError);
                    })
            });
        };

        return FreeswitchClient;
    });
}());