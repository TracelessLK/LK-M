
import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Platform, ScrollView, Text, TextInput, TouchableOpacity, View,
  Alert, RefreshControl,
  CameraRoll,
  StatusBar,
  AsyncStorage
} from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ImageViewer from 'react-native-image-zoom-viewer'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import {
  Toast
} from 'native-base'
import { Header } from 'react-navigation'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import RadioForm from 'react-native-simple-radio-button'

import NetIndicator from '../common/NetIndicator'
import commonStyle from '../style/common'
import style, { iconColor } from './ChatView.style'
import TransModal from './TransModal'
import TextInputWrapper from './TextInputWrapper'
import MessageItem from './MessageItem'
import DelayIndicator from './DelayIndicator'
import ScrollBottom from './ScrollBottom2'
import AudioPlay from './AudioPlay'

const { engine } = require('@lk/LK-C')
const _ = require('lodash')
const uuid = require('uuid')

const { debounceFunc, getFolderId } = require('../../../common/util/commonUtil')
const Constant = require('../state/Constant')

const Application = engine.Application
const lkApp = Application.getCurrentApp()
const chatManager = engine.ChatManager
const personImg = require('../image/person.png')
const groupImg = require('../image/group.png')
const { runNetFunc } = require('../../util')

export default class ChatView extends Component<{}> {
    static navigationOptions = ({ navigation }) => {
      const { otherSideId, isGroup } = navigation.state.params
      let headerTitle = navigation.getParam('chatName')
      headerTitle = headerTitle || ''
      let result
      if (otherSideId) {
        result = {
          headerTitle,
          headerRight: (
            <TouchableOpacity
              onPress={navigation.getParam('navigateToInfo')}
              style={commonStyle.topRightIcon}
            >
              <Image source={isGroup ? groupImg : personImg} style={commonStyle.iconImg} resizeMode="contain" />
            </TouchableOpacity>
          )
        }
      }
      return result
    }

    constructor(props) {
      super(props)
      this.minHeight = 35
      const { navigation } = this.props
      const { isGroup, otherSideId, chatName, imageAry} = navigation.state.params
      this.chatName = chatName
      this.imageAry = imageAry
      this.isGroupChat = Boolean(isGroup)
      this.originalContentHeight = Dimensions.get('window').height - Header.HEIGHT
      this.state = {
        biggerImageVisible: false,
        heightAnim: 0,
        refreshing: false,
        msgViewHeight: this.originalContentHeight,
        isInited: false,
        showVoiceRecorder: false,
        isRecording: false,
        recordTime: '',
        showMore: false,
        burnValue: {},
        showScrollBottom: false,
        showMsg: false
      }
      this.otherSideId = otherSideId
      this.text = ''
      this.folderId = null
      if (Platform.OS === 'ios') {
        this.folderId = getFolderId(RNFetchBlob.fs.dirs.DocumentDir)
      }
      this.limit = Constant.MESSAGE_PER_REFRESH
      this.extra = {
        lastContentHeight: 0,
        contentHeight: 0,
        count: 0,
        isRefreshingControl: false,
        maxCount: Constant.MESSAGE_PER_REFRESH * 3
      }
      this.audioFilePath = null

      // keyboard fix
      this.keyBoardShowCount = 0

      const audioRecorderPlayer = new AudioRecorderPlayer()
      this.audioRecorderPlayer = audioRecorderPlayer
    }

     refreshRecord = async (limit) => {
       const user = lkApp.getCurrentUser()
       const { navigation } = this.props

       const msgAry = await chatManager.getAllMsg({
         userId: user.id,
         chatId: this.otherSideId,
         limit
       })

       const imageUrls = []
       const imageIndexer = {}
       let index = 0
       for (let record of msgAry) {
         const {type, content, msgId} = record
         if (type === chatManager.MESSAGE_TYPE_IMAGE) {
           const img = JSON.parse(content)

           img.data = this.getImageData(img)

           imageUrls.push({
             url: `file://${img.data}`,
             props: {
             }
           })
           imageIndexer[msgId] = index
           index++
         }
       }
       this.imageIndexer = imageIndexer

       const recordAry = []
       let lastShowingTime
       const msgSet = new Set()
       const { length: msgLength } = msgAry

       for (let i = 0; i < msgLength; i++) {
         const msg = msgAry[i]
         let { sendTime, msgId, senderName, isSelf, pic, state, content, type, readState} = msg
         isSelf = Boolean(isSelf)
         if (!msgSet.has(msgId)) {
           msgSet.add(msgId)
           const now = new Date()
           if ((lastShowingTime && sendTime - lastShowingTime > 10 * 60 * 1000)
             || !lastShowingTime) {
             lastShowingTime = sendTime
             let timeStr = ''
             const date = new Date(lastShowingTime)
             if (now.getFullYear() === date.getFullYear()
               && now.getMonth() === date.getMonth()
               && now.getDate() === date.getDate()) {
               timeStr += '今天 '
             } else if (now.getFullYear() === date.getFullYear()) {
               timeStr += `${date.getMonth() + 1}月${date.getDate()}日 `
             }
             timeStr += `${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
             recordAry.push(<Text style={{ marginVertical: 10, color: '#a0a0a0', fontSize: 11 }} key={lastShowingTime || uuid()}>{timeStr}</Text>)
           }

           const option = {
             content,
             type,
             state,
             chatId: this.otherSideId,
             msgId,
             readState,
             senderName,
             isSelf,
             pic,
             isGroupChat: this.isGroupChat,
             onPress: msg.type === chatManager.MESSAGE_TYPE_IMAGE
               ? () => {
                 this.showBiggerImage(msgId)
               } : null,
             navigation,
             opacity: 0
           }

           recordAry.push(<MessageItem key={msgId} {...option} />)
         }
       }
       this.setState({
         recordEls: recordAry,
         refreshing: false,
         isInited: true,
         imageUrls
       })
       this.msgCount = await chatManager.getTotalCount({chatId: this.otherSideId})
     }

    _keyboardDidShow=(e) => {
      this.keyBoardShowCount++
      const { height } = Dimensions.get('window')
      const keyY = e.endCoordinates.screenY
      const _f = () => {
        const headerHeight = Header.HEIGHT
        const change = {
          showMore: false
        }

        if (this.extra.contentHeight + headerHeight < keyY) {
          change.msgViewHeight = keyY - headerHeight
        } else {
          change.heightAnim = height - keyY
        }

        this.setState(change)
      }
      if (Platform.OS === 'ios') {
        const { screenY: screenYStart } = e.startCoordinates
        // fix keyboard, in ios, event emits 3 times
        if (screenYStart === height || this.keyBoardShowCount === 3) {
          _f()
        }
      } else {
        _f()
      }
    }

    _keyboardDidHide=() => {
      this.setState({ heightAnim: 0, msgViewHeight: this.originalContentHeight })
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

    componentWillUnmount =() => {
      chatManager.un('msgListChange', this.msgChange)
      chatManager.un('groupNameChange', this.groupNameChangeListener)

      // todo: could be null
      const ary = ['keyboardDidShow', 'keyboardDidHide']
      ary.forEach((ele) => {
        Keyboard.removeListener(ele)
      })
    }

    setChatName = (chatName) => {
      this.props.navigation.setParams({
        headerTitle: chatName
      })
    }

      groupNameChangeListener = ({param}) => {
        const {chatId, name} = param
        if (chatId === this.otherSideId) {
          this.setChatName(name)
        }
      }

    componentDidMount= async () => {
      const { navigation } = this.props
      this.setChatName(navigation.state.params.chatName)

      chatManager.asyReadMsgs(this.otherSideId)
      chatManager.on('msgListChange', this.msgChange)
      chatManager.on('groupNameChange', this.groupNameChangeListener)
      Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
      Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)

      this.refreshRecord(this.limit)
      navigation.setParams({ navigateToInfo: debounceFunc(this._navigateToInfo) })
      const burnValue = await AsyncStorage.getItem('burnValue')
      this.setState({
        burnValue: JSON.parse(burnValue)
      })
    }

    _navigateToInfo = () => {
      const { navigation } = this.props
      if (this.isGroupChat) {
        navigation.navigate('GroupInfoView', {
          chatId: this.otherSideId,
          chatName: this.chatName
        })
      } else {
        navigation.navigate('FriendInfoView', {
          chatId: this.otherSideId,
          chatName: this.chatName,
          imageAry: this.imageAry
        })
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
              channel.sendGroupText(this.otherSideId, this.text, null)
            } else {
              channel.sendText(this.otherSideId, this.text, null)
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

    sendImage = ({ data, width, height }) => {
      return new Promise(resolve => {
        runNetFunc(() => {
          const result = lkApp.getLKWSChannel().sendImage(this.otherSideId, data, width, height, null, this.isGroupChat)
          resolve(result)
        })
      })
    }

    showImagePicker = () => {
      const dimension = Dimensions.get('window')
      const options = {
        title: '选择图片',
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照',
        chooseFromLibraryButtonTitle: '图片库',
        mediaType: 'photo',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        },
        maxWidth: dimension.width * 3,
        maxHeight: dimension.height * 3
      }
      ImagePicker.showImagePicker(options, async response => {
        const {didCancel, error, customButton} = response
        if (didCancel) {

        } else if (error) {
          console.error(error)
        } else if (customButton) {
        } else {
          const imageUri = response.uri
          const maxWidth = response.width
          const maxHeight = response.height

          const res = await ImageResizer.createResizedImage(imageUri, maxWidth, maxHeight, 'JPEG', 70, 0, null)
          const dataImg = await RNFetchBlob.fs.readFile(res.path, 'base64')
          await this.sendImage({ data: dataImg, width: maxWidth, height: maxHeight })
        }
      })
    }

    showBiggerImage= (msgId) => {
      const biggerImageIndex = this.imageIndexer[msgId]

      this.setState({ biggerImageVisible: true, biggerImageIndex })
    }

    getImageData = (img) => {
      const { url } = img
      const result = this.getCurrentUrl(url)

      return result
    }

    getCurrentUrl = (oldUrl) => {
      let result = oldUrl
      if (Platform.OS === 'ios') {
        result = oldUrl.replace(getFolderId(oldUrl), this.folderId)
      }
      return result
    }

    _onRefresh = async () => {
      if (this.limit > this.msgCount) {
        Toast.show({
          text: '没有更多的消息',
          position: 'top'
        })
      } else {
        this.limit = this.limit + Constant.MESSAGE_PER_REFRESH
        if (this.limit > this.extra.maxCount) {
          if (!this.state.showScrollBottom) {
            this.extra.isRefreshingControl = true
            this.setState({
              showScrollBottom: true
            })
          } else {
            Toast.show({
              text: '更早之前的消息已焚毁',
              position: 'top'
            })
          }
        } else {
          this.setState({
            refreshing: true
          })
          this.extra.isRefreshingControl = true
          this.refreshRecord(this.limit)
        }
      }
    }

    onContentSizeChange = (contentWidth, contentHeight) => {
      this.extra.lastContentHeight = this.extra.contentHeight ? this.extra.contentHeight : 0
      this.extra.contentHeight = contentHeight
      this.extra.count++
      const offset = Math.floor(this.extra.contentHeight - this.extra.lastContentHeight)

      const point = 1
      if (this.extra.count === point) {
        this.scrollView.scrollToEnd({ animated: false })
      } else if (this.extra.count > point) {
        if (this.extra.isRefreshingControl) {
          if (!this.state.showScrollBottom) {
            this.scrollView.scrollTo({ x: 0, y: offset - 40, animated: false })
          }
          this.extra.isRefreshingControl = false
        } else {
          this.scrollView.scrollToEnd({ animated: false })
        }
      }
      this.setState({
        showMsg: true
      })
    }

    closeImage = () => {
      this.setState({ biggerImageVisible: false })
    }

  showVoiceRecorder = () => {
    const { showVoiceRecorder } = this.state
    this.setState({
      showVoiceRecorder: !showVoiceRecorder
    })
  }

  record = () => {
    runNetFunc(async () => {
      this.setState({
        isRecording: true
      })
      const audioPath = Platform.select({
        ios: 'lk.m4a',
        android: 'sdcard/lk.mp4' // should give extra dir name in android. Won't grant permission to the first level of dir.
      })
      await this.audioRecorderPlayer.startRecorder(audioPath)
      this.audioRecorderPlayer.addRecordBackListener((e) => {
        const { current_position: recordTimeRaw } = e
        const time = this.audioRecorderPlayer.mmssss(Math.floor(recordTimeRaw))
        this.recordTimeRaw = recordTimeRaw
        this.setState({
          recordTime: time
        })
      })
    })
  }

  cancelRecord = async () => {
    this.refs.modal2.show()
    const filePath = await this.audioRecorderPlayer.stopRecorder()

    this.audioFilePath = Platform.select({
      ios: filePath.replace('file://', ''),
      android: 'sdcard/lk.mp4'

    })

    this.audioRecorderPlayer.removeRecordBackListener()
    this.setState({
      isRecording: false
    })
  }

  getIconButtonAry = option => option.map((ele) => {
    const { iconName, label, onPress } = ele
    return (
      <TouchableOpacity style={style.iconButtonWrap} key={iconName} onPress={onPress}>
        <View style={style.iconButton}>
          <Ionicons name={iconName} size={38} />
        </View>
        <Text style={{ color: iconColor }}>{label}</Text>
      </TouchableOpacity>
    )
  })

  render() {
    const {
      msgViewHeight, isRecording, recordTime, refreshing, recordEls, showVoiceRecorder
    } = this.state
    const size = 200
    const greyScale = 106
    const option = [{
      iconName: 'ios-camera-outline',
      label: '图片',
      onPress: this.showImagePicker
    }
    //   {
    //   iconName: 'ios-flame',
    //   label: '阅后即焚',
    //   onPress: () => {
    //     this.refs.modal.show()
    //   }
    // }
    ]
    const iconButtonAry = this.getIconButtonAry(option)
    const contentView = (
      <View style={{ backgroundColor: '#f0f0f0', height: msgViewHeight }}>
        {isRecording
          ? (
            <View style={{
              position: 'absolute', justifyContent: 'center', alignItems: 'center', width: '100%', top: '25%', zIndex: 2
            }}
            >
              <View style={{
                width: size,
                height: size,
                backgroundColor: `rgba(${greyScale}, ${greyScale}, ${greyScale}, 0.9)`,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5
              }}
              >
                <Ionicons name="ios-mic-outline" size={45} color="white" />
                <View>
                  <Text style={{ fontSize: 15, color: 'white' }}>
                    正在录音...
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 20, color: 'white' }}>
                    {recordTime}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        <NetIndicator />

        <View style={{
          flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', bottom: this.state.heightAnim
        }}
        >

          <ScrollView
            ref={(ref) => { this.scrollView = ref }}
            style={{ width: '100%', backgroundColor: '#d5e0f2' }}
            refreshControl={(
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this._onRefresh}
              />
            )}
            onContentSizeChange={this.onContentSizeChange}
          >

            <View style={{
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: 20,
              opacity: this.state.showMsg ? 1 : 0
            }}
            >
              {this.state.showScrollBottom ? <ScrollBottom /> : null}
              {recordEls}
            </View>
          </ScrollView>
          <View style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopWidth: 1,
            borderColor: '#d0d0d0',
            overflow: 'hidden',
            paddingVertical: 5,
            marginBottom: Platform.OS === 'ios' ? 0 : 20
          }}
          >
            <TouchableOpacity
              onPress={this.showVoiceRecorder}
              style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center', borderWidth: 0
              }}
            >
              <View style={{
                borderRadius: 17,
                borderWidth: 1,
                width: 34,
                height: 34,
                marginHorizontal: 2,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: iconColor
              }}
              >

                <Ionicons
                  name={showVoiceRecorder ? 'ios-keypad-outline' : 'ios-mic-outline'}
                  size={25}
                  color={iconColor}
                  style={{}}
                />
              </View>

            </TouchableOpacity>
            <TextInput
              ref="text2"
              style={{
                height: 0, width: 0, backgroundColor: 'red', display: 'none'
              }}
            />
            {showVoiceRecorder ? (
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: '#a0a0a0',
                  padding: 10,
                  marginHorizontal: 5
                }}
                onPressIn={this.record}
                onPressOut={this.cancelRecord}
                hitSlop={{
                  top: 500, left: 0, bottom: 100, right: 0
                }}
              >
                <Text>按住说话</Text>
              </TouchableOpacity>
            ) : (
              <TextInputWrapper
                onChangeText={(v) => {
                  this.text = v ? v.trim() : ''
                }}
                onSubmitEditing={this.send}
                ref="text"
                textInputProp={{
                  placeholder: this.state.burnValue ? `本消息会在${this.state.burnValue.label}阅后即焚` : ''
                }}
              />
            )}

            <TouchableOpacity
              onPress={() => { this.setState({ showMore: !this.state.showMore }) }}
              style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            >
              <Ionicons name="ios-add-circle-outline" size={40} style={{ marginRight: 5 }} color={iconColor} />
            </TouchableOpacity>
          </View>
          {this.state.showMore ? (
            <View style={{
              marginBottom: 20, flexDirection: 'row', justifyContent: 'space-around', width: '100%'
            }}
            >
              {iconButtonAry}
            </View>
          ) : null}
        </View>
        <Modal
          visible={this.state.biggerImageVisible}
          transparent={false}
          animationType="fade"
          onRequestClose={this.closeImage}
        >
          <StatusBar hidden />
          <ImageViewer
            imageUrls={this.state.imageUrls}
            onClick={this.closeImage}
            onSave={(url) => {
              CameraRoll.saveToCameraRoll(url)
              // todo: toast will be overlapped
              Alert.alert(
                '',
                '图片成功保存到系统相册',

                { cancelable: true }
              )
            }}
            index={this.state.biggerImageIndex}
          />
        </Modal>

        <TransModal
          title="设置阅后即焚时长"
          ref="modal"
          confirm={async () => {
            await AsyncStorage.setItem('burnValue', JSON.stringify(this.radioValue))
            this.setState({
              burnValue: this.radioValue
            })
          }
          }
        >
          <View style={{ alignItems: 'flex-start', justifyContent: 'space-around', marginLeft: 10 }}>
            <RadioForm
              radio_props={[
                {
                  label: '关闭',
                  value: {
                    label: '关闭',
                    time: 0
                  }
                },
                {
                  label: '自定义',
                  value: {
                    label: '自定义',
                    time: -1
                  }
                },
                {
                  label: '3 秒',
                  value: {
                    label: '3秒',
                    time: 3
                  }
                }
              ]}
              initial={0}
              onPress={(value) => { this.radioValue = value }}
              labelStyle={
                  { marginHorizontal: 20 }
                }
              radioStyle={{ marginVertical: 15 }}
            />
          </View>

        </TransModal>
        <TransModal
          ref="modal2"
          title="发送语音"
          confirm={async () => {
            if (this.audioFilePath) {
              RNFetchBlob.fs.readFile(this.audioFilePath, 'base64').then((data) => {
                const ext = _.last(this.audioFilePath.split('.'))
                lkApp.getLKWSChannel().sendAudio(this.otherSideId, data, ext, this.recordTimeRaw, null,
                  this.isGroupChat)
                  .catch((err) => {
                    Alert.alert(err.toString())
                  })
              })
            } else {
              Alert.alert('录音失败,请重试!')
            }

            this.setState({
              recordTime: ''
            })
          }
                    }
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={style.iconButtonWrap} onPress={() => {}}>
              <View>
                <View style={[style.iconButton, {
                  backgroundColor: '#f0f0f0', marginVertical: 5
                }]}
                >
                  <AudioPlay url={this.audioFilePath} />
                </View>
                <Text>{this.state.recordTime}</Text>
              </View>

              <Text style={{ color: iconColor }}>点击试听</Text>
            </TouchableOpacity>
          </View>
        </TransModal>
      </View>
    )
    const loadingView = <DelayIndicator />
    return this.state.isInited ? contentView : loadingView
  }
}
