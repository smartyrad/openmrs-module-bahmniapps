'use strict';

angular.module('bahmni.home')
    .controller('DashboardController', ['$rootScope', '$scope', '$state','$interval', 'appService', 'locationService', 'spinner', '$bahmniCookieStore', '$window', '$q', 'offlineService', 'scheduledSync','schedulerStatusDbService','WorkerService',
        function ($rootScope, $scope, $state, $interval, appService, locationService, spinner, $bahmniCookieStore, $window, $q, offlineService, scheduledSync, schedulerStatusDbService, WorkerService) {
            $scope.appExtensions = appService.getAppDescriptor().getExtensions($state.current.data.extensionPointId, "link") || [];
            $scope.selectedLocationUuid = {};
            $scope.isOfflineApp = offlineService.isOfflineApp();
            $scope.isSyncing = false;

            var getCurrentLocation = function () {
                return $bahmniCookieStore.get(Bahmni.Common.Constants.locationCookieName) ? $bahmniCookieStore.get(Bahmni.Common.Constants.locationCookieName) : null;
            };

            var init = function () {
                return locationService.getAllByTag("Login Location").then(function (response) {
                        $scope.locations = response.data.results;
                        $scope.selectedLocationUuid = getCurrentLocation().uuid;
                    }
                );
            };

            var getLocationFor = function (uuid) {
                return _.find($scope.locations, function (location) {
                    return location.uuid == uuid;
                })
            };

            $scope.isCurrentLocation = function (location) {
                return getCurrentLocation().uuid === location.uuid;
            };

            $scope.onLocationChange = function () {
                var selectedLocation = getLocationFor($scope.selectedLocationUuid);
                $bahmniCookieStore.remove(Bahmni.Common.Constants.locationCookieName);
                $bahmniCookieStore.put(Bahmni.Common.Constants.locationCookieName, {
                    name: selectedLocation.display,
                    uuid: selectedLocation.uuid
                }, {path: '/', expires: 7});
                $window.location.reload();
            };

            $scope.sync = function() {
                if(offlineService.isChromeApp()) {
                    if (Bahmni.Common.Offline && Bahmni.Common.Offline.BackgroundWorker) {
                        new Bahmni.Common.Offline.BackgroundWorker(WorkerService, offlineService, {delay: 1000, repeat: 1});
                    }
                }else if(offlineService.isAndroidApp()){
                    scheduledSync();
                }
            };

            if($scope.isOfflineApp){
                $interval(function () {
                    schedulerStatusDbService.getSchedulerStatus().onsuccess = function(event) {
                        var cursor = event.target.result;
                        $scope.isSyncing = cursor != null;
                        $scope.$apply();
                    };
                }, Bahmni.Common.Offline.SchedulerPollTime);
            }


            return spinner.forPromise($q.all(init()));
        }]);