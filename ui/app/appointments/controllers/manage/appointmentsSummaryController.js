'use strict';

angular.module('bahmni.appointments')
    .controller('AppointmentsSummaryController', ['$scope', 'spinner', 'appointmentsService',
    function ($scope, spinner, appointmentsService) {
    $scope.getAppointmentsSummaryForAWeek = function () {
        var params = {
            startDate: $scope.weekStartDate.toDate(),
            endDate: $scope.weekEndDate.toDate()
        };
        spinner.forPromise(appointmentsService.getAppointmentsSummary(params).then(function (response) {
            $scope.appointments = response.data;
        }));
    };

    var init = function () {
        $scope.currentDate = moment().startOf('day').toDate();
        $scope.chosenDate = $scope.currentDate;
        $scope.weekStartDate = moment().startOf('week');
        $scope.weekEndDate = moment().endOf('week').endOf('day');
        $scope.weekDates = [];
        var i = $scope.weekStartDate.toDate();
        for(; Bahmni.Common.Util.DateUtil.isBeforeDate(i, $scope.weekEndDate);
            i = Bahmni.Common.Util.DateUtil.addDays(i, 1)) {
            $scope.weekDates.push(moment(i).format("DD MMM ddd"));
        }
        $scope.getAppointmentsSummaryForAWeek();
    };

    return init();
}]);
