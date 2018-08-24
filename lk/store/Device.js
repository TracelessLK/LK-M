import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    tx.executeSql("create table if not exists device(id TEXT PRIMARY KEY NOT NULL,publicKey TEXT,contactId TEXT,remark TEXT,reserve1 TEXT)",[],function () {
    },function (err) {
    });
});
class Device{
    getAll(contactId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from device where contactId=?";
                tx.executeSql(sql,[contactId],function (tx,results) {
                    let ary = [];
                    for(let i=0;i<results.rows.length;i++){
                        ary.push(results.rows.item(i));
                    }
                    resolve(ary);
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    getDevice(deviceId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from device where id=?";
                tx.executeSql(sql,[deviceId],function (tx,results) {
                    if(results.rows.length>0){
                        resolve(results.rows.item(0));
                    }else{
                        resolve(null);
                    }
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    addDevices(contactId,devices){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                if(devices&&devices.length>0){
                    let sql = "insert into device(id,publicKey,contactId) values ";
                    var params=[];
                    for(var i=0;i<devices.length;i++){
                        var device = devices[i];
                        sql += "(?,?,?)";
                        if(i<devices.length-1){
                            sql +=",";
                        }
                        params.push(device.id);
                        params.push(device.pk);
                        params.push(contactId);
                    }

                    tx.executeSql(sql,params,function () {
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
    removeDevices(contactId,devices){
        return new Promise((resolve,reject)=>{
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
                    tx.executeSql(sql,param.concat(devices),function () {
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
}
module.exports = new Device();
