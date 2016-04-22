angular.module('bahmni.common.offline')
    .service('schedulerStatusDbService', ['$window', function (window) {
        var db, indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

        this.init = function () {
            var request = indexedDB.open(Bahmni.Common.Offline.SchedulerDB, 1);
            request.onerror = function (evt) {
                console.log("Unable to initialize scheduler database error code: " + evt.target.errorCode);
            };
            request.onsuccess = function (e) {
                db = e.target.result;
            };
            request.onupgradeneeded = function (event) {
                console.log('SchedulerDB Upgrading...');
                db = event.target.result;
                db.createObjectStore(Bahmni.Common.Offline.SchedulerTable, {keyPath: "stage"});
                return db;
            };
        };

        this.getSchedulerStatus = function () {
            return db.transaction([Bahmni.Common.Offline.SchedulerTable], "readwrite")
                .objectStore(Bahmni.Common.Offline.SchedulerTable).openCursor();
        };

        this.insertSchedulerStage = function (stage) {
            var transaction = db.transaction([Bahmni.Common.Offline.SchedulerTable], "readwrite")
                .objectStore(Bahmni.Common.Offline.SchedulerTable)
                .add({'stage': stage});
            transaction.onerror = function (event) {
                console.log("Error, unable to insert stage status in scheduler. Error code: " + event.target.errorCode);
            };
        };

        this.clearSchedulerStage = function (stage) {
            var transaction = db.transaction([Bahmni.Common.Offline.SchedulerTable], "readwrite")
                .objectStore(Bahmni.Common.Offline.SchedulerTable)
                .delete(stage);
            transaction.onerror = function (event) {
                console.log("Error, unable to delete stage status from scheduler. Error code: " + event.target.errorCode);
            };
        };
    }]);
