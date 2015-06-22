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
            // default values
            $scope.servers = [];
            $scope.autoRefresh = null; // interval object
            $scope.lastRefresh = null; // moment obj with datetime of last refresh

            $scope.refresh = function () {
                //TODO
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