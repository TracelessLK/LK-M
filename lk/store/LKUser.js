const DBProxy = require('./DBInit')

class LKUser{
    add(lkUser){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "insert into lkuser(id,name,pic,publicKey,privateKey,deviceId,serverIP,serverPort,serverPublicKey,orgId,mCode,password,reserve1) values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
                db.run(sql,[lkUser.id,lkUser.name,lkUser.pic,lkUser.publicKey,lkUser.privateKey,lkUser.deviceId,lkUser.serverIP,lkUser.serverPort,lkUser.serverPublicKey,lkUser.orgId,lkUser.mCode,lkUser.password,lkUser.reserve1],function (tx,results) {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    getAll(){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "select * from lkuser";
                db.getAll(sql,[],function (results) {
                    resolve(results);
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    get(id){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "select * from lkuser where id=?";
                db.get(sql,[id],function (row) {
                    resolve(row);
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    remove(id){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "delete from lkuser where id=?";
                db.run(sql,[id],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    setUserName(name,id){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "update lkuser set name=? where id=?";
                db.run(sql,[name,id],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    setUserPic(pic,id){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "update lkuser set pic=? where id=?";
                db.run(sql,[pic,id],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new LKUser();
