import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import {
  Title,
} from 'react-native-paper'
import {
  PulseIndicator
} from 'react-native-indicators';
import Colors from '../../global/colors';

export default class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data:this.props.navigation.state.params
    }
    this._loadApp()
  }

  //pageHeader
  static navigationOptions = {
    headerTintColor: '#fcfaf1',
    headerTransparent: true,
    headerStyle: {
      backgroundColor: Colors.primary.default
    },
  };

  _loadApp = async () => {
    const value = await AsyncStorage.getItem('logginKey');
    if(value == null){
      await AsyncStorage.setItem('logginKey','loggedOut');
      this.props.navigation.navigate('LoginPage');
    }
    else if (value == 'loggedOut') {
      this.props.navigation.navigate('LoginPage');
    }
    else if (value != 'loggedOut' && value != null){
      this.props.navigation.navigate('LoggedIn');
    }
    else if (value != 'loggedOut' && value != null) {
      this.props.navigation.navigate('LoggedIn');
    }
    else {
      this.props.navigation.navigate('LoginPage');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <PulseIndicator color={Colors.activeText.default} size={30} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.default,
    justifyContent: 'center',
    alignItems: 'center'
  },
});