/*global angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.services.freeswitch.FreeswitchClient', [
        'fsmgmt.services.freeswitch.parsers.ConferenceListParser',
        'fsmgmt.services.freeswitch.parsers.CallListParser',
        'fsmgmt.services.freeswitch.models.Server'
    ]);

    module.factory('FreeswitchClient', ['$q', '$http', 'ConferenceListParser', 'CallListParser', 'FreeswitchServer',
        function ($q, $http, ConferenceListParser, CallListParser, FreeswitchServer) {
            var FreeswitchClient = function (server) {
                this.host = server.host;
                this.username = server.username;
                this.password = server.password;
                this.name = server.name;
                this.basicAuthHeader = 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64');
                this.requestTimeout = 1500;
            };

            function doGet(self, url) {
                return $q(function (resolve, reject) {
                    $http
                        .get(url, {
                            headers: { Authorization: self.basicAuthHeader },
                            timeout: self.requestTimeout
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

            FreeswitchClient.prototype.listConferences = function() {
                var self = this;
                return $q(function (resolve, reject) {
                    doGet(self, 'http://' + self.host + ':8080/webapi/conference?list')
                        .then(function(listResponse) {
                            var parser = new ConferenceListParser();
                            return parser.parse(listResponse);
                        })
                        .then(function (parseResponse) {
                            resolve(new FreeswitchServer({
                                name: self.name,
                                host: self.host,
                                username: self.username,
                                password: self.password,
                                conferences: parseResponse
                            }));
                        })
                        .catch(function (error) {
                            error.server = {
                                name: self.name,
                                host: self.host
                            };
                            reject(error);
                        });
                });
            };

            FreeswitchClient.prototype.listCalls = function() {
                var self = this;
                return $q(function (resolve, reject) {
                    doGet(self, 'http://' + self.host + ':8080/webapi/show?detailed_calls')
                        .then(function(listResponse) {
                            var parser = new CallListParser();
                            return parser.parse(listResponse);
                        })
                        .then(function (parseResponse) {
                            resolve(new FreeswitchServer({
                                name: self.name,
                                host: self.host,
                                username: self.username,
                                password: self.password,
                                calls: parseResponse
                            }));
                        })
                        .catch(function (error) {
                            error.server = {
                                name: self.name,
                                host: self.host
                            };
                            reject(error);
                        });
                });
            };

            FreeswitchClient.prototype.hangup = function(conferenceName, memberId) {
                var whattohup = memberId || 'all';
                return doGet(this, 'http://' + this.host + ':8080/webapi/conference?' + conferenceName + ' hup ' + whattohup);
            };

            FreeswitchClient.prototype.recordingCheck = function(conferenceName) {
                return doGet(this, 'http://' + this.host + ':8080/webapi/conference?' + conferenceName + ' recording check');
            };

            return FreeswitchClient;
        }
    ]);
}());