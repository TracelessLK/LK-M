const db = require('../../common/store/DataBase')
const RNFetchBlob = require('react-native-fetch-blob')
const dirs = RNFetchBlob.fs.dirs;
db.transaction((tx)=>{
    tx.executeSql("create table if not exists record(ownerUserId TEXT,chatId TEXT,id TEXT,senderUid TEXT,senderDid TEXT,type INTEGER,content TEXT,sendTime INTEGER,state INTEGER,readState INTEGER,relativeMsgId TEXT,relativeOrder INTEGER,receiveOrder INTEGER,sendOrder INTEGER)",[],function () {
    },function (err) {
    });
    tx.executeSql("create table if not exists group_record_state(ownerUserId TEXT,chatId TEXT,msgId TEXT ,reporterUid TEXT NOT NULL,state INTEGER)",[],function () {
    },function (err) {
    });
});
class Record{

    constructor(){
        this.MESSAGE_TYPE_TEXT=0
        this.MESSAGE_TYPE_IMAGE=1
        this.MESSAGE_TYPE_FILE=2
        this.MESSAGE_TYPE_AUDIO=3
    }
    addMsg(userId,chatId,msgId,senderUid,senderDid,type,content,sendTime,state,relativeMsgId,relativeOrder,receiveOrder,sendOrder){
        return new Promise((resolve,reject)=>{

            let insert2DB = function () {
                db.transaction((tx)=>{
                    let sql = "insert into record(ownerUserId,chatId,id,senderUid,senderDid,type,content,sendTime,state,readState,relativeMsgId,relativeOrder,receiveOrder,sendOrder) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    tx.executeSql(sql,[userId,chatId,msgId,senderUid,senderDid,type,content,sendTime,isNaN(state)?-1:state,-1,relativeMsgId,relativeOrder,receiveOrder,sendOrder],function () {
                        resolve();
                    },function (err) {
                        reject(err);
                    });
                });
            }
            if(type===this.MESSAGE_TYPE_TEXT){
                insert2DB();
            }else if(type===this.MESSAGE_TYPE_IMAGE||type===this.MESSAGE_TYPE_AUDIO){
                let fileDir = "/images/";
                let fileExt = "jpg";
                if(type===this.MESSAGE_TYPE_AUDIO){
                    fileDir="/audio/";
                    fileExt=content.ext;
                }
                var dir = dirs.DocumentDir+"/"+userId+fileDir+chatId;
                var createFile = function () {
                    var url = dir+"/"+msgId+"."+fileExt;
                    RNFetchBlob.fs.createFile(url,content.data,'base64').then(()=>{
                        if(type===this.MESSAGE_TYPE_IMAGE){
                            content = JSON.stringify({width:content.width,height:content.height,url:url});
                        }else{
                            content = JSON.stringify({url:url});
                        }
                        insert2DB();
                    }).catch(err=>{
                      console.log(err)
                        reject(err)
                    });
                }
                RNFetchBlob.fs.exists(dir).then(
                    exist=>{
                        if(!exist){
                            RNFetchBlob.fs.mkdir(dir).then(()=>{
                                createFile();
                            }).catch(err => {
                              console.log(err)
                            });
                        }else{
                            createFile();
                        }
                    }
                ).catch((err) => {
                  console.log(err)
                  reject(err)
                });
            }



        });
    }
    _isAllUpdate(userId,chatId,msgIds,state){
        return new Promise((resolve,reject)=>{
            let sql = "select id from record where ownerUserId=? and chatId=? and state>=? and id ";
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
                tx.executeSql(sql,[userId,chatId,state],function (tx,results) {
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


    _addGroupMsgReadReport(userId,chatId,msgId,reporterUid,state){
        return new Promise((resolve,reject)=>{
            let sql = "insert into group_record_state(ownerUserId,chatId,msgId,reporterUid,state) values (?,?,?,?,?)";
            var params=[];
            params.push(userId);
            params.push(chatId);
            params.push(msgId);
            params.push(reporterUid);
            params.push(state);
            db.transaction((tx)=>{
                tx.executeSql(sql,params,function (tx,results) {
                    resolve();
                },function (err) {
                    reject();
                });
            });
        });

    }

    async msgReadReport(userId,chatId,msgIds,reporterUid,state,isGroup){
        // await this._ensureAllMsgExists(userId,chatId,msgIds);
        await this._updateMsgState(userId,chatId,msgIds,state);
        if(isGroup){
            let ps = [];
            msgIds.forEach((msgId)=>{
                ps.push(this._addGroupMsgReadReport(userId,chatId,msgId,reporterUid,state));
            });
           Promise.all(ps).catch(()=>{
               //do nothing
           });
        }
        return this._isAllUpdate(userId,chatId,msgIds,state);
    }

    _ensureAllMsgExists(userId,chatId,msgIds){
        return new Promise((resolve,reject)=>{
            var sql = "select id from record where ownerUserId=? and chatId=? and senderUid=? and id ";
            var num = 0;
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
            db.transaction((tx)=>{
                tx.executeSql(sql,[userId,chatId,userId],function (tx,results) {
                    var len = results.rows.length;
                    if(len==num){
                        resolve();
                    }
                },function (err) {
                    reject();
                });
            });
        });

    }
    _updateMsgState(userId,chatId,msgIds,state){
        return new Promise((resolve,reject)=>{
            let sql = "update record set state=? where state<? and ownerUserId=? and chatId=? and id ";
            if(!msgIds.forEach){
                sql += "='"
                sql += msgIds;
                sql += "'";
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
            }
            db.transaction((tx)=>{
                tx.executeSql(sql,[state,state,userId,chatId], (tx,res)=> {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });


        });

    }

    updateMsgState(userId,chatId,msgIds,state){
        return this._updateMsgState(userId,chatId,msgIds,state)
    }
    getGroupMsgReadReport(userId,chatId,msgId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = `select contact.id,contact.name,group_record_state.state from group_record_state ,contact 
                where group_record_state.reporterUid = contact.id 
                and group_record_state.ownerUserId=? 
                and group_record_state.chatId=? 
                and group_record_state.msgId=? 
                and contact.ownerUserId=?
                `;
                tx.executeSql(sql,[userId,chatId,msgId,userId],function (tx,results) {
                    let rs =[];
                    let len = results.rows.length;
                    for(let i=0;i<len;i++){
                        rs.push(results.rows.item(i));
                    }
                    resolve(rs);
                },function (err) {
                    reject(err);
                });
            });
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

    getReadNotReportMsgs(userId,chatId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                var sql = "select * from record where ownerUserId=? and senderUid<>? and chatId=? and readState=1";
                db.transaction((tx)=>{
                    tx.executeSql(sql,[userId,userId,chatId],function (tx,results) {
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
    getAllMsgNotReadNum (userId) {
      return new Promise((resolve,reject)=>{
        db.transaction((tx)=>{
          var sql = "select * from record where ownerUserId=? and senderUid<>? and readState<1";
          db.transaction((tx)=>{
            tx.executeSql(sql,[userId,userId],function (tx,results) {
              var len = results.rows.length;
              resolve(len);
            },function (err) {
              reject(err);
            });
          });
        });
      });
    }

    getMsg(userId,chatId,msgId,fetchData){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                var sql = "select * from record where ownerUserId=? and chatId=? and id=?";
                db.transaction((tx)=>{
                    tx.executeSql(sql,[userId,chatId,msgId], (tx,results) =>{
                        if(results.rows.length>0){
                            let result = results.rows.item(0);
                            if(fetchData&&this.MESSAGE_TYPE_IMAGE===result.type){
                                RNFetchBlob.fs.readFile(result.url,'base64').then((data)=>{
                                    result.data = data;
                                    resolve(result);
                                });
                            }else{
                                resolve(result);
                            }
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
