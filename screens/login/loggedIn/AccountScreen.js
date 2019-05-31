import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    AsyncStorage,
    StatusBar,
    Image,
} from 'react-native';
import {
    Button,
    Headline,
    Subheading,
    Text,
    TouchableRipple,
} from 'react-native-paper';
import MaterialInitials from 'react-native-material-initials/native';
import {
    PulseIndicator
} from 'react-native-indicators';
// import { WebBrowser } from 'expo';
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
            WatchListMovieData: [],
            data: this.props.navigation.state.params,
            visible: false,
            watchListPreloader: true,
            swiperPreLoader: true,
            userInfo: null,
            stillLoadingLocalData: true,
            showAlert: false,
            plans: [],
            plan: null,
            names: []
        })
    }

    static navigationOptions = {
        header: null,
        headerTransparent: false,
        headerTintColor: '#fcfaf1',
        headerTitleStyle: {
            alignSelf: 'center',
            textAlign: 'center'
        },
        headerStyle: {
            backgroundColor: Colors.activeText.default,
            elevation: 0,
        }
    };


    //calling fetchdata
    componentDidMount = async () => {
        StatusBar.setHidden(false);
        this._fetchUserInfo();
        let loginStatus = await AsyncStorage.getItem('logginStatus');
        if (!loginStatus || loginStatus == null) {
            this.setState({ stillLoadingLocalData: false });
        } else if (loginStatus == 1) {
            await AsyncStorage.setItem('logginStatus', '0');
            this.setState({ stillLoadingLocalData: false });
            this.props.navigation.navigate('Home');
        } else {
            this.setState({ stillLoadingLocalData: false });
        }
    }

    _fetchUserInfo = async () => {
        try {
            const value = await AsyncStorage.getItem('userInfo');
            const userInfoObject = JSON.parse(value);
            this.setState({ userInfo: userInfoObject })
            const plansJson = await fetch(this.state.rootUrl + '/api/get-plans', {
                method: 'POST',
                headers: {
                    appId: this.state.appId,
                    appKey: this.state.appKey
                }
            })
            var plansResponse = await plansJson.json();
            var array = [];
            for (var key in plansResponse) {
                if (plansResponse.hasOwnProperty(key)) {
                    array.push({
                        data: plansResponse[key]
                    })
                }
            }
            this.setState({ plans: array });
            var activePlan = this.state.plans.find(element => {
                return element.data.id == this.state.userInfo.subscription_plan
            })
            this.setState({ plan: activePlan.data.name })
        } catch (error) {
            // alert(error.message)
        }
    }


    _editProfile = (data) => {
        this.props.navigation.navigate('EditAccount', data);
    }

    //capitilize text
    Capitalize(str) {
        if (str == null) {
            return str = '';
        }
        else {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }

    _logout = async () => {
        try {
            AsyncStorage.setItem('logginKey', 'loggedOut');
            AsyncStorage.removeItem('userInfo');
            this.props.navigation.navigate('LoginPage')
        }
        catch (error) {
            alert(error);
        }
    }

    _navigateToPlan = (plan) => {
        this.props.navigation.navigate('Plans', plan);
    }

    _details = (data) => {
        this.props.navigation.navigate(data.category ? 'Details' : 'SeriesDetails', data)
    }

    _navigateToContactUs = () => {
        this.props.navigation.navigate('ContactUs');
    }

    _navigateToAboutUs = () => {
        this.props.navigation.navigate('AboutUs')
    }

    _navigateToTermsAndConditions = () => {
        // WebBrowser.openBrowserAsync('https://zacutv.com/terms-and-conditions');
    }

    render() {
        const { showAlert } = this.state;

        //main screen output
        if (this.state.stillLoadingLocalData == true) {
            return (
                <View style={styles.container}>
                    <PulseIndicator color={Colors.activeText.default} size={30} />
                </View>
            )
        }
        else {
            return (
                <ScrollView style={styles.container}>
                    <View style={{ backgroundColor: '#fff' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialInitials
                                style={[{ alignSelf: 'center', marginTop: 50 }, styles.circle]}
                                backgroundColor={Colors.primary.default}
                                color={Colors.activeText.default}
                                size={100}
                                text={`${this.state.userInfo.name} ${this.state.userInfo.last_name}`}
                                single={false}
                            />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Headline style={{ color: Colors.primary.default }}>{this.Capitalize(this.state.userInfo.name)} {this.Capitalize(this.state.userInfo.last_name)}</Headline>
                            <Subheading style={{ color: Colors.primary.default }}>{`${this.state.userInfo.email}`}</Subheading>
                            <Button mode="contained" style={{ backgroundColor: Colors.primary.default, margin: 5 }} onPress={() => this._editProfile(this.state.userInfo)}><Text style={{ color: Colors.activeText.default }}>Edit Profile</Text></Button>
                        </View>
                    </View>
                    <View style={{ width: '100%' }}>
                        <Image source={require('../../../assets/images/separator-01.png')} style={{ width: '100%', height: 100 }} />
                    </View>
                    <View style={{ margin: 20 }}>
                        <Button style={{ backgroundColor: 'rgb(254,89,0)' }}>
                            <Text style={{ color: Colors.activeText.default }}>Active Plan: {`${this.state.plan == null ? '' : this.state.plan}`}</Text>
                        </Button>
                        <Button style={{ backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 5 }} onPress={() => this._navigateToContactUs()}>
                            <Text style={{ color: Colors.activeText.default }}>Contact us </Text>
                        </Button>
                    </View>
                    <View style={[{ margin: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        {/* <TouchableRipple onPress={()=>this._navigateToAboutUs()}><Text style={{color:'#999'}}>About us</Text></TouchableRipple> */}
                        <Text style={{ color: '#999', marginTop: 5 }} onPress={() => this._navigateToTermsAndConditions()}>Terms and conditions</Text>
                        <TouchableRipple onPress={() => this._logout()}>
                            <Text style={{ color: '#999', marginTop: 5 }}>Log Out</Text>
                        </TouchableRipple>
                    </View>
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary.default,
    },
    row: {
        flexDirection: 'row',
    },
    circle: {
        margin: 20
    },
});
