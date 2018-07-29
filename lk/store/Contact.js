
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    //include org members & foreign contacts
    let sql ="create table if not exists contact(id TEXT PRIMARY KEY NOT NULL,name TEXT,pic TEXT,serverIP TEXT,serverPort INTEGER,isFriend INTEGER,orgId TEXT,mCode TEXT,ownerUserId TEXT,reserve1 TEXT)";
    tx.executeSql(sql,[],function () {
    },function (err) {
    });
});
class Contact{
    get(contactId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from contact where id=?";
                tx.executeSql(sql,[contactId],function (tx,results) {
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

    leftSelectAllDevices(contactId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select c.id as uid,c.serverIP,c.serverPort,c.mCode,d.id as did,d.publicKey from contact as c,device as d where c.id=d.contactId and c.id=?";
                tx.executeSql(sql,[contactId],function (tx,results) {
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

    resetContacts(members,friends,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "delete from contact where ownerUserId=?";
                tx.executeSql(sql,[userId],function (tx,results) {
                    if((members&&members.length>0)||(friends&&friends.length>0)){
                        let sql = "insert into contact(id,name,pic,serverIP,serverPort,isFriend,orgId,mCode,ownerUserId) values ";
                        var params=[];
                        if((members&&members.length>0)){
                            for(var i=0;i<members.length;i++){
                                var member = members[i];
                                sql += "(?,?,?,?,?,?,?,?,?)";
                                if(i<members.length-1){
                                    sql +=",";
                                }
                                params.push(member.id);
                                params.push(member.name);
                                params.push(member.pic);
                                params.push(null);
                                params.push(null);
                                params.push(0);
                                params.push(member.orgId);
                                params.push(member.mCode);
                                params.push(userId);
                            }
                        }
                        if(friends&&friends.length>0){
                            if((members&&members.length>0)){
                                sql +=",";
                            }
                            for(var i=0;i<friends.length;i++){
                                var friend = friends[i];
                                sql += "(?,?,?,?,?,?,?,?,?)";
                                if(i<friends.length-1){
                                    sql +=",";
                                }
                                params.push(friend.id);
                                params.push(friend.name);
                                params.push(friend.pic);
                                params.push(friend.serverIP);
                                params.push(friend.serverPort);
                                params.push(1);
                                params.push(null);
                                params.push(friend.mCode);
                                params.push(userId);
                            }
                        }

                        tx.executeSql(sql,params,function () {
                            resolve();
                        },function (err) {
                            reject(err);
                        });
                    }else{
                        resolve();
                    }
                },function (err) {
                    reject(err);
                });
            });
        });
    }
}
module.exports = new Contact();