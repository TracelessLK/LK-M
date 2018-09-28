
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    tx.executeSql("create table if not exists record(ownerUserId TEXT,chatId TEXT,id TEXT,senderUid TEXT,senderDid TEXT,type INTEGER,content TEXT,sendTime INTEGER,state INTEGER,readState INTEGER,relativeMsgId TEXT,relativeOrder INTEGER,receiveOrder INTEGER,sendOrder INTEGER)",[],function () {
    },function (err) {
    });
    tx.executeSql("create table if not exists group_record_state(ownerUserId TEXT,msgId TEXT ,reporterUid TEXT NOT NULL,state INTEGER)",[],function () {
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
            let sql = "select id from record where state>=? and id ";
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
                   tx.executeSql(sql,[state,state], (tx,res)=> {
                       if(res.rowsAffected>0){
                           resolve();
                       }
                       // this._allUpdate(msgIds,state).then((all)=>{
                       //     if(all){
                       //         resolve();
                       //     }
                       // });
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
                var sql = "select * from record where ownerUserId=? and chatId=?";
                if(limit&&limit>0){
                    sql += " order by relativeOrder desc,receiveOrder desc,sendOrder desc";
                    sql += " limit ";
                    sql += limit;
                }else{
                    sql += " order by relativeOrder,receiveOrder,sendOrder";
                }
                db.transaction((tx)=>{
                    tx.executeSql(sql,[userId,chatId],function (tx,results) {
                        var rs = [];
                        var len = results.rows.length;
                        for(var i=0;i<len;i++){
                            rs.push(results.rows.item(i));
                        }
                        if(limit&&limit>0)
						    rs = rs.reverse();
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
            let sql = "update record set readState=? where readState<? and id ";
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
                var sql = "select * from record where ownerUserId=? and chatId=? and senderUid<>? and readState<1";
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
    removeAll(userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "delete from record where ownerUserId=? ";
                tx.executeSql(sql,[userId],function () {

                    let sql2 = "delete from group_record_state where ownerUserId=? ";
                    tx.executeSql(sql2,[userId],function () {
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
module.exports = new Record();
