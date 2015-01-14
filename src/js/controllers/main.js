/*globals angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.controllers.main', [
        'ui.router',
        'fsmgmt.controllers.conferences'
    ]);

    module.controller('MainController', ['$scope',
        function ($scope) {
        }
    ]);

    module.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/conferences");

        $stateProvider
            .state('conferences', { url: "/conferences", controller: 'ConferencesController', templateUrl: "conferences/main.html" })
    }]);
}());