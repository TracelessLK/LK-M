
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    tx.executeSql("create table if not exists chat(id TEXT,ownerUserId TEXT,name TEXT,newMsgNum INTEGER,createTime INTEGER,topTime INTEGER,isGroup INTEGER,reserve1 TEXT,PRIMARY KEY(ownerUserId,id))",[],function () {
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

    addSingleChat(userId,chatId,newMsgNum){

        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into chat(id,ownerUserId,newMsgNum,createTime,topTime,isGroup) values (?,?,?,?,?,?)";
                tx.executeSql(sql,[chatId,userId,newMsgNum||0,Date.now(),0,0],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }
    addGroupChat(userId,chatId,name,newMsgNum){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into chat(id,ownerUserId,name,newMsgNum,createTime,topTime,isGroup) values (?,?,?,?,?,?,?)";
                tx.executeSql(sql,[chatId,userId,name,newMsgNum||0,Date.now(),0,1],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }

    addGroupMembers(chatId,members){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "insert into groupMember(chatId,contactId) values ";
                for(let i=0;i<members.length;i++){
                    sql += "('"+chatId+"','";
                    sql += members[i].id;
                    sql +="')";
                    if(i<members.length-1){
                        sql += ",";
                    }
                }
                tx.executeSql(sql,[],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
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

    updateNewMsgNum(userId,chatId,num){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "update chat set newMsgNum=? where id=? and ownerUserId=?";
                tx.executeSql(sql,[num,chatId,userId],function () {
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
                    },function (err) {
                    });

                    let sql3 = "update chat set newMsgNum=? where ownerUserId=? and isGroup=? and newMsgNum>?";
                    tx.executeSql(sql3,[0,userId,1,0],function () {

                        resolve();

                        let sql4 = "delete from group_record_state where ownerUserId=?";
                        tx.executeSql(sql4,[userId],function () {
                        },function (err) {
                        });

                    },function (err) {
                        reject(err);
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


}
module.exports = new Chat();
