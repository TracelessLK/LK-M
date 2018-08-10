const commonUtil = require('./util/commonUtil')
import SearchBar from './widget/SearchBar'
import ActivityIndicator from './widget/ActivityIndicator'
import List from './widget/List'
import ScanView from './view/ScanView'
import LoadingView from './view/LoadingView'
const commonStyle = require('./view/style')

const common = {
    commonUtil,
    SearchBar,
    ScanView,
    List,
    commonStyle,
    ActivityIndicator,
    LoadingView
}

Object.freeze(common)
module.exports = common
