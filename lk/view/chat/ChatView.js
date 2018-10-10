
import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Platform, ScrollView, Text, TextInput, TouchableOpacity, View,
  Alert, RefreshControl,
  CameraRoll
} from 'react-native'
// import ImagePicker from 'react-native-image-picker'
// import ImageResizer from 'react-native-image-resizer'
import RNFetchBlob from 'react-native-fetch-blob'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ImageViewer from 'react-native-image-zoom-viewer'
import {
  Toast
} from 'native-base'
import MessageText from './MessageText'
import {Header} from 'react-navigation'
const {debounceFunc, getFolderId} = require('../../../common/util/commonUtil')
const {getAvatarSource} = require('../../util')
const Constant = require('../state/Constant')
const {MAX_INPUT_HEIGHT} = Constant
const lkApp = require('../../LKApplication').getCurrentApp()
const manifest = require('../../../Manifest')
const chatManager = manifest.get('ChatManager')
const LKChatProvider = require('../../logic/provider/LKChatProvider')
const personImg = require('../image/person.png')
const _ = require('lodash')
const {DelayIndicator} = require('@ys/react-native-collection')
const chatLeft = require('../image/chat-y-l.png')
const chatRight = require('../image/chat-w-r.png')

export default class ChatView extends Component<{}> {
    static navigationOptions =({ navigation }) => {
      const {otherSide} = navigation.state.params
      let result
      if (otherSide) {
        result = {
          headerTitle: otherSide.name,
          headerRight:
                    <TouchableOpacity onPress={navigation.getParam('navigateToInfo')}
                      style={{marginRight: 20}}>
                      <Image source={personImg} style={{width: 22, height: 22}} resizeMode="contain"/>
                    </TouchableOpacity>
        }
      }
      return result
    }

    constructor (props) {
      super(props)
      this.minHeight = 35
      const {isGroup, otherSide} = this.props.navigation.state.params
      this.isGroupChat = isGroup
      this.originalContentHeight = Dimensions.get('window').height - Header.HEIGHT
      this.state = {
        biggerImageVisible: false,
        heightAnim: 0,
        height: this.minHeight,
        refreshing: false,
        msgViewHeight: this.originalContentHeight,
        isInited: false
      }
      this.otherSide = otherSide
      this.text = ''
      this.folderId = getFolderId(RNFetchBlob.fs.dirs.DocumentDir)
      this.limit = Constant.MESSAGE_PER_REFRESH
      this.extra = {
        lastContentHeight: 0,
        contentHeight: 0,
        count: 0,
        isRefreshingControl: false
      }
    }

     refreshRecord = async (limit) => {
       const user = lkApp.getCurrentUser()
       const msgAry = await LKChatProvider.asyGetMsgs(user.id, this.otherSide.id, limit)
       // console.log(msgAry)
       const msgOtherSideAry = msgAry.filter(msg => {
         return msg.senderUid !== user.id
       })
       const {length: msgOtherSideAryLength} = msgOtherSideAry

       if (msgOtherSideAryLength) {
         this.relativeMsgId = _.last(msgOtherSideAry).id
       } else {
         this.relativeMsgId = null
       }

       const recordAry = []
       let lastShowingTime
       const msgSet = new Set()

       for (let msg of msgAry) {
         let picSource = getAvatarSource(user.pic)
         const {sendTime, id} = msg
         if (msgSet.has(id)) {
           continue
         } else {
           msgSet.add(id)
         }
         msgSet.add(id)
         let now = new Date()
         if ((lastShowingTime && sendTime - lastShowingTime > 10 * 60 * 1000) || !lastShowingTime) {
           lastShowingTime = sendTime
           let timeStr = ''
           let date = new Date(lastShowingTime)
           if (now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate()) {
             timeStr += '今天 '
           } else if (now.getFullYear() === date.getFullYear()) {
             timeStr += date.getMonth() + 1 + '月' + date.getDate() + '日 '
           }
           timeStr += date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
           // console.log({lastShowingTime})
           recordAry.push(<Text style={{marginVertical: 10, color: '#a0a0a0', fontSize: 11}} key={lastShowingTime}>{timeStr}</Text>)
         }
         const style = {
           recordEleStyle: {flexDirection: 'row', justifyContent: 'flex-start', alignItems: msg.type === chatManager.MESSAGE_TYPE_IMAGE ? 'flex-start' : 'flex-start', width: '100%', marginTop: 15}
         }
         if (msg.senderUid !== user.id) {
           // message received
           let otherPicSource = getAvatarSource(this.otherSide.pic)

           recordAry.push(<View key={id} style={style.recordEleStyle}>
             <Image source={otherPicSource} style={{width: 40, height: 40, marginLeft: 5, marginRight: 8}} resizeMode="contain"></Image>
             <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
               {this.isGroupChat
                 ? <View style={{marginBottom: 8, marginLeft: 5}}>
                   <Text style={{color: '#808080', fontSize: 13}}> {this.groupMemberInfo[msg.senderUid].name}</Text>
                 </View>
                 : null}
               <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start'}}>
                 <Image source={chatLeft} style={{width: 11, height: 18, marginTop: 11}} resizeMode="contain"></Image>
                 <View style={{maxWidth: 200, borderWidth: 0, borderColor: '#e0e0e0', backgroundColor: '#f9e160', borderRadius: 5, marginLeft: -2, minHeight: 40, padding: 10, overflow: 'hidden'}}>
                   {this._getMessage(msg)}
                 </View>
               </View>
             </View>
           </View>)
         } else {
           // message sent
           console.log({sentMsg: msg})
           let iconName = this.getIconNameByState(msg.state)
           recordAry.push(<View key={id} style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', width: '100%', marginTop: 10}}>
             <TouchableOpacity ChatView={this} msgId={id} onPress={this.doTouchMsgState}>
               <Ionicons name={iconName} size={20} style={{marginRight: 5, lineHeight: 40, color: msg.state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE ? 'red' : 'black'}}/>
             </TouchableOpacity>
             <View style={{maxWidth: 200, borderWidth: 0, borderColor: '#e0e0e0', backgroundColor: '#ffffff', borderRadius: 5, minHeight: 40, padding: 10, overflow: 'hidden'}}>
               {this._getMessage(msg)}
             </View>
             {/* <Text>  {name}  </Text> */}
             <Image source={chatRight} style={{width: 11, height: 18, marginTop: 11}} resizeMode="contain"></Image>
             <Image source={picSource} style={{width: 40, height: 40, marginRight: 5, marginLeft: 8}} resizeMode="contain"></Image>
           </View>)
         }
       }
       this.setState({
         recordEls: recordAry,
         refreshing: false,
         isInited: true
       })
     }

    _keyboardDidShow=(e) => {
      // console.log({e})
      const {height} = Dimensions.get('window')
      let keyY = e.endCoordinates.screenY
      const _f = () => {
        const headerHeight = Header.HEIGHT
        let change = {}

        if (this.extra.contentHeight + headerHeight < keyY) {
          change.msgViewHeight = keyY - headerHeight
        } else {
          change.heightAnim = height - keyY
        }
        // console.log({change})

        this.setState(change)
      }
      if (Platform.OS === 'ios') {
        const {screenY: screenYStart} = e.startCoordinates
        if (screenYStart === height) {
          _f()
        }
      } else {
        _f()
      }
    }
    _keyboardDidHide=() => {
      this.setState({heightAnim: 0, msgViewHeight: this.originalContentHeight})
    }

    msgChange= async () => {
      // if (targetId === this.otherSide.id) {
      //
      // }
      // todo should have scroll and message pop up animation
      const num = await chatManager.asyGetNewMsgNum(this.otherSide.id)
      if (num) {
        chatManager.asyReadMsgs(this.otherSide.id, num)
      }
      this.limit++
      this.refreshRecord(this.limit)
    }

    update = () => {
      this.refreshRecord(this.limit)
    }

    componentWillUnmount =() => {
      chatManager.un('msgChanged', this.msgChange)

      this.keyboardDidShowListener.remove()
      this.keyboardDidHideListener.remove()
    }

    textChange=(v) => {
      this.text = v
    }

    componentDidMount= async () => {
      const num = await chatManager.asyGetNewMsgNum(this.otherSide.id)
      console.log({otherSide: this.otherSide, num})
      if (num) {
        chatManager.asyReadMsgs(this.otherSide.id, num)
      }
      chatManager.on('msgChanged', this.msgChange)
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)

      this.refreshRecord(this.limit)
      this.props.navigation.setParams({navigateToInfo: debounceFunc(this._navigateToInfo)})
    }

    _navigateToInfo = () => {
      if (this.isGroupChat) {
        // this.props.navigation.navigate('FriendInfoView', {friend: this.otherSide})
      } else {
        this.props.navigation.navigate('FriendInfoView', {friend: this.otherSide})
      }
    }

    send=() => {
      setTimeout(() => {
        this.textInput.clear()
      }, 0)
      const channel = lkApp.getLKWSChannel()
      if (this.isGroupChat) {
        channel.sendGroupText(this.otherSide.id, this.text, this.relativeMsgId)
      } else {
        channel.sendText(this.otherSide.id, this.text, this.relativeMsgId)
      }
      this.text = ''
      this.textInput.clear()
    }

    // sendImage=(data) => {
    //   const callback = ()=>{
    //       this.scrollView.scrollToEnd();
    //   };
    //   if(this.isGroupChat){
    //       WSChannel.sendGroupImage(this.otherSide.id,this.otherSide.name,data,callback);
    //   }else{
    //       WSChannel.sendImage(this.otherSide.id,data,callback);
    //   }
    //
    // }

    showImagePicker=() => {
      // let options = {
      //   title: '选择图片',
      //   cancelButtonTitle: '取消',
      //   takePhotoButtonTitle: '拍照',
      //   chooseFromLibraryButtonTitle: '图片库',
      //   mediaType: 'photo',
      //   storageOptions: {
      //     skipBackup: true,
      //     path: 'images'
      //   }
      // }

      // ImagePicker.showImagePicker(options, (response) => {
      //   if (response.didCancel) {
      //   } else if (response.error) {
      //   } else if (response.customButton) {
      //   } else {
      //     let imageUri = response.uri
      //
      //     const maxWidth = 1000
      //     const maxHeight = 1000
      //     ImageResizer.createResizedImage(imageUri, maxWidth, maxHeight, 'JPEG', 70, 0, null).then((res) => {
      //       RNFetchBlob.fs.readFile(res.path, 'base64').then((data) => {
      //         this.sendImage({data, width: maxWidth, height: maxHeight})
      //       })
      //     }).catch((err) => {
      //       console.log(err)
      //     })
      //   }
      // })
    }

    showBiggerImage= (imgUri, msgId) => {
      const biggerImageIndex = this.imageIndexer[msgId]

      this.setState({biggerImageVisible: true, biggerImageUri: imgUri, biggerImageIndex})
    }

    getIconNameByState=function (state) {
      if (state === 0) {
        return 'md-arrow-round-up'
      } else if (state === 1) {
        return 'md-refresh'
      } else if (state === 2) {
        return 'md-checkmark-circle-outline'
      } else if (state === 3) {
        return 'ios-checkmark-circle-outline'
      } else if (state === 4) {
        return 'ios-mail-open-outline'
      } else if (state === 5) {
        return 'ios-bonfire-outline'
      }
      return 'ios-help'
    }

    doTouchMsgState=function () {
      if (this.ChatView.isGroupChat) {
        // Store.getGroupChatRecord(this.ChatView.otherSide.id,this.msgId,null,(rec)=>{
        //     if(rec){
        //         if(rec.state===Store.MESSAGE_STATE_SERVER_NOT_RECEIVE){
        //             if(rec.type===Store.MESSAGE_TYEP_TEXT){
        //                 WSChannel.resendGroupMessage(rec.msgId,this.ChatView.otherSide.id,this.ChatView.otherSide.name,rec.content);
        //             }else if(rec.type===Store.MESSAGE_TYPE_IMAGE){
        //                 WSChannel.resendGroupImage(rec.msgId,this.ChatView.otherSide.id,this.ChatView.otherSide.name,JSON.parse(rec.content))
        //             }
        //         }else{
        //             this.ChatView.props.navigation.navigate("GroupMsgStateView",{gid:this.ChatView.otherSide.id,msgId:this.msgId});
        //         }
        //     }
        // });

      } else {
        // Store.getRecentChatRecord(this.ChatView.otherSide.id,this.msgId,null,(rec)=>{
        //     if(rec&&rec.state===Store.MESSAGE_STATE_SERVER_NOT_RECEIVE){
        //         if(rec.type===Store.MESSAGE_TYEP_TEXT)
        //         {WSChannel.resendMessage(rec.msgId,this.ChatView.otherSide.id,rec.content);}
        //         else if(rec.type===Store.MESSAGE_TYPE_IMAGE)
        //         {WSChannel.resendImage(rec.msgId,this.ChatView.otherSide.id,JSON.parse(rec.content))}
        //     }
        // });
      }
    }

    _getMessage=(rec) => {
      let result
      if (rec.type === chatManager.MESSAGE_TYEP_TEXT) {
        const text =
                <MessageText currentMessage={
                  {text: rec.content}
                } textStyle={{fontSize: 16, lineHeight: 19, color: rec.state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE ? 'red' : 'black'}}
                ></MessageText>

        result = text
      } else if (rec.type === chatManager.MESSAGE_TYPE_IMAGE) {
        let img = JSON.parse(rec.content)

        img.data = this.getImageData(img)

        let imgUri = img
        let imgW = 180
        let imgH = 180
        if (img && img.data) {
          imgUri = 'file://' + img.data
        }
        result = <TouchableOpacity onPress={() => { this.showBiggerImage(imgUri, rec.msgId) }}><Image source={{uri: imgUri}} style={{width: imgW, height: imgH}} resizeMode="contain"/></TouchableOpacity>
      } else if (rec.type === chatManager.MESSAGE_TYPE_FILE) {
        let file = JSON.parse(rec.content)
        result = <TouchableOpacity><Ionicons name="ios-document-outline" size={40} style={{marginRight: 5, lineHeight: 40}}></Ionicons><Text>{file.name}(请在桌面版APP里查看)</Text></TouchableOpacity>
      }
      return result
    }

    getImageData = (img) => {
      let result = img.data
      if (Platform.OS === 'ios') {
        result = img.data.replace(getFolderId(img.data), this.folderId)
      }
      return result
    }
    _onRefresh = () => {
      this.limit = this.limit + Constant.MESSAGE_PER_REFRESH
      if (this.limit > this.extra.maxCount) {
        Toast.show({
          text: '没有更早的消息记录',
          position: 'top'
        })
      } else {
        this.setState({
          refreshing: true
        })
        this.extra.isRefreshingControl = true
        this.refreshRecord(this.limit)
      }
    }
    /* eslint-disable no-unused-vars */
    onContentSizeChange=(contentWidth, contentHeight) => {
      this.extra.lastContentHeight = this.extra.msgViewHeight
      this.extra.contentHeight = contentHeight
      this.extra.count++
      const offset = Math.floor(this.extra.contentHeight - this.extra.lastContentHeight)

      const point = 1
      if (this.extra.count === point) {
        this.scrollView.scrollToEnd({animated: false})
      } else if (this.extra.count > point) {
        if (this.extra.isRefreshingControl) {
          this.scrollView.scrollTo({x: 0, y: offset, animated: false})
          this.extra.isRefreshingControl = false
        } else {
          this.scrollView.scrollToEnd({animated: false})
        }
      }
    }

    closeImage = () => {
      this.setState({biggerImageVisible: false, biggerImageUri: null})
    }

    render () {
      const contentView =
        <View style={{backgroundColor: '#f0f0f0', height: this.state.msgViewHeight}}>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', bottom: this.state.heightAnim}}>
            <ScrollView ref={(ref) => { this.scrollView = ref }} style={{width: '100%', backgroundColor: '#d5e0f2'}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />}
              onContentSizeChange={this.onContentSizeChange}
            >
              <View style={{width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20}}>
                {this.state.recordEls}
              </View>
            </ScrollView>
            <View style={{width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              borderTopWidth: 1,
              borderColor: '#d0d0d0',
              overflow: 'hidden',
              paddingVertical: 5,
              marginBottom: 0}}>
              <TextInput multiline ref={(ref) => { this.textInput = ref }} style={{flex: 1,
                color: 'black',
                fontSize: 16,
                paddingHorizontal: 4,
                borderWidth: 1,
                borderColor: '#d0d0d0',
                borderRadius: 5,
                marginHorizontal: 5,
                minHeight: this.minHeight,
                backgroundColor: '#f0f0f0',
                marginBottom: 5,
                height: this.state.height}}
              blurOnSubmit={false} returnKeyType="send" enablesReturnKeyAutomatically
              underlineColorAndroid='transparent' defaultValue={''} onSubmitEditing={debounceFunc(this.send)}
              onChangeText={this.textChange}
              returnKeyLabel='发送'
              onContentSizeChange={(event) => {
                let height = event.nativeEvent.contentSize.height
                if (height < this.minHeight) {
                  height = this.minHeight
                } else {
                  height += 10
                }
                if (this.state.height !== height) {
                  if (height > MAX_INPUT_HEIGHT) {
                    height = MAX_INPUT_HEIGHT
                  }
                  this.setState({height})
                }
              }}/>
              <TouchableOpacity onPress={this.showImagePicker}
                style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
                <Ionicons name="ios-camera-outline" size={38} style={{marginRight: 5}}/>
              </TouchableOpacity>
            </View>
          </View>

          <Modal visible={this.state.biggerImageVisible} transparent={false} animationType={'fade'}
            onRequestClose={this.closeImage}
          >
            <ImageViewer imageUrls={this.state.imageUrls}
              onClick={this.closeImage}
              onSave={(url) => {
                CameraRoll.saveToCameraRoll(url)
                Alert.alert(
                  '',
                  '图片成功保存到系统相册',

                  { cancelable: true }
                )
              }}
              index={this.state.biggerImageIndex}
            />
          </Modal>
        </View>
      const loadingView = <DelayIndicator/>
      return this.state.isInited ? contentView : loadingView
    }
}
