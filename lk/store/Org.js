const DBProxy = require('./DBInit')

class Org{
    getChildren(parentId,userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "select * from org where ownerUserId=? and ";
                const param = [userId]
                if(parentId){
                    sql+="parentId='";
                    sql+=parentId;
                    sql+="'";
                }else{
                    sql+="parentId is null";
                }

                db.getAll(sql,param,function (results) {
                    resolve(results);
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    reset(orgs,userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "delete from org";
                db.run(sql,[],function () {
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
                        db.run(sql,params,function () {
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
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = "delete from org where ownerUserId=?";
                db.run(sql,[userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new Org();
