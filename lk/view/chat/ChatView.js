
import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Platform, ScrollView, Text, TextInput, TouchableOpacity, View,
  Alert, RefreshControl,
  CameraRoll,
  StatusBar
} from 'react-native'
// import ImagePicker from 'react-native-image-picker'
// import ImageResizer from 'react-native-image-resizer'
import RNFetchBlob from 'react-native-fetch-blob'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ImageViewer from 'react-native-image-zoom-viewer'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import {
  Toast,
  ActionSheet
} from 'native-base'
import NetIndicator from '../common/NetIndicator'
import MessageText from './MessageText'
import {Header} from 'react-navigation'
const {debounceFunc, getFolderId} = require('../../../common/util/commonUtil')
const {getAvatarSource, getIconNameByState} = require('../../util')
const Constant = require('../state/Constant')
const lkApp = require('../../LKApplication').getCurrentApp()
const manifest = require('../../../Manifest')
const chatManager = manifest.get('ChatManager')
const LKChatProvider = require('../../logic/provider/LKChatProvider')
const LKContactProvider = require('../../logic/provider/LKContactProvider')
const personImg = require('../image/person.png')
const groupImg = require('../image/group.png')
const _ = require('lodash')
const {DelayIndicator, TextInputWrapper} = require('@ys/react-native-collection')
const chatLeft = require('../image/chat-y-l.png')
const chatRight = require('../image/chat-w-r.png')
const uuid = require('uuid')
const {runNetFunc} = require('../../util')

export default class ChatView extends Component<{}> {
    static navigationOptions = ({ navigation }) => {
      const {otherSideId, isGroup} = navigation.state.params
      let headerTitle = navigation.getParam('headerTitle')
      headerTitle = headerTitle || ''
      let result
      if (otherSideId) {
        result = {
          headerTitle,
          headerRight:
                    <TouchableOpacity onPress={navigation.getParam('navigateToInfo')}
                      style={{marginRight: 20}}>
                      <Image source={isGroup ? groupImg : personImg} style={{width: 22, height: 22}} resizeMode="contain"/>
                    </TouchableOpacity>
        }
      }
      return result
    }

    constructor (props) {
      super(props)
      this.minHeight = 35
      const {isGroup, otherSideId} = this.props.navigation.state.params
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
      this.otherSideId = otherSideId
      this.text = ''
      this.folderId = getFolderId(RNFetchBlob.fs.dirs.DocumentDir)
      this.limit = Constant.MESSAGE_PER_REFRESH
      this.extra = {
        lastContentHeight: 0,
        contentHeight: 0,
        count: 0,
        isRefreshingControl: false
      }

      // keyboard fix
      this.keyBoardShowCount = 0
    }

     refreshRecord = async (limit) => {
       const user = lkApp.getCurrentUser()
       let memberInfoObj
       let headerTitle
       if (this.isGroupChat) {
         const chat = await LKChatProvider.asyGetChat(lkApp.getCurrentUser().id, this.otherSideId)
         headerTitle = chat.name
         const memberAry = await LKChatProvider.asyGetGroupMembers(this.otherSideId)
         // console.log({memberAry})
         memberInfoObj = memberAry.reduce((accumulator, ele) => {
           accumulator[ele.id] = ele
           return accumulator
         }, {})
         this.otherSide = {
           memberInfoObj,
           id: this.otherSideId,
           name: headerTitle
         }
       } else {
         const otherSide = await LKContactProvider.asyGet(user.id, this.otherSideId)
         this.otherSide = otherSide
         // console.log({otherSide})
         headerTitle = otherSide.name
         // console.log({headerTitle})
       }
       const {navigation} = this.props
       navigation.setParams({
         headerTitle
       })

       const msgAry = await LKChatProvider.asyGetMsgs(user.id, this.otherSideId, limit)
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
       const imageUrls = []
       const imageIndexer = {}
       let index = 0
       for (let i = 0; i < msgAry.length; i++) {
         const record = msgAry[i]
         if (record.type === chatManager.MESSAGE_TYPE_IMAGE) {
           let img = JSON.parse(record.content)

           img.data = this.getImageData(img)

           imageUrls.push({
             url: 'file://' + img.data,
             props: {
             }
           })
           imageIndexer[record.msgId] = index
           index++
         }
       }
       this.imageIndexer = imageIndexer

       const recordAry = []
       let lastShowingTime
       const msgSet = new Set()
       for (let msg of msgAry) {
         let picSource = getAvatarSource(user.pic)
         const {sendTime, id} = msg
         if (!id) {
           console.log({noId: msg})
         }
         if (msgSet.has(id)) {
           continue
         } else {
           // console.log({id})
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
           recordAry.push(<Text style={{marginVertical: 10, color: '#a0a0a0', fontSize: 11}} key={lastShowingTime || uuid()}>{timeStr}</Text>)
         }
         const style = {
           recordEleStyle: {flexDirection: 'row', justifyContent: 'flex-start', alignItems: msg.type === chatManager.MESSAGE_TYPE_IMAGE ? 'flex-start' : 'flex-start', width: '100%', marginTop: 15}
         }
         if (msg.senderUid !== user.id) {
           // message received

           // fixme: 存在群成员不是好友的情况
           const otherSide = await LKContactProvider.asyGet(user.id, msg.senderUid)
           let otherPicSource = getAvatarSource(otherSide.pic)

           recordAry.push(<View key={id} style={style.recordEleStyle}>
             <Image source={otherPicSource} style={{width: 40, height: 40, marginLeft: 5, marginRight: 8}} resizeMode="contain"></Image>
             <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
               {this.isGroupChat
                 ? <View style={{marginBottom: 8, marginLeft: 5}}>
                   <Text style={{color: '#808080', fontSize: 13}}> {memberInfoObj[msg.senderUid].name}</Text>
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
           // console.log({sentMsg: msg})
           let iconName = getIconNameByState(msg.state)
           recordAry.push(<View key={id} style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', width: '100%', marginTop: 10}}>
             <TouchableOpacity onPress={() => {
               const option = {
                 msgId: id,
                 state: msg.state
               }
               this.doTouchMsgState(option)
             }}>
               <Ionicons name={iconName} size={20} style={{marginRight: 5, lineHeight: 40, color: msg.state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE ? 'red' : 'black'}}/>
             </TouchableOpacity>
             <View style={{maxWidth: 200, borderWidth: 0, borderColor: '#e0e0e0', backgroundColor: '#ffffff', borderRadius: 5, minHeight: 40, padding: 10, overflow: 'hidden'}}>
               {this._getMessage(msg)}
             </View>
             <Image source={chatRight} style={{width: 11, height: 18, marginTop: 11}} resizeMode="contain"></Image>
             <Image source={picSource} style={{width: 40, height: 40, marginRight: 5, marginLeft: 8}} resizeMode="contain"></Image>
           </View>)
         }
       }
       this.setState({
         recordEls: recordAry,
         refreshing: false,
         isInited: true,
         imageUrls
       })
     }

    _keyboardDidShow=(e) => {
      // console.log({e})
      this.keyBoardShowCount++
      const {height} = Dimensions.get('window')
      let keyY = e.endCoordinates.screenY
      const _f = () => {
        const headerHeight = Header.HEIGHT
        let change = {}

        if (this.extra.contentHeight + headerHeight < keyY) {
          change.msgViewHeight = keyY - headerHeight
        } else {
          // console.log({height, keyY})
          change.heightAnim = height - keyY
        }
        // console.log({change})

        this.setState(change)
      }
      if (Platform.OS === 'ios') {
        const {screenY: screenYStart} = e.startCoordinates
        // fix keyboard, in ios, event emits 3 times
        if (screenYStart === height || this.keyBoardShowCount === 3) {
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
      // todo should have scroll and message pop up animation
      const num = await chatManager.asyGetNewMsgNum(this.otherSideId)
      if (num) {
        chatManager.asyReadMsgs(this.otherSideId, num)
      }
      this.limit++
      this.refreshRecord(this.limit)
    }

    update = () => {
      this.refreshRecord(this.limit)
    }

    componentWillUnmount =() => {
      chatManager.un('msgChanged', this.msgChange)
      // console.log(this.keyboardDidShowListener, this.keyboardDidHideListener)
      // todo: could be null
      const ary = ['keyboardDidShow', 'keyboardDidHide']
      ary.forEach(ele => {
        Keyboard.removeListener(ele)
      })
    }

    componentDidMount= async () => {
      const num = await chatManager.asyGetNewMsgNum(this.otherSideId)
      if (num) {
        chatManager.asyReadMsgs(this.otherSideId, num)
      }
      chatManager.on('msgChanged', this.msgChange)
      Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
      Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)

      this.refreshRecord(this.limit)
      this.props.navigation.setParams({navigateToInfo: debounceFunc(this._navigateToInfo)})
    }

    _navigateToInfo = () => {
      if (this.isGroupChat) {
        this.props.navigation.navigate('GroupInfoView', {group: this.otherSide})
      } else {
        this.props.navigation.navigate('FriendInfoView', {friend: this.otherSide})
      }
    }

    send= async () => {
      if (this.text !== '') {
        runNetFunc(() => {
          this.refs.text2.focus()
          this.refs.text.reload()
          const channel = lkApp.getLKWSChannel()
          try {
            if (this.isGroupChat) {
              channel.sendGroupText(this.otherSideId, this.text, this.relativeMsgId)
            } else {
              channel.sendText(this.otherSideId, this.text, this.relativeMsgId)
            }
            this.text = ''
          } catch (err) {
            Alert.alert(err.toString())
          }
        }, {
          errorCb: () => {
            this.refs.text.reload(this.text)
          }
        })
      }
    }

    sendImage = ({data, width, height}) => {
      runNetFunc(() => {
        lkApp.getLKWSChannel().sendImage(this.otherSideId, data, width, height, this.relativeMsgId, this.isGroupChat).catch(err => {
          Alert.alert(err.toString())
        })
      })
    }

    showImagePicker=() => {
      let options = {
        title: '选择图片',
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照',
        chooseFromLibraryButtonTitle: '图片库',
        mediaType: 'photo',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      }

      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          let imageUri = response.uri

          const maxWidth = 1000
          const maxHeight = 1000
          ImageResizer.createResizedImage(imageUri, maxWidth, maxHeight, 'JPEG', 70, 0, null).then((res) => {
            RNFetchBlob.fs.readFile(res.path, 'base64').then((data) => {
              this.sendImage({data, width: maxWidth, height: maxHeight})
            })
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    }

    showBiggerImage= (imgUri, msgId) => {
      const biggerImageIndex = this.imageIndexer[msgId]

      this.setState({biggerImageVisible: true, biggerImageUri: imgUri, biggerImageIndex})
    }

    doTouchMsgState= ({state, msgId}) => {
      // console.log({state}, this.isGroupChat)
      if (state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE) {
        // todo: resend
      } else {
        if (this.isGroupChat && (state === chatManager.MESSAGE_STATE_TARGET_READ || state === chatManager.MESSAGE_STATE_SERVER_RECEIVE)) {
          this.props.navigation.navigate('ReadStateView', {
            msgId,
            chatId: this.otherSideId,
            group: this.otherSide
          })
        }
      }
    }

    _getMessage=(rec) => {
      let result
      if (rec.type === chatManager.MESSAGE_TYPE_TEXT) {
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
      // console.log({img})
      const {url} = img
      let result = url
      if (Platform.OS === 'ios') {
        result = url.replace(getFolderId(url), this.folderId)
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
          <NetIndicator/>
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
              alignItems: Platform.OS === 'ios' ? 'flex-end' : 'center',
              borderTopWidth: 1,
              borderColor: '#d0d0d0',
              overflow: 'hidden',
              paddingVertical: 5,
              marginBottom: Platform.OS === 'ios' ? 0 : 20}}>
              <TextInput ref='text2' style={{height: 0, width: 0, backgroundColor: 'red', display: 'none'}}></TextInput>
              <TextInputWrapper onChangeText={(v) => {
                this.text = v ? v.trim() : ''
              }} onSubmitEditing={this.send} ref='text'></TextInputWrapper>
              <TouchableOpacity onPress={this.showImagePicker}
                style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
                <Ionicons name="ios-camera-outline" size={38} style={{marginRight: 5}}/>
              </TouchableOpacity>
            </View>
          </View>

          <Modal visible={this.state.biggerImageVisible} transparent={false} animationType={'fade'}
            onRequestClose={this.closeImage}
          >
            <StatusBar hidden />
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
