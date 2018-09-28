
import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    //include org members 0 & foreign contacts 1 & group contacts 2
    let sql ="create table if not exists contact(id TEXT,name TEXT,pic TEXT,serverIP TEXT,serverPort INTEGER,relation INTEGER,orgId TEXT,mCode TEXT,ownerUserId TEXT,reserve1 TEXT,PRIMARY KEY(id,ownerUserId))";
    tx.executeSql(sql,[],function () {
    },function (err) {
    });
});
class Contact{
    get(userId,contactId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from contact where id=? and ownerUserId";
                tx.executeSql(sql,[contactId,userId],function (tx,results) {
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

    getMembersByOrg(userId,orgId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select * from contact where ownerUserId=? and relation=0 and orgId=? ";
                tx.executeSql(sql,[userId,orgId],function (tx,results) {
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

    getAll(userId,relation){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
              let sql = "select * from contact where ownerUserId=?";
                if(relation==0){
                    sql += " and relation=0";
                }else if(relation==1){
                    sql += " and relation=1";
                }
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

    selectAllDevices(contactId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "select c.id as uid,c.serverIP,c.serverPort,c.mCode,d.id as did,d.publicKey from contact as c,device as d where c.id=d.contactId and c.id=?";
                tx.executeSql(sql,[contactId],function (tx,results) {
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

    rebuidMembers(ids,newMembers,userId){
        this.removeContacts(ids,userId).then(()=>{
            this.addNewMembers(newMembers,userId);
        })
    }

    addNewMembers(members,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                if(members&&members.length>0){
                    let sql = "insert into contact(id,name,pic,serverIP,serverPort,relation,orgId,mCode,ownerUserId) values ";
                    var params=[];
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

                    tx.executeSql(sql,params,function () {
                        resolve();
                    },function (err) {
                        reject(err);
                    });
                }else{
                    resolve();
                }
            });
        });
    }

    addNewFriends(friends,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                if(friends&&friends.length>0){
                    let sql = "insert into contact(id,name,pic,serverIP,serverPort,relation,orgId,mCode,ownerUserId) values ";
                    var params=[];
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

                    tx.executeSql(sql,params,function () {
                        resolve();
                    },function (err) {
                        reject(err);
                    });
                }else{
                    resolve();
                }
            });
        });
    }

    addNewGroupContacts(contacts,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                if(contacts&&contacts.length>0){
                    let sql = "insert into contact(id,name,pic,serverIP,serverPort,relation,orgId,mCode,ownerUserId) values ";
                    var params=[];
                    for(var i=0;i<contacts.length;i++){
                        var friend = contacts[i];
                        sql += "(?,?,?,?,?,?,?,?,?)";
                        if(i<contacts.length-1){
                            sql +=",";
                        }
                        params.push(friend.id);
                        params.push(friend.name);
                        params.push(friend.pic);
                        params.push(friend.serverIP);
                        params.push(friend.serverPort);
                        params.push(2);
                        params.push(null);
                        params.push(friend.mCode);
                        params.push(userId);
                    }

                    tx.executeSql(sql,params,function () {
                        resolve();
                    },function (err) {
                        reject(err);
                    });
                }else{
                    resolve();
                }
            });
        });
    }


    resetContacts(members,friends,groupContacts,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "delete from contact where ownerUserId=?";
                tx.executeSql(sql,[userId], (tx,results) =>{
                    Promise.all([this.addNewMembers(members,userId),this.addNewFriends(friends,userId),this.addNewGroupContacts(groupContacts,userId)]).then(function () {
                        resolve();
                    }).then(function (err) {
                        reject(err);
                    });

                },function (err) {
                    reject(err);
                });
            });
        });
    }

    removeContacts(ids,userId){
        return new Promise((resolve,reject)=>{
            if(ids&&ids.length>0){
                db.transaction((tx)=>{
                    let sql = "delete from contact where ownerUserId=? and id in(";
                        for(let i=0;i<ids.length;i++){
                            sql+="?";
                            if(i<ids.length-1){
                                sql +=",";
                            }
                        }
                    sql+=")";
                    tx.executeSql(sql,ids,function (tx,results) {
                        resolve();
                    },function (err) {
                        reject(err);
                    });
                });
            }else{

            }

        });

    }

    async addNewGroupContactIFNotExist(members,userId){
        let ps = [];
        for(let i=0;i<members.length;i++){
            let member = members[i];
            ps.push(this.get(userId,member.id));
        }
        let res = await Promise.all(ps);
        let contacts = [];
        for(let j=0;j<res.length;j++){
            if(!res[j]){
                contacts.push(members[j]);
            }
        }
        return this.addNewGroupContacts(contacts,userId);
    }

    updateGroupContact2Friend(contactId,userId){
        return new Promise((resolve,reject)=>{
            db.transaction((tx)=>{
                let sql = "update contact set relation=1 where id=? and ownerUserId=?";
                tx.executeSql(sql,[contactId,userId],function () {
                    resolve();
                },function (err) {
                    reject(err);
                });
            });
        });
    }

}
module.exports = new Contact();
