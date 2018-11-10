const DBProxy = require('./DBInit')

class MagicCode{
    getMagicCode(userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "select * from magicCode where ownerUserId=?";
                db.get(sql,[userId],function (row) {
                    resolve(row)
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    updateOrgMagicCode(code,userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "update magicCode set orgMCode=? where ownerUserId=?";
                db.run(sql,[code,userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    updateMemberMagicCode(code,userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "update magicCode set memberMCode=? where ownerUserId=?";
                db.run(sql,[code,userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    reset(orgMCode,memberMCode,userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "delete from magicCode where ownerUserId=?";
                db.run(sql,[userId],function () {
                    let sql = "insert into magicCode(orgMCode,memberMCode,ownerUserId) values (?,?,?)";
                    db.run(sql,[orgMCode,memberMCode,userId],function () {
                       resolve();
                    },function (err) {
                        reject(err);
                    });
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    removeAll(userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "delete from magicCode where ownerUserId=?";
                db.run(sql,[userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new MagicCode();
