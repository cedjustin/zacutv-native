import React from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    ScrollView,
    AsyncStorage
} from 'react-native';
import {
    Text,
    Headline,
    TextInput,
    Card,
    Subheading,
    TouchableRipple,
    Button,
    HelperText
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Header } from 'react-navigation';
//global components
import Colors from '../../../global/colors';
import Config from '../../../global/config';




export default class SignUPFirstPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            phone: null,
            Fname: null,
            Sname: null,
            email: '',
            password: null,
            cpassword: null,
            checked: 'basic',
            message: null,
            showAlert: false,
            rootUrl: Config.rootUrl,
            appId: Config.appId,
            appKey: Config.appKey,
        })
    }

    //pageHeader
    static navigationOptions = {
        headerTintColor: '#fcfaf1',
        headerStyle: {
            backgroundColor: Colors.primary.default,
            elevation: 0
        },
    };


    _activePlan = (activePlan) => {
        this.setState({ plan: activePlan })
    }

    _register = async () => {
        if (this.state.Fname == null || this.state.Sname == null || this.state.email == null || this.state.password == null || this.state.cpassword == null || this.state.phone == null) {
            this.setState({ showAlert: true });
            this.setState({ message: 'Fill all the fields' })
        }
        else if (this.state.password != this.state.cpassword) {
            this.setState({ showAlert: true });
            this.setState({ message: 'Passwords doesnt match' })
        }
        else {
            var loginRequestResponse;
            await fetch(this.state.rootUrl + '/api/create-account', {
                method: 'POST',
                headers: {
                    appId: this.state.appId,
                    appKey: this.state.appKey,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.Fname,
                    last_name: this.state.Sname,
                    email: this.state.email,
                    phone: this.state.phone,
                    password: this.state.password,
                    password_confirmation: this.state.cpassword
                })
            }).then((res) =>
                loginRequestResponse = res.json(),
            )
            this.setState({ Response: loginRequestResponse })
            if (typeof this.state.Response._55.message != 'undefined') {
                this.setState({ message: this.state.Response._55.message });
                this.setState({ showAlert: true });
            }
            else {
                try {
                    AsyncStorage.setItem('logginKey', this.state.Response._55.token);
                    AsyncStorage.setItem('userInfo', JSON.stringify(this.state.Response._55.user))
                    this.props.navigation.navigate('LoggedIn', this.state.Response._55.user);
                    // alert(JSON.stringify(this.state.Response._55.token, null, 4))
                }
                catch (error) {
                    // alert('data not saved' + error);
                }
            }
        }
    }

    render() {
        const { checked } = this.state;
        const { showAlert } = this.state;
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior='padding'
                    keyboardVerticalOffset={Header.HEIGHT + 40}
                    style={{ flex: 1, width: '100%', height: '100%' }}
                >
                    <ScrollView>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Headline style={{ color: Colors.activeText.default }}>
                                Welcome to ZacuTV
                            </Headline>
                            <Subheading style={{ color: Colors.activeText.default }}>
                                Where you can watch all movies in one place!
                            </Subheading>
                            <Text style={{ color: Colors.dimActiveText.default }}>
                                Subscribe to watch
                            </Text>
                        </View>
                        <Card style={{ margin: 20 }}>
                            <Card.Content>
                                <View>
                                    <Text style={{ color: Colors.activeTextDark.default }}>Personal info</Text>
                                </View>
                                <View style={[{ margin: 10 }, styles.row]}>
                                    <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name='ios-person' color={Colors.activeTextDark.default} size={20} />
                                    </View>
                                    <View style={{ width: '80%' }}>
                                        <TextInput
                                            label='First name'
                                            value={this.state.text}
                                            onChangeText={Fname => this.setState({ Fname })}
                                            style={{ backgroundColor: Colors.activeText.default }}
                                            onSubmitEditing={() => this.Sname.focus()}
                                            autoFocus
                                            returnKeyType='next'
                                        />
                                        <HelperText
                                            type="info"
                                            visible={this.state.Fname == null}
                                        >
                                            You must provide your First name!
                                        </HelperText>
                                    </View>
                                </View>
                                <View style={[{ margin: 10 }, styles.row]}>
                                    <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name='ios-person' color={Colors.activeTextDark.default} size={20} />
                                    </View>
                                    <View style={{ width: '80%' }}>
                                        <TextInput
                                            label='Last name'
                                            value={this.state.text}
                                            onChangeText={Sname => this.setState({ Sname })}
                                            style={{ backgroundColor: Colors.activeText.default }}
                                            ref={(input) => this.Sname = input}
                                            onSubmitEditing={() => this.phone.focus()}
                                            returnKeyType='next'
                                        />
                                        <HelperText
                                            type="info"
                                            visible={this.state.Sname == null}
                                        >
                                            You must provide your Last name!
                                        </HelperText>
                                    </View>
                                </View>
                                <View style={[{ margin: 10 }, styles.row]}>
                                    <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name='ios-phone-portrait' color={Colors.activeTextDark.default} size={20} />
                                    </View>
                                    <View style={{ width: '80%' }}>
                                        <TextInput
                                            label='Phone number'
                                            value={this.state.text}
                                            onChangeText={phone => this.setState({ phone })}
                                            style={{ backgroundColor: Colors.activeText.default }}
                                            onSubmitEditing={() => this.email.focus()}
                                            ref={(input) => this.phone = input}
                                            keyboardType='phone-pad'
                                            returnKeyType='next'
                                        />
                                        <HelperText
                                            type="info"
                                            visible={this.state.phone == null}
                                        >
                                            You must provide your phone!
                                        </HelperText>
                                    </View>
                                </View>
                                <View>
                                    <Text style={{ color: Colors.activeTextDark.default }}>Credentials</Text>
                                </View>
                                <View style={[{ margin: 10 }, styles.row]}>
                                    <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name='ios-mail' color={Colors.activeTextDark.default} size={20} />
                                    </View>
                                    <View style={{ width: '80%' }}>
                                        <TextInput
                                            label='E-mail'
                                            value={this.state.text}
                                            onChangeText={email => this.setState({ email })}
                                            style={{ backgroundColor: Colors.activeText.default }}
                                            onSubmitEditing={() => this.password.focus()}
                                            ref={(input) => this.email = input}
                                            keyboardType='email-address'
                                            returnKeyType='next'
                                        />
                                        <HelperText
                                            type="info"
                                            visible={!this.state.email.includes('@')}
                                        >
                                            Please provide a valid email!
                                        </HelperText>
                                    </View>
                                </View>
                                <View style={[{ margin: 10 }, styles.row]}>
                                    <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name='md-key' color={Colors.activeTextDark.default} size={20} />
                                    </View>
                                    <View style={{ width: '80%' }}>
                                        <TextInput
                                            label='Password'
                                            value={this.state.text}
                                            onChangeText={password => this.setState({ password })}
                                            style={{ backgroundColor: Colors.activeText.default }}
                                            autoCapitalize='none'
                                            secureTextEntry
                                            onSubmitEditing={() => this.cpassword.focus()}
                                            ref={(input) => this.password = input}
                                            returnKeyType='next'
                                        />
                                    </View>
                                </View>
                                <View style={[{ margin: 10 }, styles.row]}>
                                    <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Ionicons name='md-key' color={Colors.activeTextDark.default} size={20} />
                                    </View>
                                    <View style={{ width: '80%' }}>
                                        <TextInput
                                            label='Confirm password'
                                            value={this.state.text}
                                            onChangeText={cpassword => this.setState({ cpassword })}
                                            style={{ backgroundColor: Colors.activeText.default }}
                                            autoCapitalize='none'
                                            secureTextEntry
                                            ref={(input) => this.cpassword = input}
                                            returnKeyType='send'
                                        />
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: Colors.activeText.default }}>By signing up,you agree to our</Text><TouchableRipple><Text style={{ color: Colors.activeAccentText.default }}>Terms and Conditions</Text></TouchableRipple>
                            <TouchableRipple>
                                <Button style={{ backgroundColor: Colors.activeText.default, borderRadius: 100, margin: 20 }} onPress={() => this._register()}>
                                    <Text>Register</Text>
                                </Button>
                            </TouchableRipple>
                        </View>
                    </ScrollView>
                    <AwesomeAlert
                        show={showAlert}
                        onDismiss={() => this.setState({ showAlert: false })}
                        showProgress={false}
                        message={this.state.message}
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={false}
                        cancelText="Login"
                        confirmText="Register"
                        confirmButtonColor={Colors.activeAccentText.default}
                        cancelButtonColor="#1a1a1a"
                        onDismiss={() => this.setState({ showAlert: false })}
                    />
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary.default,
        flex: 1
    },
    row: {
        flexDirection: 'row'
    }
})