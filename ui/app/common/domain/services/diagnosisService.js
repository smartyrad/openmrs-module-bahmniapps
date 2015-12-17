'use strict';

angular.module('bahmni.common.domain')
    .service('diagnosisService', ['$http','$rootScope', function ($http, $rootScope) {
        var self = this;
        this.getAllFor = function (searchTerm) {
            var url = Bahmni.Common.Constants.emrapiConceptUrl;
            return $http.get(url, {
                params: {term: searchTerm, limit: 20}
            });
        };

        this.getDiagnosis = function (patientUuid, visitUuid, startDate, endDate) {
            var url = Bahmni.Common.Constants.bahmniDiagnosisUrl;
            var params = { patientUuid: patientUuid , visitUuid: visitUuid};
            params.startDate = startDate && moment(startDate).format();
            params.endDate = endDate && moment(endDate).format();
            return $http.post(url, params, {
                withCredentials: true,
                headers: {"Accept": "application/json", "Content-Type": "application/json"}
            });
        };

        this.deleteDiagnosis = function(obsUuid){
            var url = Bahmni.Common.Constants.bahmniDeleteDiagnosisUrl;
            return $http.get(url, {
                params : {obsUuid : obsUuid}
            });
        };

        this.getDiagnosisConceptSet = function(){
            return $http.get(Bahmni.Common.Constants.conceptUrl, {
                method: "GET",
                params: {
                    v: 'custom:(uuid,name,setMembers)',
                    code: Bahmni.Common.Constants.diagnosisConceptSet,
                    source: Bahmni.Common.Constants.emrapiConceptMappingSource
                },
                withCredentials: true
            });
        };

        this.getPastAndCurrentDiagnoses = function (patientUuid, encounterUuid) {
            return self.getDiagnosis(patientUuid).then(function (response) {
                var diagnosisMapper = new Bahmni.DiagnosisMapper($rootScope.diagnosisStatus);
                var allDiagnoses = diagnosisMapper.mapDiagnoses(response.data);
                var pastDiagnoses = diagnosisMapper.mapPastDiagnosis(allDiagnoses, encounterUuid);
                var savedDiagnosesFromCurrentEncounter = diagnosisMapper.mapSavedDiagnosesFromCurrentEncounter(allDiagnoses, encounterUuid);
                return {
                    "pastDiagnoses": pastDiagnoses,
                    "savedDiagnosesFromCurrentEncounter": savedDiagnosesFromCurrentEncounter
                }
            });
        };

        this.populateDiagnosisInformation = function(patientUuid, consultation) {
            return this.getPastAndCurrentDiagnoses(patientUuid, consultation.encounterUuid).then(function (diagnosis) {
                consultation.pastDiagnoses = diagnosis.pastDiagnoses;
                consultation.savedDiagnosesFromCurrentEncounter = diagnosis.savedDiagnosesFromCurrentEncounter;
                return consultation;
            })
        }

    }]);