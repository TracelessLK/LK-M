import Application from '../engine/Application'
class LKApplication extends Application{

    constructor(name){
        super(name);
    }

    getCurrentLKUser(){
        return this._lkUser;
    }

    setCurrentLKUser(lkUser){
        this._lkUser = lkUser;
    }
}
module.exports = LKApplication;