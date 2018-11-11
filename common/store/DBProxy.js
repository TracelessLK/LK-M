const Application = require('../core/Application')
class DBProxy {

    serialize(fn){
        if(Application.getCurrentApp().getPlatform()===Application.PLATFORM_RN){
            fn()
        }else{
            Application.getCurrentApp().getDataSource().serialize(fn)
        }
    }

    transaction(fn){
        if(Application.getCurrentApp().getPlatform()===Application.PLATFORM_RN){
            Application.getCurrentApp().getDataSource().transaction((tx)=>{
                this._tx = tx;
                fn()
            })
        }else{
            fn()
        }
    }

    get(sql,params,okCallback,errCallback){
        if(Application.getCurrentApp().getPlatform()===Application.PLATFORM_RN){
            this._tx.executeSql(sql,params,(tx,results)=>{
                if(results.rows.length>0){
                    okCallback(results.rows.item(0));
                }else{
                    okCallback(null);
                }
            },errCallback)
        }else{
            Application.getCurrentApp().getDataSource().get(sql,params,(err,row)=>{
                if(err){
                    errCallback(err)
                }else{
                    okCallback(row)
                }
            })
        }
    }

    getAll(sql,params,okCallback,errCallback){
        if(Application.getCurrentApp().getPlatform()===Application.PLATFORM_RN){
            this._tx.executeSql(sql,params,(tx,results)=>{
                let ary = [];
                for(let i=0;i<results.rows.length;i++){
                    ary.push(results.rows.item(i));
                }
                okCallback(ary)
            },errCallback)
        }else{
            Application.getCurrentApp().getDataSource().all(sql,params,(err,rows)=>{
                if(err){
                    errCallback(err)
                }else{
                    okCallback(rows)
                }
            })
        }
    }

    run(sql,params,okCallback,errCallback){
        if(Application.getCurrentApp().getPlatform()===Application.PLATFORM_RN){
            this._tx.executeSql(sql,params,(tx,results)=>{
                okCallback()
            },errCallback)
        }else{
            Application.getCurrentApp().getDataSource().run(sql,params,(err)=>{
                if(err){
                    errCallback(err)
                }else{
                    okCallback()
                }
            })
        }
    }

}
DBProxy.saveFile = function(filePath,fileName,data){
   return Application.getCurrentApp().getDataSource().saveFile(filePath,fileName,data);
}
module.exports = DBProxy