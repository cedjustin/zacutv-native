import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    ImageBackground,
    Dimensions,
    FlatList,
    Share,
    StatusBar,
    Animated,
    Image,
    SafeAreaView,
    WebView
} from 'react-native';
import {
    TouchableRipple,
    Paragraph,
    Text,
    Banner,
    Divider,
    Headline,
    Button,
    Snackbar
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    PulseIndicator
} from 'react-native-indicators';
import Orientation from 'react-native-orientation';
//global components
import Colors from '../global/colors';
import Config from '../global/config';


Screen_width = Dimensions.get('window').width
ImageMax_Width = Screen_width / 2
ImageMin_Width = Screen_width / 3


export default class DetailsSCreen extends React.Component {

    constructor(props) {
        super(props);
        this.scrollY = new Animated.Value(0)
        this.state = ({
            rootUrl: Config.rootUrl,
            appId: Config.appId,
            appKey: Config.appKey,
            data: this.props.navigation.state.params,
            loginStatus: null,
            relatedMoviesData: [],
            downloadProgress: null,
            videoUrl: null,
            visible: false,
            showAlert: false,
            snackVisible: false,
            snackMessage: null,
            videoUrl: null,
            VideoStatus: null,
            videoFile: null,
            loader: true
        })
    }

    static navigationOptions = props => ({
        headerTransparent: true,
        headerTintColor: '#fcfaf1',
        headerStyle: {
            backgroundColor: 'transparent'
        },
    });

    //calling fetchdata
    componentDidMount = () => {
        // ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
        // this._getVideo();
        this._fetchLoginStatus();
        this._fetchRelatedMovies();
        this.interval = setInterval(this._fetchLoginStatus, 3600);
        StatusBar.setHidden(false);
    }
    //get the login key
    _fetchLoginStatus = async () => {
        const value = await AsyncStorage.getItem('logginKey');
        this.setState({ loginStatus: value });
    }

    _fetchRelatedMovies = async () => {
        const movieId = this.state.data.id;
        // alert(JSON.stringify(movieId,null,4))
        const relatedMovieJson = await fetch(this.state.rootUrl + '/api/related-movies/' + movieId + '/10', {
            method: 'GET',
            headers: {
                appId: this.state.appId,
                appKey: this.state.appKey,
            }
        })
        const relatedMovieResponse = await relatedMovieJson.json();
        this.setState({ relatedMoviesData: relatedMovieResponse, loader: false });
    }

    showAlert = () => {
        this.setState({
            showAlert: true
        });
    };

    _navigateToLogin = () => {
        this.props.navigation.navigate('Login');
    };

    _navigateToSignUp = () => {
        this.props.navigation.navigate('SignUp');
    }

    _navigateToDownloads = data => {
        try {
            if (this.state.loginStatus != 'loggedOut') {
                this.props.navigation.navigate('Downloads', data);
            }
            else {
                this.setState({
                    showAlert: true
                });
            }
        } catch (error) {
            alert(error.message)
        }
    };

    //get date and leave only a year
    getYearOnly = (data) => {
        let year;
        if (data == undefined) {
            year = null
        } else {
            year = data.slice(0, 4);
        }
        return year
    }

    _onshare = async (id, slug) => {
        try {
            const result = await Share.share({
                message: 'https://zacutv.com' + '/play/' + id + '/' + slug,
            })

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            // alert(error.message);
        }
    }

    _onPlay = (data) => {
        // alert(this.state.videoFile);
        try {
            if (this.state.loginStatus != 'loggedOut' && this.state.loginStatus != null) {
                Orientation.lockToLandscape();
                this.props.navigation.navigate('VideoPlayer', data)
            }
            else {
                StatusBar.setHidden(true);
                this.setState({
                    showAlert: true
                });
            }
        } catch (error) {
            // alert(error.message)
        }
    }

    // refreshing the token
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
        }
    }

    // get vimeo id
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
            }
            else {
                // this is where all error codes will go
            }
        }
        catch (e) {
        }
    }

    _details = (item) => {
        this.props.navigation.navigate(item.category ? 'Details' : 'SeriesDetails', item);
        this.setState({ data: item, loader: true });
        this._fetchRelatedMovies();
    }

    _keyExtractor = (item, index) => item.title;

    render() {
        const TopImageWidth = this.scrollY.interpolate({
            inputRange: [0, Screen_width / 2 - 40],
            outputRange: [ImageMax_Width, ImageMin_Width],
            extrapolate: 'clamp',
        });
        //Related Movies
        const RelatedMovies = () => {
            if (this.state.loader === true) {
                return (
                    <View style={[styles.container, { height: Dimensions.get('window').height / 4 - 70, justifyContent: 'center', alignItems: 'center' }]}>
                        <PulseIndicator animating={true} color={Colors.activeText.default} size={30} />
                    </View>
                )
            }
            else {
                return (
                    <View style={styles.cardContainer}>
                        <View style={styles.listContainer}>
                            <FlatList
                                horizontal
                                style={styles.flatList}
                                data={this.state.relatedMoviesData}
                                keyExtractor={this._keyExtractor}
                                renderItem={({ item }) =>
                                    <TouchableRipple onPress={() => this._onPlay(item)}>
                                        <View style={styles.movieCard}>
                                            <ImageBackground
                                                imageStyle={{ borderRadius: 10 }}
                                                style={{ height: Dimensions.get('window').height / 3 - 70, width: '100%' }}
                                                source={{ uri: this.state.rootUrl + '/uploads/posts/300/' + item.graphical_mobile_cover }}
                                            ></ImageBackground>
                                            <Text style={{ color: Colors.activeText.default, textAlign: 'center' }}>{`${item.title}`}</Text>
                                        </View>
                                    </TouchableRipple>
                                }
                            />
                        </View>
                    </View>
                )
            }
        }
        const { showAlert } = this.state;
        return (
            <ImageBackground source={{ uri: this.state.rootUrl + '/uploads/posts/' + this.state.data.graphical_mobile_cover }} style={styles.container} blurRadius={5} resizeMode='cover'>
                <Snackbar
                    visible={this.state.snackVisible}
                    onDismiss={() => this.setState({ snackVisible: false })}
                >
                    {this.state.snackMessage}
                </Snackbar>
                <SafeAreaView style={{ backgroundColor: 'rgba(55,55,64,0.8)' }}>
                    <Banner
                        visible={this.state.showAlert}
                        actions={[
                            {
                                label: 'Login',
                                onPress: () => { this.setState({ showAlert: false }); StatusBar.setHidden(false); this._navigateToLogin() },
                            },
                            {
                                label: 'Signup',
                                onPress: () => { this.setState({ showAlert: false }); StatusBar.setHidden(false); this._navigateToSignUp() },
                            },
                            {
                                label: 'Dismiss',
                                onPress: () => { this.setState({ showAlert: false }); StatusBar.setHidden(false) },
                            },
                        ]}
                        image={({ size }) =>
                            <Image
                                source={{ uri: 'https://img.icons8.com/ios/50/000000/lock.png' }}
                                style={{
                                    width: size,
                                    height: size,
                                }}
                            />
                        }
                    >
                        This content is protected, you have to login or Register to watch it.
                    </Banner>
                    <ScrollView
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollY } } },])}
                        scrollEventThrottle={16}
                    >
                        <View style={{ marginTop: 70, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.shadow}>
                                <TouchableRipple onPress={() => this._onPlay()}>
                                    <Image source={{ uri: this.state.rootUrl + '/uploads/posts/' + this.state.data.graphical_mobile_cover }} style={[styles.image_top, { justifyContent: 'center', alignItems: 'center', width: ImageMax_Width }]} resizeMode='cover' />
                                </TouchableRipple>
                            </View>
                        </View>
                        <View style={{ margin: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Headline style={{ color: Colors.activeText.default }}>{this.state.data.title}</Headline>
                            <View style={[styles.row, { margin: 5 }]}>
                                <Text style={{ color: Colors.activeText.default }}> {this.getYearOnly(this.state.data.date_release)} | </Text>
                                <Text style={{ color: Colors.activeText.default }}>{this.state.data.genres && this.state.data.genres.length ? this.state.data.genres[0].name : ''} | </Text>
                                <Text style={{ color: Colors.activeText.default }}>{this.state.data.time}</Text>
                            </View>
                        </View>
                        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 10 }]}>
                            <Button style={{ margin: 5, backgroundColor: 'rgba(255,255,255,0.2)', width: 50, height: 50, borderRadius: 100, justifyContent: 'center' }} color={Colors.activeText.default} onPress={() => this._onshare(this.state.data.id, this.state.data.slug)}>
                                <Ionicons name='md-share' color={Colors.activeText.default} size={25} />
                            </Button>
                            <Button style={{ margin: 5, backgroundColor: 'rgba(255,255,255,0.2)', width: 50, height: 50, borderRadius: 100, justifyContent: 'center' }} color={Colors.activeText.default} onPress={() => this._onPlay(this.state.data)}>
                                <Ionicons name='ios-play' color={Colors.activeText.default} size={25} />
                            </Button>
                            {/* <Button style={{ margin: 5, backgroundColor: 'rgba(255,255,255,0.2)', width: 25, height: 50, borderRadius: 100, justifyContent: 'center' }} color={Colors.activeText.default} onPress={() => this._navigateToDownloads(this.state.data)}>
                                <Ionicons name='md-arrow-down' color={Colors.activeText.default} size={25} />
                            </Button> */}
                        </View>
                        <View style={{ marginTop: 5, marginBottom: 5, marginLeft: 20, marginRight: 20 }}>
                            <Divider style={{ backgroundColor: Colors.dimActiveText.default, width: '100%', marginBottom: 5 }} />
                            <Paragraph style={{ color: Colors.activeText.default, textAlign: 'center' }}>{this.state.data.description}</Paragraph>
                        </View>
                        <RelatedMovies />
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    shadow: {
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 10,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    image_top: {
        height: Dimensions.get('window').height / 2 - 30,
    },
    movieCard: {
        width: Dimensions.get('window').width / 2 - 70,
        height: 'auto',
        margin: 2.5,
        borderRadius: 10
    },
    row: {
        flexDirection: 'row'
    },
    infoContainer: {
        margin: 20
    },
    paragraph: {
        paddingTop: 5,
        paddingBottom: 5,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    fac: {
        position: 'absolute',
        margin: 16,
        left: 0,
        bottom: 0,
    },
    imageFull: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff'
    },
});
