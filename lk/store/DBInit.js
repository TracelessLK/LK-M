const DBProxy = require('../../common/store/DBProxy')
const Application = require('../LKApplication')
Application.getCurrentApp().on("dbReady",function () {
    let db = new DBProxy();
    db.serialize(function () {
        db.transaction(()=>{
            db.run("create table if not exists chat(id TEXT,ownerUserId TEXT,name TEXT,createTime INTEGER,topTime INTEGER,isGroup INTEGER,reserve1 TEXT,PRIMARY KEY(ownerUserId,id))",[],function () {
            },function (err) {
            });
            db.run("create table if not exists groupMember(chatId TEXT,contactId TEXT,reserve1 TEXT,primary key(chatId,contactId))",[],function () {
            },function (err) {
            });
        });

        db.transaction(()=>{
            //include org members 0 & foreign contacts 1 & group contacts 2
            let sql ="create table if not exists contact(id TEXT,name TEXT,pic TEXT,serverIP TEXT,serverPort INTEGER,relation INTEGER,orgId TEXT,mCode TEXT,ownerUserId TEXT,reserve1 TEXT,PRIMARY KEY(id,ownerUserId))";
            db.run(sql,[],function () {
            },function (err) {
            });
        });

        db.transaction((tx)=>{
            db.run("create table if not exists device(id TEXT PRIMARY KEY NOT NULL,publicKey TEXT,contactId TEXT,remark TEXT,reserve1 TEXT)",[],function () {
            },function (err) {
            });
        });

        db.transaction((tx)=>{
            let sql = "create table if not exists flowCursor(ownerUserId TEXT,flowId TEXT,flowType TEXT,PRIMARY KEY(ownerUserId,flowType))";
            db.run(sql,[],function () {
            },function (err) {
            });
        });

        db.transaction((tx)=>{
            db.run("create table if not exists lkuser(id TEXT PRIMARY KEY NOT NULL,name TEXT,pic TEXT,publicKey TEXT,privateKey TEXT,deviceId TEXT,serverIP TEXT,serverPort INTEGER,serverPublicKey TEXT,orgId TEXT,mCode TEXT,password TEXT,reserve1 TEXT)",[],function () {
            },function (err) {
            });
        });

        db.transaction((tx)=>{
            let sql = "create table if not exists magicCode(ownerUserId TEXT PRIMARY KEY NOT NULL,orgMCode TEXT,memberMCode TEXT,reserve1 TEXT)";
            db.run(sql,[],function () {
            },function (err) {
            });
        });

        db.transaction((tx)=>{
            db.run("create table if not exists mfapply(ownerUserId TEXT,id TEXT NOT NULL,name TEXT,pic TEXT,serverIP TEXT,serverPort INTEGER,mCode TEXT,time INTEGER,state INTEGER,PRIMARY KEY(ownerUserId,id))",[],function () {
            },function (err) {
            });
        });

        db.transaction((tx)=>{
            let sql = "create table if not exists org(id TEXT PRIMARY KEY NOT NULL,name TEXT,parentId TEXT,ownerUserId TEXT,reserve1 TEXT)";
            db.run(sql,[],function () {
            },function (err) {
            });
        });

        db.transaction((tx)=>{
            db.run("create table if not exists record(ownerUserId TEXT,chatId TEXT,id TEXT,senderUid TEXT,senderDid TEXT,type INTEGER,content TEXT,sendTime INTEGER,state INTEGER,readState INTEGER,relativeMsgId TEXT,relativeOrder INTEGER,receiveOrder INTEGER,sendOrder INTEGER)",[],function () {
            },function (err) {
            });
            db.run("create table if not exists group_record_state(ownerUserId TEXT,chatId TEXT,msgId TEXT ,reporterUid TEXT NOT NULL,state INTEGER)",[],function () {
            },function (err) {
            });
        });
    })
})

module.exports = DBProxy;