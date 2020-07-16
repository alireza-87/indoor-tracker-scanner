const sqlite3 = require('sqlite3').verbose();

let DbConnection = function () {

    let mdb = null;
    let instance = 0;

    function creatDataBase() {
        mdb.run('CREATE TABLE IF NOT EXISTS emitters(beaconType text,id text,uuid text,address text,timestamp number, PRIMARY KEY(uuid))');
    }

    function DbConnect(){
        try {
            mdb = new sqlite3.Database(':memory:', (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log('Connected to the in-memory SQlite database.');
            });
            creatDataBase()
            return mdb
        } catch (e) {
            return e;
        }
    }

    function Get() {
        try {
            instance++;     // this is just to count how many times our singleton is called.
            if (mdb != null) {
                return mdb;
            } else {
                mdb = DbConnect();
                return mdb;
            }
        } catch (e) {
            return e;
        }
    }

    function insert(beaconType,id,uuid,address,timeStamp) {
        Get().run('INSERT INTO emitters(beaconType,id,uuid,address,timestamp) VALUES(?,?,?,?,?)',[beaconType,id,uuid,address,timeStamp],function (err) {
            if (err){
                console.log('insert -> %s',err)
            }else{
                console.log('insert.... uuid: %s',uuid)
            }
        })
    }

    function update(uuid,timeStamp) {
        Get().run('UPDATE emitters set timestamp=? WHERE uuid=?',[timeStamp,uuid],function (err) {
            if (err){
                console.log('insert -> %s',err)
            }
        })
    }

    function getEmitter(uuid,delegate){
        Get().all("SELECT * from emitters where uuid = ?",[uuid],function (err,row) {
            delegate(err,row)
        })
    }

    function getAllEmitter(delegate){
        Get().all("SELECT * from emitters",[],function (err,row) {
            delegate(err,row)
        })
    }

    function deleteEmitter(uuid,delegate) {
        Get().run("DELETE FROM emitters WHERE uuid = ?",[uuid],function (err) {
            delegate(err)
        })
    }

    return {
        Get,
        insert,
        getEmitter,
        getAllEmitter,
        deleteEmitter,
        update
    }

}
module.exports = DbConnection();