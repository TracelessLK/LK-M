import SearchBar from './widget/SearchBar'
import GroupAvatar from './widget/GroupAvatar'
import ActivityIndicator from './widget/ActivityIndicator'
import List from './widget/List'
import MessageList from './widget/MessageList'
import LoadingView from './view/LoadingView'
const {ScanView, commonUtil} = require('@hfs/react-native-collection')
const updateUtil = require('./util/updateUtil')
const commonStyle = require('./view/style')

const common = {
  commonUtil,
  updateUtil,
  SearchBar,
  ScanView,
  List,
  MessageList,
  commonStyle,
  ActivityIndicator,
  LoadingView,
  GroupAvatar
}

Object.freeze(common)
module.exports = common
