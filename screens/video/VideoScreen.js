import React from 'react';
import {
    WebBrowser,
    StyleSheet,
    View,
    BackHandler,
    Dimensions,
    StatusBar
} from 'react-native';
import {
    TouchableRipple,
    Text
} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-af-video-player'
import {
    PulseIndicator
} from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation';
//global components
import Colors from '../../global/colors';
import Config from '../../global/config';



const BackButton = (props) => {
    return (
        <View style={{ width: Dimensions.get('window').width / 6 - 50 }}>
            <TouchableRipple onPress={() => {
                Orientation.lockToPortrait();
                StatusBar.setHidden(false);
                props.navigation.navigate('Details')
            }}
                style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name='ios-arrow-back' size={20} style={{ color: '#ecf0f1' }} />
            </TouchableRipple>
        </View>
    )
}
export default class VideoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            rootUrl: Config.rootUrl,
            appId: Config.appId,
            appKey: Config.appKey,
            videoUrl: 'https://r6---sn-hc57en7d.googlevideo.com/videoplayback?id=0b94aa32371995a3&itag=22&source=picasa&requiressl=yes&pl=20&sc=yes&ei=EuXvXNrnHoevhAef0KPQAQ&susc=ph&app=fife&mime=video/mp4&cnr=14&dur=6988.881&lmt=1558972997881949&ipbits=0&keepalive=yes&ratebypass=yes&ip=91.232.105.62&expire=1559232818&sparams=app,cnr,dur,ei,expire,id,ip,ipbits,itag,lmt,mime,mip,mm,mn,ms,mv,pl,requiressl,sc,source,susc&signature=0478C33BA40D7D5B6F4B4A6A3C63742F9C6A9418.4BD79F870D7D3C78FB33BDDFFD6A31BD1F92CD1F&key=cms1&cms_redirect=yes&mip=197.243.52.82&mm=30&mn=sn-hc57en7d&ms=nxu&mt=1559226072&mv=u',
            data: this.props.navigation.state.params,
            loading: true,
            error: false,
            token: null,
            userInfo: null,
            opacity: 0,
            title: "Your subcription has expired",
            message: "Your subscription has expired please click upgrade to go to our website to Upgrade or renew your subscription!",
            showConfirmButton: true,
            progress: 0
        })
    }

    //handling load
    onLoadStart = () => {
        this.setState({ opacity: 1 });
    }

    onLoad = () => {
        this.setState({ opacity: 0 });
    }

    onBuffer = ({ isBuffering }) => {
        this.setState({ opacity: isBuffering ? 1 : 0 });
    }


    static navigationOptions = ({ navigation }) => ({
        headerTransparent: true,
        headerTintColor: '#fcfaf1',
        headerStyle: {
            backgroundColor: 'transparent'
        },
        headerLeft: <BackButton navigation={navigation} />,
        // tabBarVisible:false
    });

    componentDidMount = async () => {
        const value = await AsyncStorage.getItem('logginKey');
        const userInfoObject = value;
        this.setState({ token: userInfoObject });
        Orientation.lockToLandscape();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        StatusBar.setHidden(true);
        this._loadingSequence();
    }


    handleBackPress = () => {
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
        this.props.navigation.navigate('Details');
        return true;
    };

    _loadingSequence = () => {
        this._fetchUserInfo().then(() => this._refreshToken().then(() => this._fetchData()));
    }

    _refreshToken = async () => {
        const bearer = 'Bearer ' + this.state.token;
        try {
            const newToken = await fetch(this.state.rootUrl + '/api/refresh-token', {
                method: 'GET',
                headers: {
                    appId: this.state.appId,
                    appKey: this.state.appKey,
                    Authorization: bearer,
                }
            });
            const newTokenResponse = await newToken.json();
            AsyncStorage.setItem('logginKey', newTokenResponse.token);
            const value = await AsyncStorage.getItem('logginKey');
        } catch (e) {
            alert('token >>>> ' + e);
            this.setState({ loading: false });
            // this.setState({
            //     loading: false,
            //     error: true,
            //     title: '404',
            //     message: 'Ooops.. no connection,Please logout and login again to continue',
            //     showConfirmButton: false
            // })
        }
    }

    //fetching data
    _fetchData = async () => {
        token = await AsyncStorage.getItem('logginKey');
        var bearer = 'Bearer ' + token;
        try {
            const dataJson = await fetch(this.state.rootUrl + '/api/get-vimeo-id', {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    appId: this.state.appId,
                    appKey: this.state.appKey,
                    Authorization: bearer,
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    id: this.state.data.id
                })
            })
            var dataResponse = await dataJson.json();
            if (dataResponse.error == 0) {
                this.setState({
                    videoUrl: dataResponse.filename,
                })
                // alert(this.state.videoUrl);
                this.setState({ loading: false, error: false });

            }
            else {
                this.setState({ loading: false, error: true });
            }
        }
        catch (e) {
            alert('fetching >>>> ' + e);
            this.setState({ loading: false });
            // this.setState({
            //     loading: false,
            //     error: true,
            //     title: '404',
            //     message: 'Ooops.. no connection,Please logout and login again to continue',
            //     showConfirmButton: false
            // })
        }
    }

    //open browser and go to zacutv website,login page
    _navigateToLogin = () => {
        WebBrowser.openBrowserAsync('https://zacutv.com/login');
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
        this.props.navigation.navigate('Home')
    }

    // navigate to home page
    _navigateToDetails = () => {
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
        this.props.navigation.navigate('Details')
    }

    //fetch userinfo
    _fetchUserInfo = async () => {
        try {
            const value = await AsyncStorage.getItem('logginKey');
            const userInfoObject = value;
            this.setState({ token: userInfoObject });
        } catch (error) {
            // alert(error.message)
        }
    }

    // when there is an error in the vide
    _onError() { }

    render() {
        if (this.state.loading == true) {
            return (
                <View style={[styles.container, { height: Dimensions.get('window').height, justifyContent: 'center', alignItems: 'center' }]}>
                    <PulseIndicator animating={true} color={'#ecf0f1'} size={30} />
                </View>
            )
        }
        else {
            if (this.state.error == false) {
                return (
                    <View style={styles.container}>
                        <Video url={this.state.videoUrl} autoPlay style={styles.videoPlayer} rotateToFullScreen={false} onError={e => alert(this.state.progress)} onProgress={p => console.log(JSON.stringify(p))} />
                    </View>
                );
            }
            else {
                return (
                    <View style={{ flex: 1, backgroundColor: Colors.secondary.default }}>
                        <AwesomeAlert
                            show={true}
                            showProgress={false}
                            title={this.state.title}
                            message={this.state.message}
                            closeOnTouchOutside={true}
                            closeOnHardwareBackPress={false}
                            showCancelButton={false}
                            showConfirmButton={this.state.showConfirmButton}
                            cancelText="Login"
                            confirmText="Upgrade"
                            confirmButtonColor={Colors.activeAccentText.default}
                            cancelButtonColor="#1a1a1a"
                            onDismiss={() => {
                                this._navigateToDetails();
                            }}
                            onConfirmPressed={() => {
                                this._navigateToLogin();
                            }}
                        />
                    </View>
                )
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    activityIndicator: {
        position: 'absolute',
        top: 70,
        left: 70,
        right: 70,
        height: 50,
    },
    videoPlayer: {
        width: '100%',
        height: '90%'
    }
});
