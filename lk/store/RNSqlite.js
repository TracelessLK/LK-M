const Application = require('../LKApplication')
const SQLite = require('react-native-sqlite-storage')
const RNFetchBlob = require('react-native-fetch-blob').default
const dirs = RNFetchBlob.fs.dirs;

let dbName = Application.getCurrentApp().getName()||"default";
const db = SQLite.openDatabase({name: dbName+'.db', location: 'default'}, function () {
}, function (err) {
});

db.saveFile = function (filePath,fileName,data) {
    return new Promise((resolve,reject)=>{
        var dir = dirs.DocumentDir+filePath;
        var createFile = function () {
            var url = dir+"/"+fileName;
            RNFetchBlob.fs.createFile(url,data,'base64').then(()=>{
                resolve(url)
            }).catch(err=>{
                reject(err)
            });
        }
        RNFetchBlob.fs.exists(dir).then(
            exist=>{
                if(!exist){
                    RNFetchBlob.fs.mkdir(dir).then(()=>{
                        createFile();
                    }).catch(err => {
                        reject(err)
                    });
                }else{
                    createFile();
                }
            }
        ).catch((err) => {
            reject(err)
        });
    });

}

module.exports = db;