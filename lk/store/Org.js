
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    let sql = "create table if not exists org(id TEXT PRIMARY KEY NOT NULL,name TEXT,parentId TEXT,ownerUserId TEXT,reserve1 TEXT)";
    tx.executeSql(sql,[],function () {
    },function (err) {
    });
});
class Org{
    getChildren(parentId,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from org where ownerUserId=? and ";
                const param = [userId]
                if(parentId){
                    sql+="parentId='";
                    sql+=parentId;
                    sql+="'";
                }else{
                    sql+="parentId is null";
                }

                tx.executeSql(sql,param,function (tx,results) {

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
    reset(orgs,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "delete from org";
                tx.executeSql(sql,[],function (tx,results) {
                    if(orgs&&orgs.length>0){
                        let sql = "insert into org(id,name,parentId,ownerUserId) values ";
                        var params=[];
                        for(var i=0;i<orgs.length;i++){
                            var org = orgs[i];
                            sql += "(?,?,?,?)";
                            if(i<orgs.length-1){
                                sql +=",";
                            }
                            params.push(org.id);
                            params.push(org.name);
                            params.push(org.parentId);
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
    removeAll(userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "delete from org where ownerUserId=?";
                tx.executeSql(sql,[userId],function (tx,results) {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new Org();
