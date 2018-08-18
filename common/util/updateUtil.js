
import {downloadUpdate,switchVersion,isFirstTime,isRolledBack,markSuccess} from 'react-native-update'
import DeviceInfo from 'react-native-device-info'
import {Platform, Alert, Linking, NativeModules} from 'react-native'
import RNFetchBlob from "react-native-fetch-blob";
const errorReportUtil = require('./errorReportUtil')
const commonUtil = require('./commonUtil')
const netInfoUtil = require('./netInfoUtil')
const  RNFS = require('react-native-fs');
let downloadApkCount = 0

const updateUtil = {
    checkUpdateGeneral:async function(option){
        const {name,uid,beforeUpdate,noUpdateCb,errorCb,checkUpdateUrl,previewVersion,isDevMode,isPreviewVersionClient} = option
        const result = await netInfoUtil.httpPost({
            url:checkUpdateUrl,
            param:{
                name,
                os:Platform.OS,
                bundleId:DeviceInfo.getBundleId(),
                uniqueId:DeviceInfo.getUniqueID(),
                uid,
                versionLocal:require('../package').version,
                "previewVersion":previewVersion,
                buildNumberClient:DeviceInfo.getVersion(),
                "__DEV__":__DEV__,
                "isDevMode":isDevMode,
                "isPreviewVersion":isPreviewVersionClient
            }
        })
        if(__DEV__){
            // console.log(result)
        }

        const {needUpdate,isForce,hash,os,isHotUpdate,apkUrl,manifestUrl,
            ppkUrl,manualDownloadUrl,isPreviewVersion,fileName,updatePlatform,
            newVersion,serverVersion,buildNumberServer,error} = result

        if(error){
            errorReportUtil.errorReport({
                type:"checkUpdateGeneral",
                errorStr:error,
                level:10
            })
            commonUtil.runFunc(errorCb)

        }else{
            if(needUpdate){
                if(isHotUpdate){
                    this.hotUpdate({
                        beforeUpdate,noUpdateCb,result
                    })
                }else{
                    this.nativeUpdate({
                        beforeUpdate,noUpdateCb,result
                    })
                }
            }else{
                commonUtil.runFunc(noUpdateCb)
            }
        }


    },
    async informUpdate(result,beforeUpdate ,updateNow){
        if(beforeUpdate){
            await beforeUpdate()
        }
        const {needUpdate,isForce,hash,os,isHotUpdate,apkUrl,manifestUrl,
            ppkUrl,manualDownloadUrl,isPreviewVersion,fileName,updatePlatform,nextVersion,
            newVersion,serverVersion,buildNumberServer,isSilent} = result
        if(isSilent){
            updateNow()
        }else{
            const optionAry =  [
                {text: '取消', onPress: () =>{}, style: 'cancel'},
                {
                    text: '确认',
                    onPress:updateNow
                },
            ]
            let ask = "是否马上升级?"
            if(isForce){
                optionAry.shift()
                ask = '请马上升级'
            }
            Alert.alert(
                '提示',
                `有${isPreviewVersion?`预览版本${nextVersion}`:`最新版本${newVersion}`},${ask}`,
                optionAry,
                { cancelable: false }
            )
        }
    },
    init(){
        if(isFirstTime){
            try{
                markSuccess()
            }catch(error){
                errorReportUtil.errorReportForError({
                    type:"markSuccess",
                    error,
                    level:10
                })
            }
        }
        if(isRolledBack){
            errorReportUtil.errorReport({
                type:"isRolledBack",
                errorStr:"isRolledBack",
                level:10
            })

            this.manualUpdate(`应用更新失败,已经重新恢复到版本${require('../package').version}`)
        }
    },
    manualUpdate(option){
        const {info,manualDownloadUrl} = option
        Alert.alert("提示",`${info},是否手动下载最新版本?`,
            {text: '取消', onPress: () =>{}, style: 'cancel'},
            {
                text: '确认',
                onPress:()=>{
                    Linking.openURL(manualDownloadUrl).catch(error => {
                        errorReportUtil.errorReportForError({
                            error,
                            type:`Linking.openURL(${manualDownloadUrl})`
                        })
                    });
                }
            },
            { cancelable: false }
        )

    },
    nativeUpdate(option){
        const {result,beforeUpdate,noUpdateCb} = option

        const {needUpdate,isForce,hash,os,isHotUpdate,apkUrl,manifestUrl,
            ppkUrl,manualDownloadUrl,isPreviewVersion,fileName,updatePlatform,
            newVersion,serverVersion,buildNumberServer} = result
        const buildNumberLocal = DeviceInfo.getBuildNumber()

        if(buildNumberServer === buildNumberLocal){
            errorReportUtil.errorReport({
                type:"原生更新必须要改版本号",
                errorStr:`local: ${buildNumberLocal},server: ${buildNumberServer}`,
                level:10,
            })
        }else{
            if(Platform.OS === 'android'){
                let filePath = RNFS.ExternalDirectoryPath + `/${fileName}`
                RNFS.exists(filePath).then(result=>{
                    if(result){
                        RNFS.hash(filePath,'md5').then(localHash=>{
                            if(localHash === hash){
                                this.installApk(filePath)
                            }else{
                                this.downloadAndInstallApk({
                                    filePath,result
                                })
                            }
                        })
                    }else{
                        this.downloadAndInstallApk({
                            filePath,result
                        })
                    }
                })
            }else{
                this.informUpdate(result,beforeUpdate, () => {
                    console.log(manifestUrl)

                    Linking.openURL(manifestUrl)
                })

            }
        }
    },
    hotUpdate(option){
        const {result,beforeUpdate,noUpdateCb,appId} = option

        const {needUpdate,isForce,hash,os,isHotUpdate,apkUrl,manifestUrl,
            ppkUrl,manualDownloadUrl,isPreviewVersion,fileName,updatePlatform,
            newVersion,serverVersion,buildNumberServer} = result
        let param = {
            updateUrl: ppkUrl,
            hash:appId,  //hash必须是字符串
            update : true
        }
        try{
            //一旦downloadUpdate,下次重启必然更新
            this.informUpdate(result,beforeUpdate,()=>{
                downloadUpdate(param).then(hash=>{
                    switchVersion(hash)
                })
            })

        }catch(error){
            commonUtil.runFunc(noUpdateCb)
            this.manualUpdate({
                manualDownloadUrl,
                info:`下载更新出现错误,已停止更新`
            })
            errorReportUtil.errorReportForError({
                type:"downloadUpdate then switchVersion ",
                error,
                level:10,
            })
        }
    },
    installApk(filePath){
        NativeModules.ToastExample.install(filePath);
    },
    downloadAndInstallApk(option){
        const {result,filePath} = option
        const {apkUrl} = result
        RNFetchBlob.config({
            useDownloadManager : true,
            fileCache : true,
            path:filePath
        }).fetch('GET',apkUrl).progress({ count : 10 }, (received, total) => {
            // console.log(received)
            // console.log(total)
            // console.log('progress', received / total)
        }).then((res)=>{
            RNFS.hash(filePath,'md5').then(localHash=>{
                if(localHash === hash){
                    downloadApkCount = 0

                    this.informUpdate(result,()=>{
                        this.installApk(filePath)
                    })
                }else{
                    downloadApkCount++
                    if(downloadApkCount > 5){
                        errorReportUtil.errorReport({
                            type:"downloadAndInstallApk",
                            level:10,
                            errorStr:`download ${downloadApkCount} times,fail`,
                            extra:{
                                result:JSON.stringify(result)
                            }
                        })
                    }else{
                        setTimeout(()=>{
                            this.downloadAndInstallApk(option)
                        },1000*60)
                        errorReportUtil.errorReport({
                            type:"downloadAndInstallApk",
                            errorStr:`download ${downloadApkCount} times,fail`,
                            extra:{
                                result:JSON.stringify(result)
                            }
                        })
                    }
                }
            })
        }).catch((error) => {
            this.manualUpdate({
                info:"下载apk文件失败,已停止更新",
                manualDownloadUrl:result.manualDownloadUrl
            })
            errorReportUtil.errorReportForError({
                type:"downloadAndInstallApk",
                error,
                extra:{
                    result:JSON.stringify(result)
                }
            })

        })
    }
}

module.exports = updateUtil
