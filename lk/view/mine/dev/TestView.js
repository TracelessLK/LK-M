import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import {
  Button
} from 'native-base'
import PropTypes from 'prop-types'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'

export default class TestView extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    return (
      <View>
        <Button info onPress={async () => {
          const audioRecorderPlayer = new AudioRecorderPlayer()
          this.audioRecorderPlayer = audioRecorderPlayer
          console.log({audioRecorderPlayer}, typeof audioRecorderPlayer)
          const result = await audioRecorderPlayer.startRecorder()
          audioRecorderPlayer.addRecordBackListener((e) => {
            console.log({e})
          })
          console.log(result)
        }} style={{width: 200 }}>
          <Text>start</Text>
        </Button>
        <Button info onPress={async () => {
          const result = await this.audioRecorderPlayer.stopRecorder()
          this.audioRecorderPlayer.removeRecordBackListener()

          console.log(result)
        }} style={{width: 200, marginVertical: 20}}>
          <Text>end</Text>
        </Button>
        <Button info onPress={async () => {
          console.log('onStartPlay')
          const msg = await this.audioRecorderPlayer.startPlayer()
          console.log(msg)
          this.audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.current_position === e.duration) {
              console.log('finished')
              this.audioRecorderPlayer.stopPlayer()
            }
          })
        }} style={{width: 200, marginVertical: 20}}>
          <Text>play</Text>
        </Button>
        <Button info onPress={async () => {
          await this.audioRecorderPlayer.pausePlayer()
        }} style={{width: 200, marginVertical: 20}}>
          <Text>pause</Text>
        </Button>
        <Button info onPress={async () => {
          console.log('onStopPlay')
          this.audioRecorderPlayer.stopPlayer()
          this.audioRecorderPlayer.removePlayBackListener()
        }} style={{width: 200, marginVertical: 20}}>
          <Text>stop</Text>
        </Button>
      </View>
    )
  }
}

TestView.defaultProps = {}

TestView.propTypes = {}
