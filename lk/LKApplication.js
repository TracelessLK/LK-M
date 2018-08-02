import Application from '../engine/Application'
class LKApplication extends Application{

    constructor(name){
        super(name);
    }

    start(){
        super.start();
        this._contactManager.start();
        this._chatManager.start();
        this._orgManager.start();
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

    initOrgContacts(orgs,members,friends){
        this._lkContactHandler.asyResetContacts(members,friends,this.getCurrentUser().id).then(()=>{
            this._lkOrgHandler.asyResetOrgs(orgs,this.getCurrentUser().id);
        });
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

    setOrgMagicCode(code){
        this._orgMCode = code;
    }

    setMemberMagicCode(code){
        this._memberMCode = code;
    }

    async asyGetOrgMCode(){
        if (!this._orgMCode) {
            this._orgMCode = await this._lkMagicCodeProvider.asyGetMagicCode(this.getCurrentUser().id).orgMCode;
        }
        return this._orgMCode;
    }

    async asyGetMemberMCode(){
        if (!this._memberMCode) {
            this._memberMCode = await this._lkMagicCodeProvider.asyGetMagicCode(this.getCurrentUser().id).memberMCode;
        }
        return this._memberMCode;
    }

    setMessageTimeout(timeout){
        this._messageTimeout = timeout;
    }

    getMessageTimeout(){
        return this._messageTimeout;
    }
    //-------------------------------handler-----------------------------------
    setLKMagicCodeHandler(h){
        this._lkMagicCodeHandler = h;
    }

    getLKMagicCodeHandler(){
        return this._lkMagicCodeHandler;
    }

    setLKOrgHandler(h){
        this._lkOrgHandler = h;
    }

    getLKOrgHandler(){
        return this._lkOrgHandler;
    }

    setLKContactHandler(h){
        this._lkContactHandler = h;
    }

    getLKContactHandler(){
        return this._lkContactHandler;
    }

    setLKUserHandler(h){
        this._lkUserHandler = h;
    }

    getLKUserHandler(){
        return this._lkUserHandler;
    }


    //---------------------------------------------provider----------------------------------------------
    setLKUserProvider(p){
        this._lkUserProvider = p;
    }

    getLKUserProvider(){
        return this._lkUserProvider;
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

    setLKMagicCodeProvider(p){
        this._lkMagicCodeProvider = p;
    }

    getLKMagicCodeProvider(){
        return this._lkMagicCodeProvider;
    }
//----------------------------------manager---------------------------------------------
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
    setOrgManager(m){
        this._orgManager = m;
    }
    getOrgManager(){
        return this._orgManager;
    }


}
module.exports = LKApplication;
