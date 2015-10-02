/*globals angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.controllers.calls', [
        'fsmgmt.services.GrowlService',
        'fsmgmt.services.freeswitch.FreeswitchRouter',
        'fsmgmt.directives.ngConfirmClick',
        'fsmgmt.directives.ngPopover',
        'fsmgmt.directives.ngMomentAgo'
    ]);

    module.controller('CallsController', ['$scope', '$interval', 'growl', 'freeswitch',
        function ($scope, $interval, growl, freeswitch) {
            var gui = require('nw.gui');
            var u = require('underscore');

            // default values
            $scope.servers = [];
            $scope.selectedCall = null;
            $scope.autoRefresh = null; // interval object
            $scope.lastRefresh = null; // moment obj with datetime of last refresh

            // events
            $scope.$on("$destroy", function() {
                if ($scope.autoRefresh) {
                    $scope.toggleAutoRefresh();
                }
            });

            // methods
            $scope.refresh = function () {
                var servers = [];

                u.each($scope.settings.serverList, function (server) {
                    if (server.enabled) {
                        servers.push({
                            name: server.name,
                            host: server.host,
                            username: $scope.settings.username,
                            password: $scope.settings.password
                        });
                    }
                });

                freeswitch
                    .listCalls(servers)
                    .then(function (fsListCallsResponse) {
                        $scope.lastRefresh = moment();
                        $scope.servers = fsListCallsResponse;
                    })
                    .catch(function (error) {
                        var msg = 'A problem occurred accessing the Freeswitch servers.';
                        $scope.showModal({ title: 'Error', text: msg, details: error });
                    })
            };

            $scope.selectCall = function (call) {
                $scope.selectedCall = call;

                $('#modalCallDetails').modal();
            };

            $scope.copyToClipboard = function (text) {
                var clipboard = gui.Clipboard.get();
                clipboard.set(text, 'text');

                growl.info(text, 'Copied to Clipboard');
            };

            $scope.toggleAutoRefresh = function () {
                if (!$scope.autoRefresh) {
                    $scope.enableSettings(false);
                    $scope.lastRefresh = null;
                    $scope.autoRefresh = $interval(function() {
                        $scope.refresh();
                    }, $scope.settings.autoRefreshInterval * 1000);
                } else {
                    $scope.enableSettings(true);
                    $interval.cancel($scope.autoRefresh);
                    delete $scope.autoRefresh;
                }
            };
        }
    ]);
}());