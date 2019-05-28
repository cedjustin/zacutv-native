/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Image, View, StatusBar, Dimensions, Text } from 'react-native';
import colorPalette from './global/color';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = ({
      loaded: false
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loaded: true
      })
    }, 3000);
  }


  render() {
    if (this.state.loaded == false) {
      return (
        <View style={styles.container}>
          <StatusBar barStyle='light-content' backgroundColor={colorPalette.primary} />
          <Image source={require('./images/splash.png')} resizeMode='cover' style={styles.splash} />
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <StatusBar barStyle='light-content' backgroundColor={colorPalette.primary} />
          <Text style={styles.text}>
            heeeey
        </Text>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorPalette.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: colorPalette.text
  },
  splash: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
