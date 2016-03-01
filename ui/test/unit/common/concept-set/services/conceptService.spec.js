'use strict';

ddescribe("conceptService", function () {
    var http, conceptService, $q;
    beforeEach(module('bahmni.common.conceptSet'));
    beforeEach(function () {
        http = jasmine.createSpyObj('$http', [''])
        module(function ($provide) {
            $provide.value('$http', http);
            $provide.value('$q', Q);
        });

        inject(['conceptService', function (_conceptService) {
            conceptService = _conceptService;
        }]);
    })

    it("should ", function (done) {
        var aConcept = {
            answers: {}
        }
        conceptService.getAnswers(aConcept).then(function (answers) {
            expect(answers).toEqual([]);
        }).catch(notifyError).finally(done);

    })
});