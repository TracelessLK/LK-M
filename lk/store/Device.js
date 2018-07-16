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
                        ary.push(results.rows.item(i).data);
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
                        resolve(results.rows.item(0).data);
                    }else{
                        resolve(null);
                    }
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new Device();
