import React from 'react';
import {
    AsyncStorage,
    WebView,
    StyleSheet,
    View,
    BackHandler,
    Dimensions,
    StatusBar
} from 'react-native';
import {
    TouchableRipple
} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { ScreenOrientation, WebBrowser, Video, KeepAwake, Audio } from 'expo';
// import VideoPlayer from '@expo/videoplayer';
import {
    PulseIndicator
} from 'react-native-indicators';

//global components
import Colors from '../../global/colors';
import Config from '../../global/config';



const BackButton = (props) => {
    return (
        <View style={{ width: Dimensions.get('window').width / 6 - 50 }}>
            <TouchableRipple onPress={() => {
                ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT)
                StatusBar.setHidden(false);
                props.navigation.navigate('SeriesDetails')
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
            videoUrl: '',
            data: this.props.navigation.state.params,
            loading: true,
            error: false,
            token: null,
            userInfo: null,
            opacity: 0,
            title: "Your subcription has expired",
            message: "Your subscription has expired please click upgrade to go to our website to Upgrade or renew your subscription!",
            showConfirmButton: true
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
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
            shouldDuckAndroid: false,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false
        })
        await Audio.setIsEnabledAsync(true)
        const sound = new Audio.Sound()
        await sound.loadAsync(require('../../assets/audio/silent.mp3'));
        sound.playAsync()
        sound.setIsMutedAsync(true)
        sound.setIsLoopingAsync(true)
        const value = await AsyncStorage.getItem('logginKey');
        const userInfoObject = value;
        this.setState({ token: userInfoObject });
        ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        StatusBar.setHidden(true);
        this._fetchUserInfo().then(() => this._refreshToken().then(() => this._fetchData()));
    }


    handleBackPress = () => {
        ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
        StatusBar.setHidden(false);
        this.props.navigation.navigate('Details');
        return true;
    };

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
            this.setState({
                loading: false,
                error: true,
                title: '404',
                message: 'Ooops.. no connection,Please logout and login again to continue',
                showConfirmButton: false
            })
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
                    videoUrl: dataResponse.data,
                })
                this.setState({ loading: false, error: false });

            }
            else {
                this.setState({ loading: false, error: true });
            }
        }
        catch (e) {
            this.setState({
                loading: false,
                error: true,
                title: '404',
                message: 'Ooops.. no connection,Please logout and login again to continue',
                showConfirmButton: false
            })
        }
    }



    //open browser and go to zacutv website,login page
    _navigateToLogin = () => {
        WebBrowser.openBrowserAsync('https://zacutv.com/login');
        ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
        StatusBar.setHidden(false);
        this.props.navigation.navigate('Home')
    }

    // navigate to home page
    _navigateToDetails = () => {
        ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
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
                        {/* <KeepAwake /> */}
                        {/* <VideoPlayer
                            videoProps={{
                                shouldPlay: true,
                                resizeMode: Video.RESIZE_MODE_CONTAIN,
                                source: {
                                    uri: this.state.videoUrl + 'allowCrossDomainRedirects',
                                },
                            }}
                            volume={1.0}
                            isMuted={false}
                            isPortrait={false}
                            playFromPositionMillis={0}
                        /> */}
                        {/* <WebView
                            originWhitelist={['*']}
                            javaScriptEnabled
                            javaScriptEnabledAndroid={true}
                            domStorageEnabled={true}
                            mixedContentMode={'compatibility'}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            source={{
                                html: '<body style="margin:0;padding:0"><video width="100%" height="100%" autoplay playsinline controls controlsList="nofullscreen nodownload" poster="' + this.state.data.graphical_mobile_cover + '" autoplay> <source src="' + this.state.videoUrl + '" type="video/mp4"></video></body>'
                            }}
                        /> */}
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
    }
});
