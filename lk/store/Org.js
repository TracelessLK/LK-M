
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    let sql = "create table if not exists org(id TEXT PRIMARY KEY NOT NULL,name TEXT,parentId TEXT,mCode TEXT,memberMCode TEXT,ownerUserId TEXT,reserve1 TEXT)";
    tx.executeSql(sql,[],function () {
    },function (err) {
    });
});
class Org{
    getTopOrg(userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from org where parentId is null and ownerUserId=?";
                tx.executeSql(sql,[userId],function (tx,results) {
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
module.exports = new Org();
