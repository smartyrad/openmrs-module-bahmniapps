'use strict';

angular.module('bahmni.registration')
    .controller('NavigationController', ['$scope', '$rootScope', '$location', 'sessionService', '$window', 'appService', '$sce','offlineService', 'scheduledSync',
        function ($scope, $rootScope, $location, sessionService, $window, appService, $sce, offlineService, scheduledSync) {
            $scope.extensions = appService.getAppDescriptor().getExtensions("org.bahmni.registration.navigation", "link");
            $scope.isOfflineApp = offlineService.isOfflineApp();
            $scope.goTo = function (url) {
                $location.url(url);
            };

            $scope.htmlLabel = function (label) {
                return $sce.trustAsHtml(label);
            };

            $scope.logout = function () {
                $rootScope.errorMessage = null;
                sessionService.destroy().then(
                    function () {
                        $window.location = "../home/";
                    }
                );
            };

            $scope.sync = function() {
                scheduledSync.jobInit();
            };

            $scope.$watch(function(){return }, function(newValue){
                if(!_.isNull(newValue)){
                    $scope.isSyncing = (newValue !== null);
                }
            }, true);
        }]);
