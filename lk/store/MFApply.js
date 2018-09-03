
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    tx.executeSql("create table if not exists mfapply(ownerUserId TEXT,contactId TEXT PRIMARY KEY NOT NULL,name TEXT,pic TEXT,serverIP TEXT,serverPort INTEGER,time INTEGER,state INTEGER,PRIMARY KEY(ownerUserId,contactId))",[],function () {
    },function (err) {
    });
});
class MFApply{
    add(apply,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into mfapply(ownerUserId,contactId,name,pic,serverIP,serverPort,time,state) values(?,?,?,?,?,?,?,?)";
                tx.executeSql(sql,[userId,apply.contactId,apply.name,apply.pic,apply.serverIP,apply.serverPort,Date.now(),-1],function (tx,results) {
                    resolve(true);
                },function (err) {
                    //reject(err);
                    resolve(false);
                });
            });
        });
    }
    getAll(userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from mfapply where ownerUserId=? order by time desc";
                tx.executeSql(sql,[userId],function (tx,results) {

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
    accept(contactId,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "update mfapply set state=1 where contactId=? and ownerUserId=?";
                tx.executeSql(sql,[contactId,userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new MFApply();
