import EventTarget from '../core/EventTarget'
class WSChannel extends EventTarget{

    _reconnectDelay=0

    constructor(url,keepAlive){
        super();
        this._url = url;
        this._keepAlive = keepAlive;
    }
    applyChannel(){
        if(!this.openPromise){
            try{
                this._ws = new WebSocket(this._url);
            }catch (e){
                delete this._ws;
                return Promise.reject(e)
            }
            if(this._ws){
                this._ws.onmessage = this._onmessage;
                this._ws.onerror = (event)=>{
                };
                this._ws.onclose = (event)=>{
                    if((!this._foreClosed)&&this._keepAlive){
                        this._reconnect();
                    }
                }
                this.openPromise = new Promise(resolve => {
                    this._ws.onopen =  ()=> {
                        resolve(this);
                    };
                })
                return this.openPromise
            }
        }else{
           return this.openPromise
        }

    }
    _reconnect(){
        let delay = this._reconnectDelay>=5000?5000:this._reconnectDelay;
        let con =  ()=> {
            this._reconnectDelay+=1000;
            delete this._ws;
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
        this._ws.send(message);

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
