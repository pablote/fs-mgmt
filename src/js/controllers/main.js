/*globals angular, console */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.controllers.main', [
        'ui.router',
        'fsmgmt.controllers.conferences',
        'fsmgmt.directives.ngModalClose'
    ]);

    module.controller('MainController', ['$scope',
        function ($scope) {
            $scope.messageDialog = {};

            $scope.showModal = function(options) {
                $scope.messageDialog.title = options.title || '';
                $scope.messageDialog.text = options.text || null;
                $scope.messageDialog.details = options.details || null;
                $scope.messageDialog.preText = options.preText || null;

                $('#dlgMessage').modal();
            };

            $scope.onModalClose = function () {
                $scope.messageDialog = {};
            };
        }
    ]);

    module.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/conferences");

        $stateProvider
            .state('conferences', { url: "/conferences", controller: 'ConferencesController', templateUrl: "conferences/main.html" })
    }]);
}());