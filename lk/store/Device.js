const DBProxy = require('./DBInit')

class Device{
    getAll(contactId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "select * from device where contactId=?";
                db.getAll(sql,[contactId],function (results) {
                    resolve(results);
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    getDevice(deviceId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "select * from device where id=?";
                db.get(sql,[deviceId],function (row) {
                    resolve(row)
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    _addDevice(contactId,device){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                if(contactId&&device){
                    let sql = "insert into device(id,publicKey,contactId) values ";
                    sql += "(?,?,?)";
                    db.run(sql,[device.id,device.pk,contactId],function () {
                        resolve();
                    },function (err) {
                        reject(err)
                    });
                }else{
                    resolve();
                }
            });
        });
    }

    addDevices(contactId,devices){
        return new Promise((resolve,reject)=>{
            let ps = [];
            if(devices&&devices.length>0){
                devices.forEach((device)=>{
                    ps.push(this._addDevice(contactId,device));
                });
            }
            return Promise.all(ps);
            // db.transaction((tx)=>{
            //     if(devices&&devices.length>0){
            //         let sql = "insert into device(id,publicKey,contactId) values ";
            //         var params=[];
            //         for(var i=0;i<devices.length;i++){
            //             var device = devices[i];
            //             sql += "(?,?,?)";
            //             if(i<devices.length-1){
            //                 sql +=",";
            //             }
            //             params.push(device.id);
            //             params.push(device.pk);
            //             params.push(contactId);
            //         }
            //         console.log({params})
            //
            //         tx.executeSql(sql,params,function () {
            //             resolve();
            //         },function (err) {
            //             reject(err);
            //         });
            //     }else{
            //         resolve();
            //     }
            // });
        });
    }
    removeDevices(contactId,devices){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                if(devices&&devices.length>0){
                    let sql = "delete from device where contactId=? and id in( ";
                    for(var i=0;i<devices.length;i++){
                        sql += "?";
                        if(i<devices.length-1){
                            sql +=",";
                        }
                    }
                    sql += ")";
                    let param = [contactId];
                    db.run(sql,param.concat(devices),function () {
                        resolve();
                    },function (err) {
                        reject(err);
                    });
                }else{
                    resolve();
                }
            });
        });
    }
    removeAll(userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql2 = "delete from device where contactId not in (select id from contact where ownerUserId=? )";
                db.run(sql2,[userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new Device();
