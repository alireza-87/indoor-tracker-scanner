/**
 * this class used to store data
 * currently our class use sqlite3 db in order to save data
 * you can use your own
 * @type {{Get: Get}}
 */
const sqlite = require('./sqlite/sqlite-handler')

class StorageHandler{
    constructor() {
    }


    emitterArrive(beaconType,uuid,id,address,timeStamp,delegate){
        sqlite.getEmitter(uuid,function (err,row) {
            if (row.length==0) {
                sqlite.insert(beaconType, id, uuid, address, timeStamp)
                delegate("insert",uuid)
            }else {
                sqlite.update(uuid, timeStamp)
                delegate("update",uuid)
            }

        })
    }

    getEmitters(uuid,delegate){
        sqlite.getEmitter(uuid,delegate)
    }

    getAllEmitters(delegate){
        sqlite.getAllEmitter(delegate)
    }

    deleteEmitter(uuid,delegate){
        sqlite.deleteEmitter(uuid,delegate)
    }

    init(type){
        if (type === 'sqlite')
            sqlite.Get()
    }
}

module.exports = StorageHandler