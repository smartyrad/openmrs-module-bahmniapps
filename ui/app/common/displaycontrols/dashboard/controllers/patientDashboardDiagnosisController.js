'use strict';

angular.module('bahmni.common.displaycontrol.dashboard')
    .controller('PatientDashboardDiagnosisController', ['$scope', 'ngDialog', '$stateParams',
        function ($scope, ngDialog, $stateParams) {
            $scope.section =  $scope.dashboard.getSectionByName("diagnosis") || {};
            $scope.section.dateEnrolled = $stateParams.dateEnrolled;
            $scope.section.dateCompleted = $stateParams.dateCompleted;
            $scope.openSummaryDialog = function () {
                ngDialog.open({
                    template: '../common/displaycontrols/dashboard/views/sections/diagnosisSummary.html',
                    className: "ngdialog-theme-default ng-dialog-all-details-page",
                    scope: $scope
                });
            };
            $scope.$on('ngDialog.closing', function (e, $dialog) {
                $("body").removeClass('ngdialog-open');
            });

        }]);