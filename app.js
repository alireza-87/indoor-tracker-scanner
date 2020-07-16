const storageHandler = require('./storage/storage-handler')
const BeaconScanner = require('node-beacon-scanner');
const mqttClient = require('./connection/mqtt-connection')
require('dotenv/config');
const cron = require("node-cron")
const roomNumber=207
let storage =new storageHandler()
storage.init('sqlite')


// Set an Event handler for becons
const scanner = new BeaconScanner();
scanner.onadvertisement = (obj) => {
    try {
        if (obj.beaconType === 'iBeacon') {
            storage.emitterArrive(obj.beaconType, obj.iBeacon.uuid, obj.id, obj.address, Date.now(),function (row,uuid) {
                if (row === "insert"){
                    //mqttClient.publishMessage("/dibrisbuilding/occ","New -> "+uuid)
                    mqttClient.subscribe("/dibrisbuilding/"+process.env.FLOOR+"/"+process.env.ROOM+'/'+uuid)
                }
            })
        }
    }catch (e) {

    }
};

// Start scanning
scanner.startScan().then(() => {
    console.log('Started to scan.')
}).catch((error) => {
    console.error(error);
});

//Check current beacon every 10 sec
cron.schedule("*/1 * * * * *", function() {
    storage.getAllEmitters(function (err,row) {
        console.log("Running Cron Job");
        const current_time=Date.now()-(10*1000);
        if (!err)
        row.forEach(function (item) {
                if (item.timestamp<current_time) {
                    console.log("uuid gone : %s", item.uuid);
                    storage.deleteEmitter(item.uuid,function (err) {
                        if (!err) {
                            console.log("DELETE");
                            //mqttClient.publishMessage("/dibrisbuilding/occ","Delete -> "+item.uuid)
                            mqttClient.unsubscribe("/dibrisbuilding/"+process.env.FLOOR+"/"+process.env.ROOM+'/'+item.uuid)
                        }else {
                            console.log("DELETE ERROR");
                        }
                    })
                }
            })
    })

});