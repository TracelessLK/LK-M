const DBProxy = require('./DBInit')
class FlowCursor{

    constructor(){
        this._flows=new Map();
    }

    getLastFlowId(userId,flowType){
        return new Promise((resolve,reject)=>{
            let flowId = this._flows.get(userId+flowType);
            if(!flowId){
                let db = new DBProxy()
                db.transaction(()=>{
                    let sql = "select flowId from flowCursor where ownerUserId=? and flowType=?";
                    db.get(sql,[userId,flowType], (row)=>{
                        if(row){
                            flowId = row.flowId;
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
                let db = new DBProxy()
                db.transaction(()=>{
                    db.run(sql,[flowId,userId,flowType], ()=> {
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
