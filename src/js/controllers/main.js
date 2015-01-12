/*globals angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.controllers.main', [
        'ui.router'
    ]);

    module.controller('MainController', ['$scope',
        function ($scope) {
            $scope.msg = "holaaa";
        }
    ]);

    /*
    module.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/history/default");

        $stateProvider
            .state('history', { url: "/history", controller: 'HistoryController', templateUrl: "history/main.html" })
            .state('history.default', { url: "/default", templateUrl: "history/default.html" })
            .state('history.commit', { url: "/commit/:hash", controller: 'HistoryCommitController', templateUrl: "history/commit.html" });
    }]);
    */
}());