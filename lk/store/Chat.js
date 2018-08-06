
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    tx.executeSql("create table if not exists chat(id TEXT PRIMARY KEY NOT NULL,name TEXT,newMsgNum INTEGER,createTime INTEGER,topTime INTEGER,reserve1 TEXT)",[],function () {
    },function (err) {
    });
    tx.executeSql("create table if not exists chatMember(chatId TEXT,contactId TEXT,reserve1 TEXT,primary key(chatId,contactId))",[],function () {
    },function (err) {
    });
});
//order默认创建时间 如果置顶order=当前时间&onTop=1
class Chat{
    getAll(){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from chat order by topTime desc,createTime desc";
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
    getChat(chatId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from chat where id=?";
                tx.executeSql(sql,[chatId],function (tx,results) {
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
    getChatMembers(chatId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select c.* from chatMember as m,contact as c where m.contactId=c.id and chatId=? ";
                tx.executeSql(sql,[chatId],function (tx,results) {
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

    addNewChat(chatId,name,newMsgNum){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into chat(id,name,newMsgNum,createTime,topTime) values (?,?,?,?,?)";
                tx.executeSql(sql,[chatId,name,newMsgNum||0,Date.now(),0],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }


}
module.exports = new Chat();
