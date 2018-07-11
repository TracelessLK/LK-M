
import Application from "../../engine/Application"
import SQLite from 'react-native-sqlite-storage';

let db = Application.getCurrentApp().getDatabase();
db.transaction((tx)=>{
    tx.executeSql("create table if not exists lkuser(id TEXT PRIMARY KEY NOT NULL,name TEXT,pic TEXT,publicKey TEXT,privateKey TEXT,deviceId TEXT,serverIP TEXT,serverPort INTEGER,serverPublicKey TEXT,orgId TEXT,reserve1 TEXT)",[],function () {
    },function (err) {
    });
});
class LKUser{
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
module.exports = new LKUser();
