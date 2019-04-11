
import React, { Component, Fragment} from 'react'
import { AndroidBackHandler } from 'react-navigation-backhandler'

export default class ScreenWrapper extends Component<{}> {
  componentDidMount() {

  }

  render() {
    return (
      <Fragment>
        {this.subRender()}
        <AndroidBackHandler onBackPress={() => {
          if (this.onBackPress) {
            this.onBackPress()
          } else {
            this.props.navigation.goBack()
          }
          return true
        }}
        />
      </Fragment>
    )
  }
}
