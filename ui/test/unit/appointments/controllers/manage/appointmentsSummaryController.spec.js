'use strict'

describe ('appointmentsSummaryController', function () {
    var controller, scope, appointmentsService, spinner;

    beforeEach(function () {
        module('bahmni.appointments');
        inject(function ($controller, $rootScope, $q) {
            controller = $controller;
            scope = $rootScope.$new();
            appointmentsService = jasmine.createSpyObj('appointmentsService', ['getAllAppointments']);
            appointmentsService.getAppointmentsSummary.and.returnValue(specUtil.simplePromise({}));
            spinner = jasmine.createSpyObj('spinner', ['forPromise']);
            spinner.forPromise.and.callFake(function () {
                return {
                    then: function () {
                        return {};
                    }
                };
            });
        });
    });

    var createController = function () {
       controller('AppointmentsSummaryController', {
           $scope: scope
       });
    };

    it('should initialize the week to current week and date to todays date', function () {
        createController();
        expect(scope.weekStartDate).toEqual(new Date(moment().startOf('week')));
        expect(scope.weekEndDate).toEqual(new Date(moment().endOf('week').endOf('day')));
        expect(scope.currentDate).toEqual(new Date(moment().startOf('day').toDate()));
    });

    // it('should change week start and end date based on chosen date', function () {
    //     createController();
    //     scope.chosenDate = new Date(moment('2017-08-14').startOf('day'));
    //     expect(scope.weekStartDate).toEqual(new Date(moment('2017-08-14').startOf('week')));
    //     expect(scope.weekEndDate).toEqual(new Date(moment('2017-08-14').endOf('week').endOf('day')));
    // });

    it('should construct dates array based on chosenDate', function () {
        createController();
        expect(scope.weekDates[0]).toEqual(new Date(moment().startOf('week')));
        expect(scope.weekDates[1]).toEqual(Bahmni.Common.Util.DateUtil.addDays(scope.weekDates[0], 1));
        expect(scope.weekDates[2]).toEqual(Bahmni.Common.Util.DateUtil.addDays(scope.weekDates[0], 2));
        expect(scope.weekDates[3]).toEqual(Bahmni.Common.Util.DateUtil.addDays(scope.weekDates[0], 3));
        expect(scope.weekDates[4]).toEqual(Bahmni.Common.Util.DateUtil.addDays(scope.weekDates[0], 4));
        expect(scope.weekDates[5]).toEqual(Bahmni.Common.Util.DateUtil.addDays(scope.weekDates[0], 5));
        expect(scope.weekDates[6]).toEqual(Bahmni.Common.Util.DateUtil.addDays(scope.weekDates[0], 6));
    });

    it('should Get all the appointments summary for current week on initialization', function () {
        createController();
        expect(appointmentsService.getAppointmentsSummary).toHaveBeenCalledWith({startDate: new Date(moment().startOf('week')),
        endDate: new Date(moment().endOf('week').endOf('day'))});
        expect(spinner.forPromise).toHaveBeenCalled();
    })
});