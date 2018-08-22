import SearchBar from './widget/SearchBar'
import GroupAvatar from './widget/GroupAvatar'
import ActivityIndicator from './widget/ActivityIndicator'
import List from './widget/List'
import MessageList from './widget/MessageList'
import ScanView from './view/ScanView'
import LoadingView from './view/LoadingView'
const commonUtil = require('./util/commonUtil')
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
