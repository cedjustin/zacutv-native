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
    AsyncStorage,
    Animated,
    Image,
    SafeAreaView
} from 'react-native';
import {
    Paragraph,
    List,
    Divider,
    Headline,
    Banner
} from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
    PulseIndicator
} from 'react-native-indicators';
import { Picker, Form } from 'native-base';
//global components
import Colors from '../global/colors';
import Config from '../global/config';




SCREEN_HEIGHT = Dimensions.get('window').height




export default class DetailsSCreen extends React.Component {

    constructor(props) {
        super(props);
        this.scrollY = new Animated.Value(0)
        this.state = ({
            rootUrl: Config.rootUrl,
            appId: Config.appId,
            appKey: Config.appKey,
            data: this.props.navigation.state.params,
            episodes: [],
            season: null,
            selected: null,
            visible: false,
            showAlert: false,
            loader: true
        })
    }

    static navigationOptions = props => ({
        headerTransparent: true,
        headerTintColor: '#fcfaf1',
        headerStyle: {
            backgroundColor: !props.navigation.state.params ? 'transparent' : props.navigation.state.params.headerbackgroundColor,
        },
    });

    //calling fetchdata
    componentDidMount() {
        this._fetchLoginStatus();
        // this.interval = setInterval(this._fetchLoginStatus, 3600);
        this._fetchEpisodes()
        this.props.navigation.setParams({
            headerbackgroundColor: this.scrollY.interpolate({
                inputRange: [0, SCREEN_HEIGHT / 2 - 40],
                outputRange: ['transparent', Colors.headerColorOnScroll.default],
                extrapolate: 'clamp',
            }),
        });
        StatusBar.setHidden(false);
    }

    componentWillMount() {
        StatusBar.setHidden(false);
    }

    //get the login key
    _fetchLoginStatus = async () => {
        const value = await AsyncStorage.getItem('logginKey');
        this.setState({ loginStatus: value });
    }

    //fetching episodes
    _fetchEpisodes = async (season) => {
        var serieId = this.state.data.id;
        var seasonId;
        if (season == undefined) {
            seasonId = this.state.data.seasons[0].id
        }
        else {
            var seasonObject = this.state.data.seasons.find(element =>
                element.name === season
            )
            seasonId = seasonObject.id
        }
        const episodesMovieJson = await fetch(this.state.rootUrl + '/api/get-episodes-by-season/' + serieId + '/' + seasonId, {
            method: 'GET',
            headers: {
                appId: this.state.appId,
                appKey: this.state.appKey,
            }
        })
        const episodesMovieResponse = await episodesMovieJson.json();
        this.setState({ episodes: episodesMovieResponse, loader: false });
    }

    onValueChange(value) {
        this.setState({
            selected: value,
            loader: true
        });
        this._fetchEpisodes(value)
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
            alert(error.message);
        }
    }


    _onPlay = (data) => {
        try {
            if (this.state.loginStatus != 'loggedOut' && this.state.loginStatus != null) {
                this.props.navigation.navigate('SeriesVideoPlayer', data)
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

    _details = (item) => {
        this.props.navigation.navigate(item.category ? 'Details' : 'SeriesDetails', item);
        this.setState({ data: item, loader: true });
        this._fetchRelatedMovies();
    }

    render() {
        //episodes Movies
        const EpisodesView = () => {
            if (this.state.loader === true) {
                return (
                    <View style={[styles.container, { height: Dimensions.get('window').height / 4 - 70, justifyContent: 'center', alignItems: 'center' }]}>
                        <PulseIndicator animating={true} color={Colors.activeText.default} size={30} />
                    </View>
                )
            }
            else {
                return (
                    <View style={styles.listContainer}>
                        <View>
                            <FlatList
                                data={this.state.episodes}
                                keyExtractor={({ item }) => 'key'}
                                renderItem={({ item }) =>
                                    <View>
                                        <List.Item
                                            title={`${item.title}`}
                                            onPress={() => this._onPlay(item)}
                                            right={props => <List.Icon {...props} icon="play-arrow" />}
                                            titleColor={Colors.activeText.default}
                                            style={{ margin: 2 }}
                                        />
                                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                            <Divider style={{ backgroundColor: Colors.dimActiveText.default, width: '90%' }} />
                                        </View>
                                    </View>
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
                <SafeAreaView style={{ backgroundColor: 'rgba(55,55,64,0.8)' }}>
                    <Banner
                        visible={this.state.showAlert}
                        actions={[
                            {
                                label: 'Login',
                                onPress: () => { this.setState({ showAlert: false }); StatusBar.setHidden(false); this._navigateToLogin() },
                            },
                            // {
                            //     label: 'Signup',
                            //     onPress: () => { this.setState({ showAlert: false }); StatusBar.setHidden(false); this._navigateToSignUp() },
                            // },
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
                    <ScrollView style={{ backgroundColor: 'rgba(55,55,64,0.8)' }}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollY } } },])}
                        scrollEventThrottle={16}
                    >
                        <View style={{ marginTop: 70, justifyContent: 'center', alignItems: 'center' }}>
                            <ImageBackground source={{ uri: this.state.rootUrl + '/uploads/posts/' + this.state.data.graphical_mobile_cover }} style={[styles.image_top, { justifyContent: 'center', alignItems: 'center' }]} resizeMode='cover'>
                            </ImageBackground>
                        </View>
                        <View style={{ margin: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Headline style={{ color: Colors.activeText.default }}>{this.state.data.name}</Headline>
                        </View>
                        <View style={{ marginTop: 5, marginBottom: 5, marginLeft: 20, marginRight: 20 }}>
                            <Divider style={{ backgroundColor: Colors.dimActiveText.default, width: '100%', marginBottom: 5 }} />
                            <Paragraph style={{ color: Colors.activeText.default, textAlign: 'center' }}>{this.state.data.description}</Paragraph>
                        </View>
                        <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20, marginBottom: 5 }}>
                            <Form style={styles.pickerContainer}>
                                <Picker
                                    note
                                    mode="dropdown"
                                    style={{ width: '100%', color: Colors.activeText.default }}
                                    placeholderIconColor='#fff'
                                    selectedValue={this.state.selected}
                                    onValueChange={this.onValueChange.bind(this)}
                                >
                                    {this.state.data.seasons.map((item, index) => {
                                        return (<Picker.Item label={item.name} value={item.name} key={index} />)
                                    })}
                                </Picker>
                            </Form>
                        </View>
                        <EpisodesView />
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image_top: {
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').height / 2 - 30,
    },
    movieCard: {
        width: Dimensions.get('window').width / 2 - 70,
        height: Dimensions.get('window').height / 3 - 70,
        backgroundColor: '#f39c12',
        margin: 2.5
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
    listContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 5,
        backgroundColor: 'rgb(255,255,255)',
        borderRadius: 5
    },
    pickerContainer: {
        width: '100%',
        backgroundColor: Colors.activeAccentText.default
    }
});
