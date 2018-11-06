import PropTypes from 'prop-types'
import React from 'react'
import { Linking, StyleSheet, Text, View, ViewPropTypes } from 'react-native'

import ParsedText from 'react-native-parsed-text'
import Communications from 'react-native-communications'
import {
  Toast,
  ActionSheet
} from 'native-base'

const WWW_URL_PATTERN = /^www\./i

export default class MessageText extends React.Component {
  shouldComponentUpdate (nextProps) {
    return this.props.currentMessage.text !== nextProps.currentMessage.text
  }

    onUrlPress = (url) => {
      if (WWW_URL_PATTERN.test(url)) {
        this.onUrlPress(`http://${url}`)
      } else {
        Linking.canOpenURL(url).then((supported) => {
          if (!supported) {
            Toast.show({
              text: `${url}不是有效的网址`,
              position: 'top',
              type: 'warning',
              duration: 3000
            })
          } else {
            Linking.openURL(url)
          }
        })
      }
    }

    onPhonePress = (phone) => {
      const options = ['呼叫', '短信', '取消']
      const cancelButtonIndex = options.length - 1

      ActionSheet.show(
        {
          options,
          cancelButtonIndex,
          title: ''
        },
        buttonIndex => {
          switch (buttonIndex) {
            case 0:
              Communications.phonecall(phone, true)
              break
            case 1:
              Communications.text(phone)
              break
            default:
              break
          }
        }
      )
    }

    onEmailPress = (email) => {
      Communications.email([email], null, null, null, null)
    }

    render () {
      const linkStyle = StyleSheet.flatten([styles.link, this.props.linkStyle])
      return (
        <View style={[styles.container, this.props.containerStyle]}>
          <ParsedText selectable
            style={[
              styles.text,
              this.props.textStyle
            ]}
            parse={[
              ...this.props.parsePatterns(linkStyle),
              { type: 'url', style: linkStyle, onPress: this.onUrlPress },
              { type: 'phone', style: linkStyle, onPress: this.onPhonePress },
              { type: 'email', style: linkStyle, onPress: this.onEmailPress }
            ]}
            childrenProps={{ ...this.props.textProps }}
          >
            {this.props.currentMessage.text}
          </ParsedText>
        </View>
      )
    }
}

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10
}

const styles = {
  container: {},
  text: {
    color: 'black',
    ...textStyle
  },
  link: {
    color: 'black',
    textDecorationLine: 'underline'
  }
}

MessageText.contextTypes = {
  actionSheet: PropTypes.func
}

MessageText.defaultProps = {
  currentMessage: {
    text: ''
  },
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
  textProps: {},
  parsePatterns: () => []
}

MessageText.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  linkStyle: Text.propTypes.style,
  parsePatterns: PropTypes.func,
  textProps: PropTypes.object
}
