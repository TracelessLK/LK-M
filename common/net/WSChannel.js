import EventTarget from '../core/EventTarget'
class WSChannel extends EventTarget{

    constructor(url,keepAlive){
        super();
        this._url = url;
        this._keepAlive = keepAlive;
    }
    applyChannel(){
        return new Promise((resolve,reject)=>{
            if(!this._ws){
                try{
                    this._ws = new WebSocket(this._url);
                }catch (e){
                    delete this._ws;
                    reject(e);
                }
                if(this._ws){
                    this._ws.onmessage = (message)=> {
                        this.fire("message",message);
                    };
                    this._ws.onerror = (event)=>{
                        this.fire("error",event);
                    };
                    this._ws.onclose = (event)=>{
                        delete this._ws;
                        if(this._keepAlive){
                            this.applyChannel()
                        }
                        this.fire("close",event);
                    }
                    this.ws.onopen = function () {
                        resolve(this);

                    };
                }
            }else{
                resolve(this);
            }
        });

    }
    send(message){
        try{
            this._ws.send(message);
        }catch(e){
            console.info(e);
        }
    }
    close(){
        try{
            this._ws.close();
        }catch(e){
            console.info(e);
        }
    }
}
module.exports=WSChannel