const EventTarget = require('../core/EventTarget')
class WSChannel extends EventTarget{

    constructor(url,keepAlive){
        super();
        this._reconnectDelay=0;
        this._url = url;
        this._keepAlive = keepAlive;
    }
    // todo: applyChannel 要先判断网络情况
    applyChannel(){
        if(!this._openPromise){
            try{
                this._ws = new WebSocket(this._url);
            }catch (e){
                delete this._ws;
                return Promise.reject(e)
            }
            if(this._ws){
                this._ws.onmessage = (msg)=>{
                    this._onmessage(msg)
                };
                this._ws.onerror = (event) => {
                  this._onerror(event)
                }
                this._ws.onclose = (event)=>{
                    if((!this._foreClosed)&&this._keepAlive){
                        this._reconnect();
                    }
                }
                this._openPromise = new Promise(resolve => {
                    this._ws.onopen =  ()=> {
                        this.fire('connectionOpen')
                        resolve(this);
                    };
                })
                return this._openPromise
            }
        }else{
           return this._openPromise
        }



    }
    _reconnect(){
        let delay = this._reconnectDelay>=5000?5000:this._reconnectDelay;
        let con =  ()=> {
            this._reconnectDelay+=1000;
            delete this._openPromise;
            this.applyChannel().then(()=>{
                this._reconnectDelay=0;
                this._onreconnect(this);
            });
        }
        if(delay){
            setTimeout(()=>{

                con();

            },delay);
        }else{
            con();
        }
    }
    _onmessage(message){

    }
    _onreconnect(channel){

    }

    send(message){
        try{
            this._ws.send(message);
        }catch (e){
            console.info(e);
        }
    }
    close(){
        this._foreClosed = true;
        try{
            this._ws.close();
        }catch(e){
            console.info(e);
        }
    }
    getUrl(){
        return this._url;
    }
}
module.exports=WSChannel
