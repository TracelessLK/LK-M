const commonUtil = require('./util/commonUtil')
import SearchBar from './widget/SearchBar'
import ActivityIndicator from './widget/ActivityIndicator'
import List from './widget/List'
import ScanView from './view/ScanView'
const commonStyle = require('./view/style')

const common = {
    commonUtil,
    SearchBar,
    ScanView,
    List,
    commonStyle,
    ActivityIndicator
}

Object.freeze(common)
module.exports = common
