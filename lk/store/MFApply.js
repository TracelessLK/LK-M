const DBProxy = require('./DBInit')

class MFApply{
    add(apply,userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "insert into mfapply(ownerUserId,id,name,pic,serverIP,serverPort,mCode,time,state) values(?,?,?,?,?,?,?,?,?)";
                db.run(sql,[userId,apply.id,apply.name,apply.pic,apply.serverIP,apply.serverPort,apply.mCode,Date.now(),-1],function () {
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
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "select * from mfapply where ownerUserId=? order by time desc";
                db.getAll(sql,[userId],function (results) {
                    resolve(results);
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    get(id,userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "select * from mfapply where id=? and ownerUserId=?";
                db.get(sql,[id,userId],function (row) {
                    resolve(row);
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    accept(id,userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "update mfapply set state=1 where id=? and ownerUserId=?";
                db.run(sql,[id,userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    removeAll(userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "delete from mfapply where ownerUserId=?";
                db.run(sql,[userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new MFApply();
