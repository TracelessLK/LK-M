import Application from '../engine/Application'
class LKApplication extends Application{

    constructor(name){
        super(name);
    }

    start(){
        super.start();
        this._contactManager.start();
        this._chatManager.start();
    }

    setCurrentUser(user){
        super.setCurrentUser(user);
        let url='ws://'+user.serverIP+':'+user.serverPort;
        if((!this._channel)||(this._channel.getUrl()!=url)){
            if(this._channel)
                this._channel.close();
            this._channel = new this._channelClass('ws://'+user.serverIP+':'+user.serverPort,true);

        }
        return this._channel.applyChannel().then((channel)=>{
            return channel.asyLogin(user.id,user.password);
        })

    }

    getLKWSChannel(){
        return this._channel;
    }

    getLKWSChannelClass(){
        return this._channelClass;
    }

    setLKWSChannelClass(channelClass){
        this._channelClass = channelClass;
    }

    setLKUserProvider(p){
        this._lkUserProvider = p;
    }

    getLKUserProvider(){
        return this._lkUserProvider;
    }

    setLKUserHandler(h){
        this._lkUserHandler = h;
    }

    getLKUserHandler(){
        return this._lkUserHandler;
    }

    async asyGetTopOrgMCode(){
        if (!this._topOrgMCode) {
             this._topOrgMCode = await this._lkOrgProvider.asyGetTopOrg(this.getCurrentUser().id).orgMCode;
        }
        return this._topOrgMCode;
    }

    async asyGetTopMemberMCode(){
        if (!this._topMemberMCode) {
            this._topMemberMCode = await this._lkOrgProvider.asyGetTopOrg(this.getCurrentUser().id).memberMCode;
        }
        return this._topMemberMCode;
    }

    setLKOrgProvider(p){
        this._lkOrgProvider = p;
    }

    getLKOrgProvider(){
        return this._lkOrgProvider;
    }

    setLKDeviceProvider(p){
        this._lkDeviceProvider = p;
    }

    getLKDeviceProvider(){
        return this._lkDeviceProvider;
    }

    setLKContactProvider(p){
        this._lkContactProvider = p;
    }

    getLKContactProvider(){
        return this._lkContactProvider;
    }

    setLKChatProvider(p){
        this._lkChatProvider = p;
    }

    getLKChatProvider(){
        return this._lkChatProvider;
    }

    setChatManager(m){
        this._chatManager = m;
    }

    getChatManager(){
        return this._chatManager;
    }

    setContactManager(m){
        this._contactManager = m;
    }

    getContactManager(){
        return this._contactManager;
    }

    setMessageTimeout(timeout){
        this._messageTimeout = timeout;
    }

    getMessageTimeout(){
        return this._messageTimeout;
    }
}
module.exports = LKApplication;
