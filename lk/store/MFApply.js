
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    tx.executeSql("create table if not exists mfapply(ownerUserId TEXT,id TEXT NOT NULL,name TEXT,pic TEXT,serverIP TEXT,serverPort INTEGER,mCode TEXT,time INTEGER,state INTEGER,PRIMARY KEY(ownerUserId,id))",[],function () {
    },function (err) {
      console.log(err)
    });
});
class MFApply{
    add(apply,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into mfapply(ownerUserId,id,name,pic,serverIP,serverPort,mCode,time,state) values(?,?,?,?,?,?,?,?,?)";
                tx.executeSql(sql,[userId,apply.id,apply.name,apply.pic,apply.serverIP,apply.serverPort,apply.mCode,Date.now(),-1],function (tx,results) {
                    resolve(true);
                },function (err) {
                    console.log(err)
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
    get(id,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from mfapply where ownerUserId=? and id=?";
                tx.executeSql(sql,[id,userId],function (tx,results) {
                    resolve(results.rows.item(0));
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    accept(id,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "update mfapply set state=1 where id=? and ownerUserId=?";
                tx.executeSql(sql,[id,userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new MFApply();
