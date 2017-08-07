'use strict';

angular.module('bahmni.appointments')
    .controller('AppointmentsListViewController', ['$scope', 'spinner', 'appointmentsService', 'appService',
        function ($scope, spinner, appointmentsService, appService) {
            $scope.startDate = moment().startOf('day').toDate();
            $scope.enableServiceTypes = appService.getAppDescriptor().getConfigValue('enableServiceTypes');
            var init = function () {
                return $scope.getAppointmentsForDate($scope.startDate);
            };

            $scope.getAppointmentsForDate = function (viewDate) {
                var params = {
                    forDate: viewDate
                };
                var promise = appointmentsService.getAllAppointments(params).then(function (response) {
                    $scope.appointments = response.data;
                });
                spinner.forPromise(promise);
            };

            $scope.isAppointmentSelected = function () {
                return _.some($scope.appointments, {selected: true});
            };

            init();
        }]);
