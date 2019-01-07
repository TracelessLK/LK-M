const {engine} = require('@lk/LK-C')
const SQLite = require('react-native-sqlite-storage')
const RNFetchBlob = require('react-native-fetch-blob').default
const dirs = RNFetchBlob.fs.dirs;

let dbName = engine.getApplication().getCurrentApp().getName()||"default";
const db = SQLite.openDatabase({name: dbName+'.db', location: 'default'}, function () {
}, function (err) {
});

db.saveFile = function (filePath,fileName,data,param) {
    return new Promise((resolve,reject)=>{
        var dir = dirs.DocumentDir+filePath;
        var createFile = function () {
            var url = dir+"/"+fileName;
            RNFetchBlob.fs.createFile(url,data,'base64').then(()=>{
                resolve({url,param})
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

async function deleteFolder(p) {
    let fs = RNFetchBlob.fs;
    var files = [];
    let exists = await fs.exists(p);
    if(exists){
        files = await fs.ls(p);
        for(let i=0;i<files.length;i++){
            let file = p+"/"+files[i];
            let isDir = await fs.isDir(file);
            if(isDir) {
               await deleteFolder(file);
            } else {
               await fs.unlink(file);
            }
        }
        try{
            fs.unlink(p);
        }catch(e){

        }
    }
}

db.removeAllAttachment = function () {
    let userId = engine.getApplication().getCurrentApp().getCurrentUser().id;
    deleteFolder(dirs.DocumentDir+"/"+userId);
}

db.readFile = function (filePath) {
    return RNFetchBlob.fs.readFile(filePath,'base64');
}

module.exports = db;
