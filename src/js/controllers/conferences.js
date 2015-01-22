/*globals angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.controllers.conferences', [
        'fsmgmt.services.LocalStorageService',
        'fsmgmt.services.freeswitch.FreeswitchRouter'
    ]);

    var consts = {
        StorageKeys: {
            FreeswitchServers: 'fsServers',
            FreeswitchUsername: 'fsUsername',
            FreeswitchPassword: 'fsPassword'
        }
    };

    module.controller('ConferencesController', ['$scope', 'localStorage', 'freeswitch',
        function ($scope, localStorage, freeswitch) {
            var gui = require('nw.gui');
            //TODO: for some reason the browser version of moment is not working, investigate further
            window.moment = require('moment');
            window.moment.fn.fromNowOrNow = function (a) {
                if (Math.abs(moment().diff(this)) < 3000) {
                    return 'just now';
                }
                return this.fromNow(a);
            };

            // default values
            localStorage.get(consts.StorageKeys.FreeswitchServers).then(function(value) {
                if (value) $scope.fsServers = value;
            });

            localStorage.get(consts.StorageKeys.FreeswitchUsername).then(function(value) {
                if (value) $scope.fsUsername = value;
            });

            localStorage.get(consts.StorageKeys.FreeswitchPassword).then(function(value) {
                if (value) $scope.fsPassword = value;
            });

            // methods
            $scope.refresh = function () {
                freeswitch
                    .list($scope.fsServers, $scope.fsUsername, $scope.fsPassword)
                    .then(function (fsListResponse) {
                        $scope.lastRefresh = moment();
                        $scope.lastRefreshString = $scope.lastRefresh.fromNowOrNow();
                        $scope.servers = fsListResponse;

                        //TODO: move to directive
                        setTimeout(function(){
                            $('[data-toggle="popover"]').popover();
                        }, 200);
                    })
                    .catch(function (error) {
                        var msg = 'A problem occurred accesing the Freeswitch servers.';

                        $scope.messageDialogTitle = 'Error';
                        $scope.messageDialogText = msg;
                        $scope.messageDialogDetails = error;
                        $('#dlgMessage').modal();
                    })
            };

            $scope.hangup = function (server, conferenceName, memberId) {
                freeswitch
                    .hangup(server, $scope.fsUsername, $scope.fsPassword, conferenceName, memberId)
                    .then(function (hangupResponse) {
                        var msg = 'Done';

                        $scope.messageDialogTitle = 'Hangup';
                        $scope.messageDialogText = msg;
                        $scope.messageDialogDetails = hangupResponse;
                        $('#dlgMessage').modal();
                    })
                    .then(function () {
                        $scope.refresh();
                    })
                    .catch(function (error) {
                        var msg = 'A problem occurred during hangup.';

                        $scope.messageDialogTitle = 'Error';
                        $scope.messageDialogText = msg;
                        $scope.messageDialogDetails = error;
                        $('#dlgMessage').modal();
                    });
            };

            $scope.copyToClipboard = function (text) {
                var clipboard = gui.Clipboard.get();
                clipboard.set(text, 'text');
            };

            $scope.showRecordingStatus = function (server, conference) {
                freeswitch
                    .recordingCheck(server.name, $scope.fsUsername, $scope.fsPassword, conference.name)
                    .then(function (recordingCheckResponse) {
                        $scope.messageDialogTitle = 'Recording status';
                        $scope.messageDialogText = recordingCheckResponse;
                        $('#dlgMessage').modal();
                    })
                    .catch(function (error) {
                        var msg = 'A problem occurred during recording check.';

                        $scope.messageDialogTitle = 'Error';
                        $scope.messageDialogText = msg;
                        $scope.messageDialogDetails = error;
                        $('#dlgMessage').modal();
                    });
            };

            //TODO: move this to a directive
            setInterval(function() {
                $scope.$apply(function() {
                    if ($scope.lastRefresh) $scope.lastRefreshString = $scope.lastRefresh.fromNowOrNow();
                });
            }, 3000);

            //TODO: move this to a directive
            $('#dlgMessage').on('hidden.bs.modal', function () {
                $scope.$apply(function() {
                    $scope.messageDialogTitle = '';
                    $scope.messageDialogText = '';
                    $scope.messageDialogDetails = '';
                })
            });

            // watches
            $scope.$watch("fsServers", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchServers, newValue);
            });

            $scope.$watch("fsUsername", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchUsername, newValue);
            });

            $scope.$watch("fsPassword", function (newValue, oldValue) {
                localStorage.set(consts.StorageKeys.FreeswitchPassword, newValue);
            })
        }
    ]);
}());