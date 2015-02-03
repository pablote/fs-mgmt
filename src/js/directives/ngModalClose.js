/*global angular, window */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.directives.ngModalClose', []);

    module.directive('ngModalClose', [
        function () {
            return {
                link: function (scope, element, attr) {
                    var closeAction = attr.ngModalClose;

                    element.bind('hidden.bs.modal', function (event) {
                        scope.$eval(closeAction);
                    });
                }
            };
        }]);
}());