
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    //include org members & foreign contacts
    let sql ="create table if not exists contact(id TEXT PRIMARY KEY NOT NULL,name TEXT,pic TEXT,serverIP TEXT,serverPort INTEGER,isFriend INTEGER,orgId TEXT,mCode TEXT,ownerUserId TEXT,reserve1 TEXT)";
    tx.executeSql(sql,[],function () {
    },function (err) {
    });
});
class Contact{
    get(contactId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from contact where id=?";
                tx.executeSql(sql,[contactId],function (tx,results) {
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

    leftSelectAllDevices(contactId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select c.id as uid,c.serverIP,c.serverPort,c.mCode,d.id as did,d.publicKey from contact as c,device as d where c.id=d.contactId and c.id=?";
                tx.executeSql(sql,[contactId],function (tx,results) {
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
module.exports = new Contact();