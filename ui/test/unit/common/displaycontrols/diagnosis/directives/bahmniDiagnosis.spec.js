'use strict';

describe('Diagnosis DisplayControl', function () {
    var rootScope, scope, compiledElementScope, q, _diagnosisService, _appService, _appConfig, _stateParams,
        compile, diagnosis,
        mockBackend,
        element,
        directiveHtml = '<bahmni-diagnosis patient-uuid="patient.uuid" config="section" show-ruled-out-diagnoses="false"></bahmni-diagnosis>';

    beforeEach(module('bahmni.common.domain'));
    beforeEach(module('bahmni.common.uiHelper'));
    beforeEach(module('bahmni.common.displaycontrol.diagnosis'));

    beforeEach(module( function ($provide) {
        var _spinner = jasmine.createSpyObj('spinner', ['forPromise', 'then']);
        _spinner.forPromise.and.callFake(function () {
            var deferred = q.defer();
            deferred.resolve({data: {}});
            return deferred.promise;
        });

        _spinner.then.and.callThrough({data: {}});
        $provide.value('spinner', _spinner);

        _appService = jasmine.createSpyObj('appService', ['getAppDescriptor']);
        _appConfig = jasmine.createSpyObj('appConfig', ['getConfigValue']);

        _appService.getAppDescriptor.and.returnValue(_appConfig);

        _diagnosisService = jasmine.createSpyObj('diagnosisService', ['getDiagnosis']);
        var getDiagnosesPromise = specUtil.createServicePromise('getDiagnosis');
        getDiagnosesPromise.success = function (successFn) {
            successFn([{
                    "order": "SECONDARY",
                    "certainty": "PRESUMED",
                    "diagnosisDateTime": "2015-10-08T11:33:24.000+0530",
                    "diagnosisStatusConcept": {
                        "uuid": "823051c4-3f10-11e4-adec-0800271c1b75",
                        "name": "Ruled Out Diagnosis",
                        "dataType": null,
                        "shortName": null,
                        "conceptClass": null,
                        "set": false,
                        "mappings": []
                    },
                    "latestDiagnosis": null,
                    "encounterUuid": "b6818776-f3d1-4a01-8f26-87ab9b3b211f"
                }]);
            return getDiagnosesPromise;

        };
        _diagnosisService.getDiagnosis.and.returnValue(getDiagnosesPromise);

        _stateParams = {
            dateEnrolled: "startDate",
            dateCompleted: "endDate"
        };
        $provide.value('diagnosisService', _diagnosisService);
        $provide.value('appService', _appService);
        $provide.value('$stateParams', _stateParams);
    }));


    beforeEach(inject(function ($compile, $httpBackend, $rootScope, $q) {
        compile = $compile;
        mockBackend = $httpBackend;
        rootScope = $rootScope;
        q = $q;
    }));

    function init() {
        rootScope.diagnosisStatus = 'RULED OUT';
        scope = rootScope.$new();
        mockBackend.expectGET('../common/displaycontrols/diagnosis/views/diagnosisDisplayControl.html').respond("<div>dummy</div>");
        scope.section = {
            title: "Diagnosis"
        };
        element = compile(directiveHtml)(scope);
        scope.$digest();
        mockBackend.flush();

        compiledElementScope = element.isolateScope();
        scope.$digest();

        diagnosis = {
            showLatestDetails: false,
            showDetails: false,
            providers: [{name: "Super Woman"}]
        };
    }

    it('should check diagnosis date toggle', function () {
        _appConfig.getConfigValue.and.returnValue({showDashBoardWithinDateRange: false});
        init();
        compiledElementScope.toggle(diagnosis, true);

        expect(diagnosis.showLatestDetails).toBeTruthy();
        expect(diagnosis.showDetails).toBeFalsy();

        compiledElementScope.toggle(diagnosis, false)

        expect(diagnosis.showLatestDetails).toBeFalsy();
        expect(diagnosis.showDetails).toBeTruthy();
    });

    it('should filter all ruled out diagnoses when showRuledOutDiagnoses flag is false', function () {
        _appConfig.getConfigValue.and.returnValue({showDashBoardWithinDateRange: false});
        init();
        expect(compiledElementScope.allDiagnoses.length).toBe(0);
    });

    it('should filter all ruled out diagnoses when showRuledOutDiagnoses flag is true', function () {
        _appConfig.getConfigValue.and.returnValue({showDashBoardWithinDateRange: false});
        directiveHtml = '<bahmni-diagnosis patient-uuid="patient.uuid" config="section" show-ruled-out-diagnoses="undefined"></bahmni-diagnosis>';

        init();
        expect(compiledElementScope.allDiagnoses.length).toBe(1);
    });

    it('should get diagnosis within the date range when config is enabled', function(){
        _appConfig.getConfigValue.and.returnValue({showDashBoardWithinDateRange: true});
        directiveHtml = '<bahmni-diagnosis patient-uuid="\'patientUuid\'" config="section" show-ruled-out-diagnoses="undefined"></bahmni-diagnosis>';
        init();
        expect(_diagnosisService.getDiagnosis).toHaveBeenCalledWith("patientUuid", undefined, _stateParams.dateEnrolled, _stateParams.dateCompleted);
    });

    it('should get all diagnosis when config is disabled', function(){
        _appConfig.getConfigValue.and.returnValue({showDashBoardWithinDateRange: false});
        directiveHtml = '<bahmni-diagnosis patient-uuid="\'patientUuid\'" config="section" show-ruled-out-diagnoses="undefined"></bahmni-diagnosis>';
        init();
        expect(_diagnosisService.getDiagnosis).toHaveBeenCalledWith("patientUuid", undefined, null, null);
    });

});