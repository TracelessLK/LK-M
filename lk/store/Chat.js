const DBProxy = require('./DBInit')
//order默认创建时间 如果置顶order=当前时间&onTop=1
class Chat{
    getAll(userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "select * from chat where ownerUserId=? order by topTime desc,createTime desc";
                db.getAll(sql,[userId],function (results) {
                    resolve(results);
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    deleteChat(userId,chatId){
      return new Promise((resolve,reject)=>{
          let db = new DBProxy()
        db.transaction(()=>{
          let sql = "delete from chat where id=? and ownerUserId=?";
          db.run(sql,[chatId,userId],function () {
            resolve()
          },function (err) {
            reject(err);
          });
        });
      });
    }
    getChat(userId,chatId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "select * from chat where id=? and ownerUserId=?";
                db.get(sql,[chatId,userId],function (row) {
                    resolve(row)
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    getGroupMembers(chatId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "select c.* from groupMember as m,contact as c where m.contactId=c.id and m.chatId=? group by c.id";
                db.getAll(sql,[chatId],function (results) {
                    resolve(results);
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    addSingleChat(userId,chatId){

        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "insert into chat(id,ownerUserId,createTime,topTime,isGroup) values (?,?,?,?,?)";
                db.run(sql,[chatId,userId,Date.now(),0,0],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    addGroupChat(userId,chatId,name){
        return new Promise(async (resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "insert into chat(id,ownerUserId,name,createTime,topTime,isGroup) values (?,?,?,?,?,?)";
                db.run(sql,[chatId,userId,name,Date.now(),0,1],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    getGroupMember(chatId,contactId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let db = new DBProxy()
                let sql = "select * from groupMember where chatId=? and contactId=?";
                db.get(sql,[chatId,contactId],function (row) {
                    resolve(row)
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    async _addGroupMember(chatId,contactId){
        let cur = await this.getGroupMember();
        if(!cur){
            return new Promise( (resolve,reject)=>{
                let db = new DBProxy()
                db.transaction(()=>{
                    let sql = "insert into groupMember(chatId,contactId) values (?,?)";
                    db.run(sql,[chatId,contactId],function () {
                        resolve();
                    },function (err) {
                        reject(err);
                    });
                },function (err) {
                    reject(err);
                });
            });
        }
    }

    addGroupMembers(chatId,members){
        return new Promise( (resolve,reject)=>{
            let ps = [];
            members.forEach((contact)=>{
                let contactId = contact.id;
                ps.push(this._addGroupMember(chatId,contactId))
            });
            Promise.all(ps).then(()=>{
                resolve();
            }).catch(()=>{
                reject()
            })
        });
    }

    topChat(userId,chatId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let db = new DBProxy()
                let sql = "update chat set topTime=? where id=? and ownerUserId=?";
                db.run(sql,[Date.now(),chatId,userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    clear(userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "delete from chat where ownerUserId=? and isGroup=?";//removeAllSingleChats
                db.run(sql,[userId,0],function () {

                    let sql2 = "delete from record where ownerUserId=?";
                    db.run(sql2,[userId],function () {
                        resolve()
                    },function (err) {
                        reject(err);
                    });

                    let sql4 = "delete from group_record_state where ownerUserId=?";
                    db.run(sql4,[userId],function () {
                    },function (err) {
                    });

                },function (err) {
                    reject(err);
                });
            });
        });
    }

    removeAll(userId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "delete from chat where ownerUserId=? ";
                db.run(sql,[userId],function () {

                    let sql2 = "delete from groupMember where chatId not in (select id from chat where ownerUserId=? )";
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

    deleteGroup(userId,chatId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "delete from chat where ownerUserId=? and id=?";
                db.run(sql,[userId,chatId],function () {
                    resolve();
                    let sql2 = "delete from groupMember where chatId = ?";
                    db.run(sql2,[chatId],function () {
                    },function (err) {
                    });

                    let sql3 = "delete from record where ownerUserId=? and chatId=?";
                    db.run(sql3,[userId,chatId],function () {
                    },function (err) {
                    });

                    let sql4 = "delete from group_record_state where ownerUserId=? and chatId=?";
                    db.run(sql4,[userId,chatId],function () {
                    },function (err) {
                    });

                },function (err) {
                    reject(err);
                });
            });
        });
    }

    deleteGroupMember(uerId,chatId,contactId){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql2 = "delete from groupMember where chatId=? and contactId=?";
                db.run(sql,[chatId,contactId],function () {
                    resolve();

                    let sql3 = "delete from record where ownerUserId=? and chatId=? and senderUid=?";
                    db.run(sql3,[userId,chatId,contactId],function () {
                    },function (err) {
                    });

                    let sql4 = "delete from group_record_state where ownerUserId=? and chatId=? and reporterUid=?";
                    db.run(sql4,[userId,chatId,contactId],function () {
                    },function (err) {
                    });

                },function (err) {
                    reject(err);
                });
            });
        });
    }

    setGroupName(userId,chatId,name){
        return new Promise((resolve,reject)=>{
            let db = new DBProxy()
            db.transaction(()=>{
                let sql = "update chat set name=? where id=? and ownerUserId=?";
                db.run(sql,[name,chatId,userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }


}
module.exports = new Chat();
