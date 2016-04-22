'use strict';

angular.module("bahmni.common.offline")
    .service("scheduledSync", ['$q', 'scheduledJob', 'offlineService', 'offlineDbService', 'androidDbService', 'offlinePush', 'offlinePull',
        function($q, scheduledJob, offlineService, offlineDbService, androidDbService, offlinePush, offlinePull) {
            return function(scheduledSyncConfig){

                if(offlineService.isAndroidApp()){
                    offlineDbService = androidDbService;
                }
                var multiStageWorker = new Bahmni.Common.Offline.MultiStageWorker($q),
                db;

                if (scheduledSyncConfig === undefined) {
                    scheduledSyncConfig = {delay: offlineService.getItem('schedulerInterval'), repeat: 0};
                }

                multiStageWorker.addStage({
                    execute: function() {
                        console.log("In stage 1");
                        if(db){
                            return db.close();
                        }
                        return;
                    }
                });
                multiStageWorker.addStage({
                    execute: function () {
                        console.log("In stage 2");
                        if(offlineService.isChromeApp()) {
                            return offlineDbService.reinitSchema().then(function (_db) {
                                db = _db;
                                return offlineDbService.init(_db);

                            }).catch(function(e){
                               console.log("Problem initializing the DB. "+e)
                            });
                        }
                    }
                });
                multiStageWorker.addStage({
                    execute: function() {
                        console.log("In stage 3");
                        offlineDbService.insertSchedulerStage("stage3");
                        return offlinePush().then(function () {
                            offlineDbService.clearSchedulerStage("stage3");
                        });
                    }
                });
                multiStageWorker.addStage({
                    execute: function() {
                        console.log("In stage 4");
                        offlineDbService.insertSchedulerStage("stage4");
                        return offlinePull().then(function(){
                            offlineDbService.clearSchedulerStage("stage4");
                        });
                    }
                });
                scheduledJob.create({worker: multiStageWorker, delay: scheduledSyncConfig.delay, count: scheduledSyncConfig.repeat}).start();
            };

        }
    ]);
