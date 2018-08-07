

import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    let sql = "create table if not exists magicCode(ownerUserId TEXT PRIMARY KEY NOT NULL,orgMCode TEXT,memberMCode TEXT,reserve1 TEXT)";
    tx.executeSql(sql,[],function () {
    },function (err) {
    });
});
class MagicCode{
    getMagicCode(userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from magicCode where ownerUserId=?";
                tx.executeSql(sql,[userId],function (tx,results) {
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

    updateOrgMagicCode(code,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "update magicCode set orgMCode=? where ownerUserId=?";
                tx.executeSql(sql,[code,userId],function (tx,results) {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    updateMemberMagicCode(code,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "update magicCode set memberMCode=? where ownerUserId=?";
                tx.executeSql(sql,[code,userId],function (tx,results) {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    reset(orgMCode,memberMCode,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "delete from magicCode where ownerUserId=?";
                tx.executeSql(sql,[userId],function (tx,results) {
                    let sql = "insert into magicCode(orgMCode,memberMCode,ownerUserId) values (?,?,?)";
                    tx.executeSql(sql,[orgMCode,memberMCode,userId],function (tx,results) {
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
}
module.exports = new MagicCode();
