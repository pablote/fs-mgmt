/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.FreeswitchClient', [
        'fsmgmt.services.freeswitch.parsers.ListParser',
        'fsmgmt.services.freeswitch.models.Server'
    ]);

    module.factory('FreeswitchClient', function ($q, $http, FreeswitchListParser, FreeswitchServer) {
        var FreeswitchClient = function (server, username, password) {
            this.server = server;
            this.username = username;
            this.password = password;
            this.basicAuthHeader = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
        };

        function doGet(self, url) {
            return $q(function (resolve, reject) {
                $http
                    .get(url, {
                        headers: { Authorization: self.basicAuthHeader }
                    })
                    .then(function (getResponse) {
                        if (getResponse.status == 200) {
                            resolve(getResponse.data);
                        } else {
                            reject(getResponse);
                        }
                    })
                    .catch(function (getError) {
                        reject(getError);
                    })
            });
        }

        FreeswitchClient.prototype.list = function() {
            var self = this;
            return $q(function (resolve, reject) {
                doGet(self, 'http://' + self.server + ':8080/webapi/conference?list')
                    .then(function(listResponse) {
                        var parser = new FreeswitchListParser();
                        return parser.parse(listResponse);
                    })
                    .then(function (parseResponse) {
                        resolve(new FreeswitchServer({
                            name: self.server,
                            host: self.server,
                            username: self.username,
                            password: self.password,
                            conferences: parseResponse
                        }));
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            });
        };

        FreeswitchClient.prototype.hangup = function(conferenceName, memberId) {
            var whattohup = memberId || 'all';
            return doGet(this, 'http://' + this.server + ':8080/webapi/conference?' + conferenceName + ' hup ' + whattohup);
        };

        FreeswitchClient.prototype.recordingCheck = function(conferenceName) {
            return doGet(this, 'http://' + this.server + ':8080/webapi/conference?' + conferenceName + ' recording check');
        };

        return FreeswitchClient;
    });
}());