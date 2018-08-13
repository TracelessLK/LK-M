
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    tx.executeSql("create table if not exists record(ownerUserId TEXT,chatId TEXT,id TEXT,senderUid TEXT,senderDid TEXT,type INTEGER,content TEXT,sendTime INTEGER,state INTEGER)",[],function () {
    },function (err) {
    });
    tx.executeSql("create table if not exists goup_record_state(msgId TEXT ,reporterUid TEXT NOT NULL,state INTEGER)",[],function () {
    },function (err) {
    });
});
class Record{
    addMsg(userId,chatId,msgId,senderUid,senderDid,type,content,sendTime,state){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into record(ownerUserId,chatId,id,senderUid,senderDid,type,content,sendTime,state) values (?,?,?,?,?,?,?,?,?)";
                tx.executeSql(sql,[userId,chatId,msgId,senderUid,senderDid,type,content,sendTime,state],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    updateMsgState(msgId,state){
       // var sql = "update record set state=? where state<? and chatId=? and senderUid=? and msgId=? ";
    }
}
