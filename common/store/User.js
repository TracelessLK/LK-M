
import db from "./DataBase"
import SQLite from 'react-native-sqlite-storage';

db.transaction((tx)=>{
    tx.executeSql("create table if not exists user(id TEXT PRIMARY KEY NOT NULL,name TEXT,pic TEXT,password TEXT,ext TEXT)",[],function () {
    },function (err) {
    });
});
var User = {
    userExits:function () {
        return false;
    }
}
module.exports = User;
