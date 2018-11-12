import React, {Component} from 'react'
import {
  Text, TouchableOpacity,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import RNFetchBlob from 'react-native-fetch-blob'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
const _ = require('lodash')

export default class AudioPlay extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
      toggle: true
    }
    this.lastTime = 0
    this.interval = 100 * 2
    this.audioRecorderPlayer = new AudioRecorderPlayer()
  }

  render () {
    let {url, id} = this.props
    return (
      <TouchableOpacity style={{width: 60, alignItems: 'center', justifyContent: 'center'}}
        key = {id}
        onPress={async () => {
          this.audioRecorderPlayer.removePlayBackListener()

          this.audioRecorderPlayer.addPlayBackListener((e) => {
            // console.log({e})
            const {current_position: currentPosition, duration} = e
            if (currentPosition - this.lastTime > this.interval) {
              this.setState({
                toggle: !this.state.toggle
              })
              this.lastTime = currentPosition
            }

            if (currentPosition === duration) {
              // console.log({id})
              this.audioRecorderPlayer.stopPlayer().catch(err=> {
                // console.log({err})
              })
              console.log({id})
              this.audioRecorderPlayer.removePlayBackListener()
              this.lastTime = 0
              this.setState({
                toggle: true
              })
            }
          })
          const ary = url.split('Documents')
          const baseUrl = ary[0]
          const fileName = _.last(ary[1].split('audio')[1].split('/'))
          const destination = `/private${baseUrl}tmp/${fileName}`
          // console.log({url})
          const exist = await RNFetchBlob.fs.exists(destination)
          // console.log({exist})
          if (!exist) {
            const data = await RNFetchBlob.fs.readFile(url, 'base64')
            // console.log(data)
            await RNFetchBlob.fs.writeFile(destination, data, 'base64')
          }

          // console.log({baseUrl, fileName, destination})
          // console.log({exist})
          await this.audioRecorderPlayer.startPlayer(fileName)
        }}
      >
        <View style={{width: 35, alignItems: 'flex-start', justifyContent: 'center'}}>
          <Ionicons name={this.state.toggle ? 'ios-volume-up-outline' : 'ios-volume-down-outline'} size={35}
            style={{marginRight: 5, lineHeight: 35, color: '#a0a0a0'}}></Ionicons>
        </View>

      </TouchableOpacity>
    )
  }
}

AudioPlay.defaultProps = {

}

AudioPlay.propTypes = {
  url: PropTypes.string.isRequired,
  id: PropTypes.string
}
