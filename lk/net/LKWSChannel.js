import UUID from 'uuid/v4';
import EventTarget from '../../common/net/WSChannel'

class LKChannel extends WSChannel{

    _callbacks = new Map();

    constructor(url){
        super(url,true)
    }

    _generateMsgId () {
        return UUID();
    }

    _newRequest (action,data,callback,targetUid,targetCid) {
        let id = this._generateMsgId();
        if(callback)
            this._callbacks.set(id,callback);
        return  {
            header:{
                version:"1.0",
                id:id,
                action:action,
                senderUid:"",
                senderDid:"",

            },
            body:{

            },
            sign:""
        };
    }

}
let channel = new LKChannel();

module.exports=channel;