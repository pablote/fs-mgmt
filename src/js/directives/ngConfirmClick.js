/*global angular, window */
(function () {
    'use strict';
    var module = angular.module('fsmgmt.directives.ngConfirmClick', []);

    module.directive('ngConfirmClick', [
        function () {
            return {
                link: function (scope, element, attr) {
                    var clickAction = attr.ngConfirmClick;
                    var msg = attr.confirmMsg || "Are you sure?";

                    element.bind('click', function (event) {
                        if (window.confirm(msg)) {
                            scope.$eval(clickAction);
                        }
                    });
                }
            };
        }]);
}());