import db from '../../common/store/DataBase'
db.transaction((tx)=>{
    let sql = "create table if not exists flowCursor(ownerUserId TEXT,flowId TEXT,flowType TEXT,PRIMARY KEY(ownerUserId,flowType))";
    tx.executeSql(sql,[],function () {
    },function (err) {
    });
});
class FlowCursor{
    _flows=new Map();
    getLastFlowId(userId,flowType){
        return new Promise((resolve,reject)=>{
            let flowId = this._flows.get(userId+flowType);
            if(!flowId){
                db.transaction((tx)=>{
                    let sql = "select flowId from flowCursor where ownerUserId=? and flowType=?";
                    tx.executeSql(sql,[userId,flowType], (tx,results)=>{
                        if(results.rows.length>0){
                            flowId = results.rows.item(0).flowId;
                            this._flows.set(userId+flowType,flowId)
                            resolve(flowId);
                        }else{
                            resolve(null);
                        }

                    },function (err) {
                        reject(err);
                    });
                });
            }else{
                resolve(flowId);
            }

        });
    }

    setLastFlowId(userId,flowType,flowId){
        return new Promise((resolve,reject)=>{
            this.getLastFlowId(userId,flowType).then((flowId)=>{
                let sql;
                if(!flowId){
                    sql = "insert into flowCursor(flowId,ownerUserId,flowType) values (?,?,?)";
                }else{
                    sql = "update flowCursor set flowId=? where ownerUserId=? and flowType=?";
                }
                db.transaction((tx)=>{
                    tx.executeSql(sql,[flowId,userId,flowType], (tx,results)=> {
                        this._flows.set(userId+flowType,flowId);
                        resolve();
                    },function (err) {
                        reject(err);
                    });
                });
            })


        });
    }
}
module.exports = new FlowCursor();
