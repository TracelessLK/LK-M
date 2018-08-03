import LoginStack from "../auth/LoginStack";

const navigatorUtil = require('../util/navigatorUtil')
import AuthStack from '../auth/AuthStack'
import MainStack from './MainStack'
const Application = require("../../LKApplication")
const lkApplication = Application.getCurrentApp()
const Manifest = require('../../../Manifest')
const option = {
    AuthStack,
    MainStack,
    async getRouterName(){
        let routerName
        const currentUser = lkApplication.getCurrentUser()

        if(currentUser){
            routerName = 'PasswordLoginView'
        }else{
            const userProvider = Manifest.get('LKUserProvider');
            const userAry = await userProvider.asyGetAll()

            const {length} = userAry

            if(length === 0){
                routerName = 'ScanRegisterView'
            }else if(length ===1){
                lkApplication.setCurrentUser(userAry[0])

                routerName = 'MainStack'
            }else if(length > 1){
                routerName = 'SelectUserView'
            }
        }
        return routerName
    }
}
console.log('hsdfsdf')

const EntryView = navigatorUtil.getNavigator(option)

export default EntryView
