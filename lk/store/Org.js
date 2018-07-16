
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    let sql = "create table if not exists org(id TEXT PRIMARY KEY NOT NULL,name TEXT,parentId TEXT,mCode TEXT,memberMCode TEXT,ownerUserId TEXT,reserve1 TEXT)";
    tx.executeSql(sql,[],function () {
    },function (err) {
    });
});
class Org{
    getTopMCode(){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from org where parentId is null";
                tx.executeSql(sql,[],function (tx,results) {
                    if(results.rows.length>0){
                        resolve(results.rows.item(0).data.mcode);
                    }else{
                        resolve(null);
                    }

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
                        ary.push(results.rows.item(i).data);
                    }
                    resolve(ary);
                },function (err) {
                    reject(err);
                });
            });
        });

    }
}
module.exports = new Org();
