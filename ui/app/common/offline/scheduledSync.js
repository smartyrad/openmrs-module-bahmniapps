angular.module("bahmni.common.offline")
    .service("scheduledSync", ['$q', 'scheduledJob', 'offlineConfigInitialization', function($q, scheduledJob, offlineConfigInitialization) {
            var job;
            var jobInit = function() {
                var worker = new Bahmni.Common.Offline.MultiStageWorker($q);
                worker.addStage({
                    execute: function() {
                        console.log("Executing Stage 1");
                        return offlineConfigInitialization();
                    }
                });
                worker.addStage({
                    execute: function() {
                        console.log("Executing Stage 2");
                        return $q.when({});
                    }
                });
                worker.addStage({
                    execute: function() {
                        console.log("Executing Stage 3");
                        return $q.when({});

                    }
                });

                job = scheduledJob.create({interval: 30000, worker: worker});
                job.start();
            };

            var isJobRunning = function () {
              return job;
            };

            return {
                jobInit : jobInit,
                isJobRunning: isJobRunning
            }
        }
    ]);
