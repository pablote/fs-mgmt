/*globals angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.controllers.conferences', [
        'fsmgmt.services.LocalStorageService',
        'fsmgmt.services.freeswitch.FreeswitchRouter',
        'fsmgmt.directives.ngConfirmClick',
        'fsmgmt.directives.ngMomentAgo',
        'fsmgmt.directives.ngModalClose',
        'fsmgmt.directives.ngPopover'
    ]);

    var consts = {
        StorageKeys: {
            FreeswitchServers: 'settings-servers',
            FreeswitchUsername: 'settings-username',
            FreeswitchPassword: 'settings-password'
        }
    };

    module.controller('ConferencesController', ['$scope', 'localStorage', 'freeswitch',
        function ($scope, localStorage, freeswitch) {
            var gui = require('nw.gui');
            window.moment = require('moment');
            window.moment.fn.fromNowOrNow = function (a) {
                if (Math.abs(moment().diff(this)) < 3000) {
                    return 'just now';
                }
                return this.fromNow(a);
            };

            // default values
            $scope.isSettingsVisible = true;
            $scope.settings = {};

            localStorage.get(consts.StorageKeys.FreeswitchServers).then(function(value) {
                if (value) $scope.settings.servers = value;
            });

            localStorage.get(consts.StorageKeys.FreeswitchUsername).then(function(value) {
                if (value) $scope.settings.username = value;
            });

            localStorage.get(consts.StorageKeys.FreeswitchPassword).then(function(value) {
                if (value) $scope.settings.password = value;
            });

            // methods
            $scope.refresh = function () {
                freeswitch
                    .list($scope.settings.servers, $scope.settings.username, $scope.settings.password)
                    .then(function (fsListResponse) {
                        $scope.lastRefresh = moment();
                        $scope.servers = fsListResponse;
                    })
                    .catch(function (error) {
                        var msg = 'A problem occurred accesing the Freeswitch servers.';
                        $scope.showModal({
                            title: 'Error',
                            text: msg,
                            details: error
                        });
                    })
            };

            $scope.hangup = function (server, conference, member) {
                freeswitch
                    .hangup(server, conference, member)
                    .then(function (hangupResponse) {
                        var msg = 'Done';
                        $scope.showModal({
                            title: 'Hangup',
                            text: msg,
                            details: hangupResponse}
                        );
                    })
                    .then(function () {
                        $scope.refresh();
                    })
                    .catch(function (error) {
                        var msg = 'A problem occurred during hangup.';

                        $scope.showModal({
                            title: 'Error',
                            text: msg,
                            details: error
                        });
                    });
            };

            $scope.copyToClipboard = function (text) {
                var clipboard = gui.Clipboard.get();
                clipboard.set(text, 'text');
            };

            $scope.showRecordingStatus = function (server, conference) {
                freeswitch
                    .recordingCheck(server, conference)
                    .then(function (recordingCheckResponse) {
                        $scope.showModal({
                            title: 'Recording status',
                            preText: recordingCheckResponse
                        });
                    })
                    .catch(function (error) {
                        var msg = 'A problem occurred during recording check.';

                        $scope.showModal({
                            title: 'Error',
                            text: msg,
                            details: error
                        });
                    });
            };

            $scope.toggleSettings = function () {
                $scope.isSettingsVisible = !$scope.isSettingsVisible;
            };

            $scope.onModalClose = function () {
                $scope.messageDialog = {};
            };

            // watches
            $scope.$watch("settings.servers", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchServers, newValue);
            });

            $scope.$watch("settings.username", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchUsername, newValue);
            });

            $scope.$watch("settings.password", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchPassword, newValue);
            })
        }
    ]);
}());