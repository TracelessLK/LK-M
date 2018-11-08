class EventTarget{

    constructor(){
        this._listeners=new Map();
    }

    on(event,fun) {
        var ary=this._listeners.get(event)
        if(!ary){
            ary = [];
            this._listeners.set(event,ary);
        }
        if (ary.indexOf(fun) === -1) {
          ary.push(fun)
        }
    }
    un(event,fun) {
        var ary=this._listeners.get(event);
        ary.splice(ary.indexOf(fun),1);
    }
    fire(event,params) {
        var ary=this._listeners.get(event)
        if(ary){
            ary.forEach(function(o){
                o(params);
            });
        }
    }
}

module.exports = EventTarget
