import {Alert} from "react-native";
import DeviceInfo from 'react-native-device-info'
const commonUtil = require('./commonUtil')
const RNFS = require('react-native-fs')

const errorReportUtil = {
    errorReport(option){
        let {errorStr,type,extra,level,errorLogPath} = option
        const errorInfoObj = {
            time:commonUtil.getTimeDisplay(),
            errorStr,
        }
        if(!__DEV__){
            if(!level){
                level = 0
            }
            if(!extra){
                extra = {}
            }
            let obj = {
                level,
                type,
                err:errorStr,
                name:Store.getCurrentName(),
                time:commonUtil.getTimeDisplay(),
                versionLocal:require('../package').version,
                buildNumber:DeviceInfo.getBuildNumber(),
                bundleId:DeviceInfo.getBundleId(),
                brand:DeviceInfo.getBrand(),
                systemVersion:DeviceInfo.getSystemVersion(),
                systemName:DeviceInfo.getSystemName(),

                ...extra
            }
            let jsonStr = JSON.stringify(obj,null,5)

        }else{
            console.log(errorInfoObj)

        }


        RNFS.appendFile(errorLogPath, JSON.stringify(errorInfoObj,null,5)+'\n', 'utf8').then((success) => {
        }).catch((err) => {
            if(__DEV__){
                console.log(err);
            }
        });
    },
    init(){
        require('ErrorUtils').setGlobalHandler((error)=> {
            this.errorReportForError({
                error,
                type:"unCaughtError",
            })
        });
    },
    errorReportForError(option){
        let {error,type,extra,level} = option

        if(__DEV__){
            console.log(error)
        }
        if(!extra){
            extra = {}
        }
        if(!error instanceof Error){
            this.errorReport({
                errorStr:JSON.stringify(error),
                type:"errorReportForError",
            })
        }else{
            this.errorReport({
                errorStr:error.toString(),
                type,
                level,
                extra:{
                    ...extra,
                    stack:error.stack
                }
            })
        }

    }
}

module.exports = errorReportUtil
