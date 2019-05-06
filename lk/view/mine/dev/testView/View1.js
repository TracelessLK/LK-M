import React from 'react'
import {
  View,
  ScrollView
} from 'react-native'
//import PropTypes from 'prop-types'
//import LottieView from 'lottie-react-native'
import {ListItem} from 'react-native-elements'
import ScreenWrapper from '../../../common/ScreenWrapper'

const obj = {
  '9squares-AlBoardman': require('../../../../../resource/animations/9squares-AlBoardman.json'),
  HamburgerArrow: require('../../../../../resource/animations/HamburgerArrow.json'),
  LineAnimation: require('../../../../../resource/animations/LineAnimation.json'),
  LottieLogo1: require('../../../../../resource/animations/LottieLogo1.json'),
  LottieLogo2: require('../../../../../resource/animations/LottieLogo2.json'),
  LottieWalkthrough: require('../../../../../resource/animations/LottieWalkthrough.json'),
  'MotionCorpse-Jrcanest': require('../../../../../resource/animations/MotionCorpse-Jrcanest.json'),
  PinJump: require('../../../../../resource/animations/PinJump.json'),
  TwitterHeart: require('../../../../../resource/animations/TwitterHeart.json'),
  Watermelon: require('../../../../../resource/animations/Watermelon.json'),
  loading2: require('../../../../../resource/animations/loading2.json'),
  loading: require('../../../../../resource/animations/loading.json'),
  sending: require('../../../../../resource/animations/sending.json'),
  listening: require('../../../../../resource/animations/listening.json'),
  loader: require('../../../../../resource/animations/loader.json')
}
const ary = Object.keys(obj)


export default class View1 extends ScreenWrapper {
  constructor(props) {
    super(props)
    this.state = {
      animation: obj[ary[1]]
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  subRender() {
    const eleAry = ary.map(ele => {
      return (
        <ListItem key={ele} title={ele} onPress={() => {
          this.props.navigation.navigate('TestView3', {
            source: obj[ele]
          })
        }}/>
      )
    })
    return (
      <ScrollView>
        <View style={{}}>
          {eleAry}
        </View>
      </ScrollView>
    )
  }
}

View1.defaultProps = {}

View1.propTypes = {}
