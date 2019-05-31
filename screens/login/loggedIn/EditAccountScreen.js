import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    KeyboardAvoidingView,
    StatusBar,
    FlatList,
    ImageBackground
} from 'react-native';
import {
    List,
    Card,
    Button,
    Text,
    TextInput,
    RadioButton,
    TouchableRipple,
    Title
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header } from 'react-navigation';
import AwesomeAlert from 'react-native-awesome-alerts';
//global components
import Colors from '../../../global/colors';
import Config from '../../../global/config';


export default class EditAccountScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            rootUrl: Config.rootUrl,
            appId: Config.appId,
            appKey: Config.appKey,
            data: this.props.navigation.state.params,
            visible: false,
            checked: 'basic',
            Fname: null,
            Sname: null,
            phone: null,
            plansData: [],
            showAlert: false,
            plansLoader: true
        })
    }

    static navigationOptions = {
        headerTransparent: false,
        headerTintColor: '#fcfaf1',
        headerStyle: {
            backgroundColor: Colors.primary.default,
            elevation: 0
        }
    };

    //calling fetchdata
    componentDidMount() {
        this._fecthPlans()
        this.setState({ Fname: this.state.data.name, Sname: this.state.data.last_name, phone: this.state.data.phone })
        if (this.state.data.subscription_plan == 1) {
            this.setState({ checked: 'No Subcription' })
        }
        else if (this.state.data.subscription_plan == 2) {
            this.setState({ checked: 'basic' })
        }
        else if (this.state.data.subscription_plan == 3) {
            this.setState({ checked: 'Standard' })
        }
        else if (this.state.data.subscription_plan == 4) {
            this.setState({ checked: 'Premium' })
        }
        StatusBar.setHidden(false);
    }


    //fetch plans
    _fecthPlans = async () => {
        const plansJson = await fetch(this.state.rootUrl + '/api/get-plans', {
            method: 'POST',
            headers: {
                appId: this.state.appId,
                appKey: this.state.appKey
            }
        })
        const plansResponse = await plansJson.json();
        var array = [];
        array.push({
            data: plansResponse
        })
        // alert(JSON.stringify(array, null, 4));
        this.setState({ plansData: array, plansLoader: false });
    }

    _save = async () => {
        if (this.state.Fname == null || this.state.Sname == null || this.state.phone == null) {
            this.setState({ message: 'Fill all the forms first' });
            this.setState({ showAlert: true });
        }
        else {
            var loginRequestResponse;
            await fetch(this.state.rootUrl + '/api/update-profile', {
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
                    phone: this.state.phone
                })
            }).then((res) =>
                loginRequestResponse = res.json()
            )
            this.setState({ Response: loginRequestResponse })
            if (typeof this.state.Response._55.message != 'undefined') {
                this.setState({ message: this.state.Response._55.message });
                this.setState({ showAlert: true });
            }
            else {
                try {
                    //   AsyncStorage.setItem('logginKey',this.state.Response._55.token);
                    //   AsyncStorage.setItem('userInfo',JSON.stringify(this.state.Response._55.user))
                    //   this.props.navigation.navigate('LoggedIn',this.state.Response._55.user);
                    //   alert(JSON.stringify(this.state.Response, null, 4))
                }
                catch (error) {
                    //   alert('data not saved'+error);
                }
            }
        }
    }

    _activePlan = (activePlan) => {
        this.setState({ plan: activePlan })
    }

    _cancel = async () => {
        this.props.navigation.navigate('Account');
    }

    render() {
        const { checked } = this.state;
        const { showAlert } = this.state;
        return (
            <ImageBackground style={styles.container} source={require('../../../assets/images/imgbackground3.png')}>
                <KeyboardAvoidingView behavior='padding' style={{ width: '100%', height: '100%', flex: 1 }} keyboardVerticalOffset={Header.HEIGHT + 20}>
                    <ScrollView>
                        <Card style={{
                            margin: 20,
                            elevation: 5
                        }}
                        >
                            <Card.Content>
                                <List.Section title='Personal Info'>
                                    <View style={[{ margin: 10 }, styles.row]}>
                                        <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Ionicons name='ios-person' color={Colors.activeTextDark.default} size={20} />
                                        </View>
                                        <View style={{ width: '80%' }}>
                                            <TextInput
                                                label='First name'
                                                value={this.state.Fname}
                                                onChangeText={Fname => this.setState({ Fname })}
                                                style={{ backgroundColor: Colors.activeText.default }}
                                            />
                                        </View>
                                    </View>
                                    <View style={[{ margin: 10 }, styles.row]}>
                                        <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Ionicons name='ios-person' color={Colors.activeTextDark.default} size={20} />
                                        </View>
                                        <View style={{ width: '80%' }}>
                                            <TextInput
                                                label='last name'
                                                value={this.state.Sname}
                                                onChangeText={Sname => this.setState({ Sname })}
                                                style={{ backgroundColor: Colors.activeText.default }}
                                            />
                                        </View>
                                    </View>
                                    <View style={[{ margin: 10 }, styles.row]}>
                                        <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Ionicons name='ios-call' color={Colors.activeTextDark.default} size={20} />
                                        </View>
                                        <View style={{ width: '80%' }}>
                                            <TextInput
                                                label='Phone_number'
                                                value={this.state.phone}
                                                onChangeText={phone => this.setState({ phone })}
                                                style={{ backgroundColor: Colors.activeText.default }}
                                            />
                                        </View>
                                    </View>
                                </List.Section>
                            </Card.Content>
                            <Card.Actions>
                                <Button onPress={() => this._save()}>
                                    <Text style={{ color: Colors.activeTextDark.default }}>
                                        Save
                                    </Text>
                                </Button>
                                <Button onPress={() => this._cancel()}>
                                    <Text style={{ color: Colors.activeAccentText.default }}>
                                        Cancel
                                    </Text>
                                </Button>
                            </Card.Actions>
                        </Card>
                    </ScrollView>
                </KeyboardAvoidingView>
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
                />
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary.default,
    },
    row: {
        flexDirection: 'row'
    }
});