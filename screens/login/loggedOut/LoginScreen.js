import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ImageBackground,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  AsyncStorage
} from 'react-native';
import {
  Title,
  Button,
  TouchableRipple,
  Text,
  Divider
} from 'react-native-paper'
import Icon from 'react-native-vector-icons/Feather';
import AwesomeAlert from 'react-native-awesome-alerts';
//global components
import Colors from '../../../global/colors';
import Config from '../../../global/config';



const AddButton = (props) => {
  return (
    <View style={{ width: Dimensions.get('window').width / 4 - 30 }} >
      <TouchableRipple onPress={() => { props.navigation.navigate('SignUp') }} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name='user-plus' size={20} style={{ color: '#ecf0f1', paddingRight: 10 }} />
      </TouchableRipple>
    </View>
  )
}

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      rootUrl: Config.rootUrl,
      appId: Config.appId,
      appKey: Config.appKey,
      Response: [],
      message: null,
      Email: null,
      Password: null,
      showAlert: false
    })
  }

  //pageHeader
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerTintColor: '#fcfaf1',
    headerStyle: {
      backgroundColor: '#1c1f24'
    },
    // headerRight: <AddButton navigation={navigation} />
  });

  _login = async () => {
    if (this.state.Email == null || this.state.Password == null) {
      // this.setState({message:'Fill all the forms first'});       
      // this.setState({showAlert:true});
    }
    else {
      var loginRequestResponse;
      await fetch(this.state.rootUrl + '/api/login', {
        method: 'POST',
        headers: {
          appId: this.state.appId,
          appKey: this.state.appKey,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.Email,
          password: this.state.Password
        })
      }).then((res) =>
        loginRequestResponse = res.json()
      )
      this.setState({ Response: loginRequestResponse })
      if (typeof this.state.Response._55.message != 'undefined') {
        this.setState({ message: this.state.Response._55.message });
        this.setState({ showAlert: true });
      }
      else if (this.state.Response._55.user.activated === "1") {
        try {
          //setting that the user is loggedIn for the first time
          AsyncStorage.setItem('logginStatus', '1');
          AsyncStorage.setItem('logginKey', this.state.Response._55.token);
          AsyncStorage.setItem('userInfo', JSON.stringify(this.state.Response._55.user));
          this.props.navigation.navigate('LoggedIn');
        }
        catch (error) {
        }
      }
    }
  }

  _forgot_password = () => {
    this.props.navigation.navigate('ForgotPassword')
  }

  render() {
    const { showAlert } = this.state;
    return (
      <ImageBackground source={require('../../../assets/images/imgbackground.png')} style={styles.container}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='#000'
        />
        <KeyboardAvoidingView style={{ width: '100%', height: '100%' }} behavior='padding'>
          <View style={styles.icon_container}>
            <Title style={styles.text}>
              We are committed to bring you the latest local movies to your hand!
              </Title>
          </View>
          <View>
            <View style={styles.input_container}>
              <View style={styles.white_input_container}>
                <View style={styles.row}>
                  <Icon name='mail' color='#354656' size={15} />
                  <TextInput
                    placeholder='Email'
                    placeholderTextColor='#bdc3c7'
                    returnKeyType='next'
                    onSubmitEditing={() => this.passwordInput.focus()}
                    underlineColorAndroid='transparent'
                    style={styles.input}
                    onChangeText={(Email) => this.setState({ Email })}
                    value={this.state.Email}
                  />
                </View>
                <Divider style={styles.divider} />
                <View style={styles.row}>
                  <Icon name='lock' color='#354656' size={15} />
                  <TextInput
                    placeholder='Password'
                    placeholderTextColor='#bdc3c7'
                    secureTextEntry
                    returnKeyType='go'
                    ref={(input) => this.passwordInput = input}
                    onSubmitEditing={() => this._login()}
                    underlineColorAndroid='transparent'
                    style={styles.input}
                    onChangeText={(Password) => this.setState({ Password })}
                    value={this.state.Password}
                    autoCapitalize='none'
                  />
                </View>
              </View>
              <View style={styles.row}>
                <Button mode='contained' style={styles.button} onPress={() => this._login()}>
                  <Text style={styles.textLight}>Login</Text>
                </Button>
              </View>
              <View style={styles.lpart}>
                <View style={styles.chip}>
                  <TouchableRipple
                    onPress={() => this._forgot_password()}
                    style={{ marginLeft: 5 }}
                  >
                    <Text style={{ color: '#ecf0f1' }}>Forgot Your Password?</Text>
                  </TouchableRipple>
                  <TouchableRipple onPress={() => this.props.navigation.navigate('SignUp')}>
                    <Text style={{ color: '#fe5900' }}> Register</Text>
                  </TouchableRipple>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          message={this.state.message}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={false}
          onDismiss={() => this.setState({ showAlert: false })}
          cancelText="Login"
          confirmText="Register"
          confirmButtonColor={Colors.activeAccentText.default}
          cancelButtonColor="#1a1a1a"
        />
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1f24',
  },
  icon_container: {
    justifyContent: 'center',
    flexGrow: 1,
    alignItems: 'center'
  },
  icon: {
    width: 100,
    height: 100
  },
  text: {
    color: '#ecf0f1',
    textAlign: 'center',
    padding: 10
  },
  textLight: {
    color: Colors.activeTextDark.default,
    textAlign: 'center',
    padding: 10
  },
  white_input_container: {
    backgroundColor: Colors.activeText.default,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input_container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: '70%',
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#1c1f24',
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 15
  },
  divider: {
    backgroundColor: '#354656',
    width: '90%',
    margin: 5,
  },
  button: {
    backgroundColor: Colors.activeText.default,
    marginTop: 10,
    height: 'auto',
    width: 'auto',
    borderRadius: 100,
    alignContent: 'center',
    justifyContent: 'center'
  },
  lpart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
