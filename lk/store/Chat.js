
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    tx.executeSql("create table if not exists chat(id TEXT,ownerUserId TEXT,name TEXT,createTime INTEGER,topTime INTEGER,isGroup INTEGER,reserve1 TEXT,PRIMARY KEY(ownerUserId,id))",[],function () {
    },function (err) {
    });
    tx.executeSql("create table if not exists groupMember(chatId TEXT,contactId TEXT,reserve1 TEXT,primary key(chatId,contactId))",[],function () {
    },function (err) {
    });
});
//order默认创建时间 如果置顶order=当前时间&onTop=1
class Chat{
    getAll(userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from chat where ownerUserId=? order by topTime desc,createTime desc";
                tx.executeSql(sql,[userId],function (tx,results) {
                    let ary = [];
                    for(let i=0;i<results.rows.length;i++){
                        ary.push(results.rows.item(i));
                    }
                    resolve(ary);
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    deleteChat(userId,chatId){
      return new Promise((resolve,reject)=>{
        db.transaction((tx)=>{
          let sql = "delete from chat where id=? and ownerUserId=?";
          tx.executeSql(sql,[chatId,userId],function (tx,results) {
            resolve()
          },function (err) {
            reject(err);
          });
        });
      });
    }
    getChat(userId,chatId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from chat where id=? and ownerUserId=?";
                tx.executeSql(sql,[chatId,userId],function (tx,results) {
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
    }
    getGroupMembers(chatId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select c.* from groupMember as m,contact as c where m.contactId=c.id and m.chatId=? group by c.id";
                tx.executeSql(sql,[chatId],function (tx,results) {
                    let ary = [];
                    for(let i=0;i<results.rows.length;i++){
                        ary.push(results.rows.item(i));
                    }
                    resolve(ary);
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    addSingleChat(userId,chatId){

        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into chat(id,ownerUserId,createTime,topTime,isGroup) values (?,?,?,?,?)";
                tx.executeSql(sql,[chatId,userId,Date.now(),0,0],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    addGroupChat(userId,chatId,name){
        return new Promise(async (resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into chat(id,ownerUserId,name,createTime,topTime,isGroup) values (?,?,?,?,?,?)";
                tx.executeSql(sql,[chatId,userId,name,Date.now(),0,1],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    _addGroupMember(chatId,contactId){
        return new Promise( (resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into groupMember(chatId,contactId) values (?,?) where not exists(select * from groupMember where chatId=? and contactId=?)";
                tx.executeSql(sql,[chatId,contactId,chatId,contactId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            },function (err) {
                reject(err);
            });
        });

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
            db.transaction((tx)=>{
                let sql = "update chat set topTime=? where id=? and ownerUserId=?";
                tx.executeSql(sql,[Date.now(),chatId,userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    clear(userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "delete from chat where ownerUserId=? and isGroup=?";//removeAllSingleChats
                tx.executeSql(sql,[userId,0],function () {

                    let sql2 = "delete from record where ownerUserId=?";
                    tx.executeSql(sql2,[userId],function () {
                        resolve()
                    },function (err) {
                        reject(err);
                    });

                    let sql4 = "delete from group_record_state where ownerUserId=?";
                    tx.executeSql(sql4,[userId],function () {
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
            db.transaction((tx)=>{
                let sql = "delete from chat where ownerUserId=? ";
                tx.executeSql(sql,[userId],function () {

                    let sql2 = "delete from groupMember where chatId not in (select id from chat where ownerUserId=? )";
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

    deleteGroup(userId,chatId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "delete from chat where ownerUserId=? and id=?";
                tx.executeSql(sql,[userId,chatId],function () {
                    resolve();
                    let sql2 = "delete from groupMember where chatId = ?";
                    tx.executeSql(sql2,[chatId],function () {
                    },function (err) {
                    });

                    let sql3 = "delete from record where ownerUserId=? and chatId=?";
                    tx.executeSql(sql3,[userId,chatId],function () {
                    },function (err) {
                    });

                    let sql4 = "delete from group_record_state where ownerUserId=? and chatId=?";
                    tx.executeSql(sql4,[userId,chatId],function () {
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
            db.transaction((tx)=>{
                let sql2 = "delete from groupMember where chatId=? and contactId=?";
                tx.executeSql(sql,[chatId,contactId],function () {
                    resolve();

                    let sql3 = "delete from record where ownerUserId=? and chatId=? and senderUid=?";
                    tx.executeSql(sql3,[userId,chatId,contactId],function () {
                    },function (err) {
                    });

                    let sql4 = "delete from group_record_state where ownerUserId=? and chatId=? and reporterUid=?";
                    tx.executeSql(sql4,[userId,chatId,contactId],function () {
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
            db.transaction((tx)=>{
                let sql = "update chat set name=? where id=? and ownerUserId=?";
                tx.executeSql(sql,[name,chatId,userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }


}
module.exports = new Chat();
