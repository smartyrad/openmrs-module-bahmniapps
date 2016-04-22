'use strict';

angular.module("bahmni.common.offline")
    .service("scheduledJob", ['$q', '$interval', function($q, $interval) {
        this.create = function(config) {
            return new Job(config.worker, config.delay, config.count);
        };

        var Job = function(worker, delay, count) {
            var jobPromise = null;

            this.start = function() {
                jobPromise = $interval(worker.execute, delay, count);
            };

            this.stop = function() {
                if(jobPromise != null) {
                    $interval.cancel(jobPromise);
                }
            };

            this.pause = function() {
                worker.pause();
                this.stop();
            };
        }
    }]);