
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
    reset(orgs,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "delete from org";
                tx.executeSql(sql,[],function (tx,results) {
                    if(orgs&&orgs.length>0){
                        let sql = "insert into org(id,name,parentId,mCode,memberMCode,ownerUserId) values ";
                        var params=[];
                        for(var i=0;i<orgs.length;i++){
                            var org = orgs[i];
                            sql += "(?,?,?,?,?)";
                            if(i<orgs.length-1){
                                sql +=",";
                            }
                            params.push(org.id);
                            params.push(org.name);
                            params.push(org.parentId);
                            params.push(org.mCode);
                            params.push(org.memberMCode);
                            params.push(userId);

                        }
                        tx.executeSql(sql,params,function () {
                            resolve();
                        },function (err) {
                            reject(err);
                        });
                    }else{
                        resolve();
                    }
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new Org();
