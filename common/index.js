import SearchBar from './widget/SearchBar'
import GroupAvatar from './widget/GroupAvatar'
import ActivityIndicator from './widget/ActivityIndicator'
import List from './widget/List'
import MessageList from './widget/MessageList'
import LoadingView from './view/LoadingView'
const commonModule = require('@hfs/react-native-collection')
const {ScanView, commonUtil} = commonModule
const pushUtil = require('./util/pushUtil')

const commonStyle = require('./view/style')
const common = {
  commonUtil,
  SearchBar,
  ScanView,
  List,
  MessageList,
  commonStyle,
  ActivityIndicator,
  LoadingView,
  GroupAvatar,
  pushUtil
}

Object.freeze(common)
module.exports = common
