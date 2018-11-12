const DBProxy = require('./DBInit')

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
                let db = new DBProxy()
                db.transaction((tx)=>{
                    let sql = "insert into record(ownerUserId,chatId,id,senderUid,senderDid,type,content,sendTime,state,readState,relativeMsgId,relativeOrder,receiveOrder,sendOrder) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    db.run(sql,[userId,chatId,msgId,senderUid,senderDid,type,content,sendTime,isNaN(state)?-1:state,-1,relativeMsgId,relativeOrder,receiveOrder,sendOrder],function () {
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
                let filePath = "/"+userId+fileDir+chatId;
                let fileName = msgId+"."+fileExt;
                DBProxy.saveFile(filePath,fileName,content.data).then((url)=>{
                    if(type===this.MESSAGE_TYPE_IMAGE){
                        content = JSON.stringify({width:content.width,height:content.height,url:url});
                    }else{
                        content = JSON.stringify({url:url});
                    }
                    insert2DB();
                })
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
            let db = new DBProxy()
            db.transaction((tx)=>{
                db.getAll(sql,[userId,chatId,state],function (results) {
                    var len = results.length;
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
            let db = new DBProxy()
            db.transaction((tx)=>{
                db.run(sql,params,function (tx,results) {
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
            let db = new DBProxy()
            db.transaction((tx)=>{
                db.getAll(sql,[userId,chatId,userId],function (results) {
                    var len = results.length;
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
            let db = new DBProxy()
            db.transaction((tx)=>{
                db.run(sql,[state,state,userId,chatId], (tx,res)=> {
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
            let db = new DBProxy()
            db.transaction((tx)=>{
                let sql = `select contact.id,contact.name,group_record_state.state from group_record_state ,contact 
                where group_record_state.reporterUid = contact.id 
                and group_record_state.ownerUserId=? 
                and group_record_state.chatId=? 
                and group_record_state.msgId=? 
                and contact.ownerUserId=?
                `;
                db.getAll(sql,[userId,chatId,msgId,userId],function (results) {
                    resolve(results);
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    getMsgs(userId,chatId,limit){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            var sql = "select * from record where ownerUserId=? and chatId=?";
            if(limit&&limit>0){
                sql += " order by relativeOrder desc,receiveOrder desc,sendOrder desc";
                sql += " limit ";
                sql += limit;
            }else{
                sql += " order by relativeOrder,receiveOrder,sendOrder";
            }
            db.transaction((tx)=>{
                db.getAll(sql,[userId,chatId],function (results) {
                    let rs = results;
                    if(limit&&limit>0)
                        rs = rs.reverse();
                    resolve(rs);
                },function (err) {
                    reject(err);
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
            let db = new DBProxy()
            db.transaction((tx)=>{
                db.run(sql,[state,state], ()=> {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });


        });
    }

    getReadNotReportMsgs(userId,chatId){
        return new Promise((resolve,reject)=>{
            var sql = "select * from record where ownerUserId=? and senderUid<>? and chatId=? and readState=1";
            let db = new DBProxy()
            db.transaction((tx)=>{
                db.getAll(sql,[userId,userId,chatId],function (results) {
                    resolve(results);
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    getMsgsNotRead(userId,chatId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            var sql = "select * from record where ownerUserId=? and chatId=? and senderUid<>? and readState<1";
            db.transaction((tx)=>{
                db.getAll(sql,[userId,chatId,userId],function (results) {
                    resolve(results);
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    getAllMsgNotReadNum (userId) {
      return new Promise((resolve,reject)=>{
          let db = new DBProxy()
        db.transaction((tx)=>{
          var sql = "select * from record where ownerUserId=? and senderUid<>? and readState<1";
            db.getAll(sql,[userId,userId],function (results) {
              var len = results.length;
              resolve(len);
            },function (err) {
              reject(err);
            });
        });
      });
    }

    getMsg(userId,chatId,msgId,fetchData){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                var sql = "select * from record where ownerUserId=? and chatId=? and id=?";
                db.get(sql,[userId,chatId,msgId], (result) =>{
                    if(result){
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
    }

    getRelativePreSendMsg(userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                var sql = "select * from record where ownerUserId=? and chatId=? and relativeMsgId=? and senderUid=? and senderDid=? and sendOrder<? order by sendOrder";
                tx.getAll(sql,[userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder],function (results) {
                    if(results.length>0){
                        resolve(results[results.length-1]);
                    }else{
                        resolve(null);
                    }
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    getRelativeNextSendMsg(userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction((tx)=>{
                var sql = "select * from record where ownerUserId=? and chatId=? and relativeMsgId=? and senderUid=? and senderDid=? and sendOrder>? order by sendOrder";
                db.get(sql,[userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder],function (row) {
                    resolve(row);
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
                let sql = "delete from record where ownerUserId=? ";
                db.run(sql,[userId],function () {

                    let sql2 = "delete from group_record_state where ownerUserId=? ";
                    db.run(sql2,[userId],function () {
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
