'use strict';

angular.module('bahmni.common.domain')
    .service('offlineEncounterServiceStrategy', ['$q', '$rootScope', '$bahmniCookieStore', 'offlineDbService',
        function ($q, $rootScope, $bahmniCookieStore, offlineDbService) {

            this.buildEncounter = function (encounter) {
                encounter.observations = encounter.observations || [];
                encounter.observations.forEach(function (obs) {
                    stripExtraConceptInfo(obs);
                });

                encounter.providers = encounter.providers || [];

                var providerData = $bahmniCookieStore.get(Bahmni.Common.Constants.grantProviderAccessDataCookieName);
                if (_.isEmpty(encounter.providers)) {
                    if (providerData && providerData.uuid) {
                        encounter.providers.push({"uuid": providerData.uuid});
                    } else if ($rootScope.currentProvider && $rootScope.currentProvider.uuid) {
                        encounter.providers.push({"uuid": $rootScope.currentProvider.uuid});
                    }
                }
                return encounter;
            };

            this.getDefaultEncounterType = function () {
                var deferrable = $q.defer();
                return offlineDbService.getReferenceData("DefaultEncounterType").then(function (defaultEncounterType) {
                    deferrable.resolve(defaultEncounterType);
                });
                return deferrable.promise;
            };

            this.getEncounterTypeBasedOnLoginLocation = function () {
                var deferrable = $q.defer();
                offlineDbService.getReferenceData("LoginLocationToEncounterTypeMapping").then(function (results) {
                    var mappings = results.data.results[0].mappings;
                    deferrable.resolve({"data": mappings});
                });
                return deferrable.promise;
            };

            this.getEncounterTypeBasedOnProgramUuid = function (programUuid) {
                return $q.when();
            };

            this.create = function (encounterData) {
                return offlineDbService.createEncounter(encounterData);
            };

            this.delete = function (encounterUuid, reason) {
                return $q.when({"data": {"results": []}})
            };

            var stripExtraConceptInfo = function(obs) {
                obs.concept = {uuid: obs.concept.uuid, name: obs.concept.name, dataType: obs.concept.dataType };
                obs.groupMembers = obs.groupMembers || [];
                obs.groupMembers.forEach(function(groupMember) {
                    stripExtraConceptInfo(groupMember);
                });
            };

            this.search = function (visitUuid, encounterDate) {
                return $q.when({"data": {"results": []}})
            };

            this.find = function (params) {
                return offlineDbService.getActiveEncounter(params.patientUuid);
            };
        }]);
