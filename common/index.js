import SearchBar from './widget/SearchBar'
import GroupAvatar from './widget/GroupAvatar'
import ActivityIndicator from './widget/ActivityIndicator'
import List from './widget/List'
import MessageList from './widget/MessageList'
import LoadingView from './view/LoadingView'
const commonUtil = require('./util/commonUtil')
const PushUtil = require('./util/PushUtil')

const commonStyle = require('./view/style')
const common = {
  commonUtil,
  SearchBar,
  List,
  MessageList,
  commonStyle,
  ActivityIndicator,
  LoadingView,
  GroupAvatar,
  PushUtil
}

Object.freeze(common)
module.exports = common
