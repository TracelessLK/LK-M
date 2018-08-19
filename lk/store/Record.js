
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    tx.executeSql("create table if not exists record(ownerUserId TEXT,chatId TEXT,id TEXT,senderUid TEXT,senderDid TEXT,type INTEGER,content TEXT,sendTime INTEGER,state INTEGER,readState INTEGER,relativeMsgId TEXT,relativeOrder INTEGER,receiveOrder INTEGER,sendOrder INTEGER)",[],function () {
    },function (err) {
    });
    tx.executeSql("create table if not exists goup_record_state(msgId TEXT ,reporterUid TEXT NOT NULL,state INTEGER)",[],function () {
    },function (err) {
    });
});
class Record{
    addMsg(userId,chatId,msgId,senderUid,senderDid,type,content,sendTime,state,relativeMsgId,relativeOrder,receiveOrder,sendOrder){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into record(ownerUserId,chatId,id,senderUid,senderDid,type,content,sendTime,state,readState,relativeMsgId,relativeOrder,receiveOrder,sendOrder) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                tx.executeSql(sql,[userId,chatId,msgId,senderUid,senderDid,type,content,sendTime,isNaN(state)?-1:state,-1,relativeMsgId,relativeOrder,receiveOrder,sendOrder],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    _allUpdate(msgIds,state){
        return new Promise((resolve,reject)=>{
            let sql = "select id from record where state>=? id ";
            let num = 0;
            if(!msgIds.forEach){
                sql += "='"
                sql += msgIds;
                sql += "'";
                num = 1;
            }else{
                sql += "in (";
                for(var i=0;i<msgIds.length;i++){
                    sql+="'";
                    sql+=msgIds[i];
                    sql+="'";
                    if(i<msgIds.length-1){
                        sql+=",";
                    }
                    num++;
                }
                sql+=")";
            }
            db.transaction((tx)=>{
                tx.executeSql(sql,[state],function (tx,results) {
                    var len = results.rows.length;
                    if(len==num){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                },function (err) {
                    reject(err)
                });
            });
        });

    }
    updateMsgState(msgIds,state){
       return new Promise((resolve,reject)=>{
           let sql = "update record set state=? where state<? and id ";
           let update = false;
           if(!msgIds.forEach){
               sql += "='"
               sql += msgIds;
               sql += "'";
               update = true;
           }else{
               sql += "in (";
               for(var i=0;i<msgIds.length;i++){
                   sql+="'";
                   sql+=msgIds[i];
                   sql+="'";
                   if(i<msgIds.length-1){
                       sql+=",";
                   }
               }
               sql+=")";
               update = true;
           }
           if(update){
               db.transaction((tx)=>{
                   tx.executeSql(sql,[state,state], ()=> {
                       this._allUpdate(msgIds).then((all)=>{
                           if(all){
                               resolve();
                           }
                       });
                   },function (err) {
                       reject(err);
                   });
               });
           }


        });

    }
    getMsgs(userId,chatId,limit){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                var sql = "select * from record where ownerUserId=? and chatId=? order by relativeOrder,receiveOrder,sendOrder";
                if(limit&&limit>0){
                    sql += " desc limit ";
                    sql += limit;
                }
                db.transaction((tx)=>{
                    tx.executeSql(sql,[userId,chatId],function (tx,results) {
                        var rs = [];
                        var len = results.rows.length;
                        for(var i=0;i<len;i++){
                            rs.push(results.rows.item(i));
                        }
                        if(limit&&limit>0) {
                            rs = rs.reverse()
                        }
                        resolve(rs);
                    },function (err) {
                        reject(err);
                    });
                });
            });
        });
    }

    updateReadState(msgIds,state){
        return new Promise((resolve,reject)=>{
            let sql = "update record set readState=? where readState<? and msgId ";
            sql += "in (";
            for(var i=0;i<msgIds.length;i++){
                sql+="'";
                sql+=msgIds[i];
                sql+="'";
                if(i<msgIds.length-1){
                    sql+=",";
                }
            }
            sql+=")";
            db.transaction((tx)=>{
                tx.executeSql(sql,[state,state], ()=> {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });


        });
    }

    getMsgsNotRead(userId,chatId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                var sql = "select * from record where ownerUserId=? and chatId=? and senderUid!=?";
                db.transaction((tx)=>{
                    tx.executeSql(sql,[userId,chatId,userId],function (tx,results) {
                        var rs = [];
                        var len = results.rows.length;
                        for(var i=0;i<len;i++){
                            rs.push(results.rows.item(i));
                        }
                        resolve(rs);
                    },function (err) {
                        reject(err);
                    });
                });
            });
        });
    }

    getMsg(userId,chatId,msgId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                var sql = "select * from record where ownerUserId=? and chatId=? and id=?";
                db.transaction((tx)=>{
                    tx.executeSql(sql,[userId,chatId,msgId],function (tx,results) {
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
        });
    }

    getRelativePreSendMsg(userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                var sql = "select * from record where ownerUserId=? and chatId=? and relativeMsgId=? and senderUid=? and senderDid=? and sendOrder<? order by sendOrder";
                db.transaction((tx)=>{
                    tx.executeSql(sql,[userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder],function (tx,results) {
                        if(results.rows.length>0){
                            resolve(results.rows.item(rows.length-1));
                        }else{
                            resolve(null);
                        }
                    },function (err) {
                        reject(err);
                    });
                });
            });
        });
    }
    getRelativeNextSendMsg(userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                var sql = "select * from record where ownerUserId=? and chatId=? and relativeMsgId=? and senderUid=? and senderDid=? and sendOrder>? order by sendOrder";
                db.transaction((tx)=>{
                    tx.executeSql(sql,[userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder],function (tx,results) {
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
        });
    }

}
module.exports = new Record();
