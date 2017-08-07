'use strict';

describe('AppointmentsListViewController', function () {
    var controller, scope, spinner, appointmentsService, appService, appDescriptor;

    beforeEach(function () {
        module('bahmni.appointments');
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            controller = $controller;
            appointmentsService = jasmine.createSpyObj('appointmentsService', ['getAllAppointments']);
            appointmentsService.getAllAppointments.and.returnValue(specUtil.simplePromise({}));
            appService = jasmine.createSpyObj('appService', ['getAppDescriptor']);
            appDescriptor = jasmine.createSpyObj('appDescriptor', ['getConfigValue']);
            appService.getAppDescriptor.and.returnValue(appDescriptor);
            appDescriptor.getConfigValue.and.returnValue(true);
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
        controller('AppointmentsListViewController', {
            $scope: scope,
            spinner: spinner,
            appointmentsService: appointmentsService,
            appService: appService
        });
    };

    beforeEach(function () {
        createController();
    });

    it("should initialize today's date", function () {
        var today = moment().startOf('day').toDate();
        expect(scope.startDate).toEqual(today);
    });

    it("should initialize enable service types from config", function () {
        expect(scope.enableServiceTypes).toBeTruthy();
    });

    it('should get appointments for date', function () {
        var viewDate = new Date('1970-01-01T11:30:00.000Z');
        scope.getAppointmentsForDate(viewDate);
        expect(appointmentsService.getAllAppointments).toHaveBeenCalledWith({forDate: viewDate});
        expect(spinner.forPromise).toHaveBeenCalled();
    });

    it('should return false if no appointments are selected', function () {
        scope.appointments = [];
        var isSelected = scope.isAppointmentSelected();
        expect(isSelected).toBeFalsy();
    });

    it('should return true if any appointment is selected', function () {
        scope.appointments = [{uuid: 'appointment1', selected: true}];
        var isSelected = scope.isAppointmentSelected();
        expect(isSelected).toBeTruthy();
    });

    it('should return true if multiple appointments are selected', function () {
        scope.appointments = [{uuid: 'appointment1', selected: true}, {
            uuid: 'appointment2',
            selected: true
        }, {uuid: 'appointment3', selected: false}];
        var isSelected = scope.isAppointmentSelected();
        expect(isSelected).toBeTruthy();
    });
});
