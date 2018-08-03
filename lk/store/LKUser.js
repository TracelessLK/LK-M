
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    tx.executeSql("create table if not exists lkuser(id TEXT PRIMARY KEY NOT NULL,name TEXT,pic TEXT,publicKey TEXT,privateKey TEXT,deviceId TEXT,serverIP TEXT,serverPort INTEGER,serverPublicKey TEXT,orgId TEXT,mCode TEXT,password TEXT,reserve1 TEXT)",[],function () {
    },function (err) {
    });
});
class LKUser{
    add(lkUser){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into lkuser(id,name,pic,publicKey,privateKey,deviceId,serverIP,serverPort,serverPublicKey,orgId,mCode,password,reserve1) values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
                tx.executeSql(sql,[lkUser.id,lkUser.name,lkUser.pic,lkUser.publicKey,lkUser.privateKey,lkUser.deviceId,lkUser.serverIP,lkUser.serverPort,lkUser.serverPublicKey,lkUser.orgId,lkUser.mCode,lkUser.password,lkUser.reserve1],function (tx,results) {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    getAll(){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from lkuser";
                tx.executeSql(sql,[],function (tx,results) {

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
    get(id){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from lkuser where id=?";
                tx.executeSql(sql,[id],function (tx,results) {
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
    remove(id){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "delete from lkuser where id=?";
                tx.executeSql(sql,[id],function (tx,results) {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new LKUser();
