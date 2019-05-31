//dependencies
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    View,
    FlatList,
    ImageBackground,
    RefreshControl,
    StatusBar,
    Animated,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    TouchableRipple,
    Text,
    Button,
    Headline,
    Badge,
    Title
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation';
import {
    PulseIndicator
} from 'react-native-indicators';
//global components
import {
    fetchTopMovie,
    fetchFeaturedMovie,
    fetchtrendingMovies,
    fetchSeries,
    fetchRecentMovies,
    fetchMovies,
    fetchShortMovies,
    fetchBongoMovies
} from '../global/requests';
import ColorPalette from '../global/color';
import Config from '../global/config';
import { withNavigation } from "react-navigation";


const Logo = () => {
    return (
        <View style={{ width: Dimensions.get('window').width / 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Title style={{ color: ColorPalette.text }}>Zacu</Title><Text style={{ color: ColorPalette.accent }}>TV</Text>
            </View>
        </View>
    )
}


SCREEN_HEIGHT = Dimensions.get('window').height

class HomeScreen extends React.Component {

    //pageHeader
    static navigationOptions = (props) => ({
        // header:null,
        headerTitle: <Logo />,
        headerTransparent: true,
        headerTintColor: ColorPalette.text,
        headerTitleStyle: { flex: 1, textAlign: 'center', justifyContent: 'center' },
        headerStyle: {
            backgroundColor: !props.navigation.state.params ? 'transparent' : props.navigation.state.params.headerbackgroundColor,
        },
    });

    //constructor
    constructor(props) {
        super(props);
        this.scrollY = new Animated.Value(0);
        this.state = ({
            rootUrl: Config.rootUrl,
            appId: Config.appId,
            appKey: Config.appKey,
            topMovieData: [],
            featuredMoviesData: [],
            popularMoviesData: [],
            recentMoviesData: [],
            bongoMovies: [],
            seriesData: [],
            moviesData: [],
            shortMoviesData: [],
            top_item: [],
            opacity: 1,
            fabActive: 'false',
            scrollY: new Animated.Value(0),
            loggedIn: null,
            refreshing: false,
            loader: true,
            showHeader: true,
            date: null,
            offSet: 0,
            limit: 50
        })
    }

    componentDidMount() {
        // this.interval = setInterval(this.fetchData,3600);
        this.fetchData();
        StatusBar.setHidden(false);
        this.props.navigation.setParams({
            headerbackgroundColor: this.scrollY.interpolate({
                inputRange: [0, SCREEN_HEIGHT / 2 - 40],
                outputRange: ['transparent', ColorPalette.primary],
                extrapolate: 'clamp',
            }),
        });
        this._loginCheck();
        Orientation.lockToPortrait();
    }

    //check if the film is new
    _checkIfnew = (str) => {
        if (str == null) {
            return str = '';
        }
        else {
            var one_day = 1000 * 60 * 60 * 24;
            var q = new Date();
            var m = q.getMonth();
            var d = q.getDay();
            var y = q.getFullYear();
            var h = q.getHours();
            var min = q.getMinutes();
            var sec = q.getSeconds();
            var date = new Date(y, m, d, h, min, sec);
            var mydate = new Date(str.slice(0, 4), str.slice(5, 7), str.slice(8, 10), str.slice(11, 13), str.slice(14, 16), str.slice(17, 19));
            var difference = date - mydate;
            var days = Math.round(difference / one_day);
            if (days < 7) {
                return str = 'true';
            }
            else {
                return str = 'false';
            }
        }
    }

    //check for updates
    _updateCheck = async () => {
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                await Updates.fetchUpdateAsync().then(() => Updates.reloadFromCache());
            };
        } catch (e) {
            console.log("Update fail", e);
        }
    }

    //checking if loggedIn
    _loginCheck = async () => {
        try {
            const value = await AsyncStorage.getItem('logginKey');
            if (value != 'loggedOut') {
                this.setState({ loggedIn: 'LoggedIn' })
            }
            else {
                this.setState({
                    showAlert: true
                });
            }
        } catch (error) {
            alert(error.message)
        }
    }

    // fetching data from the API
    fetchOnlineData = async () => {
        const topMovieResponse = await fetchTopMovie();
        const featuredMoviesResponse = await fetchFeaturedMovie();
        const popularMoviesResponse = await fetchtrendingMovies();
        const recentMoviesResponse = await fetchRecentMovies();
        const bongoMoviesResponse = await fetchBongoMovies();
        const seriesResponse = await fetchSeries();
        const moviesResponse = await fetchMovies();
        const shortMoviesResponse = await fetchShortMovies();
        await AsyncStorage.setItem('TopMovie', JSON.stringify(topMovieResponse));
        await AsyncStorage.setItem('FeaturedMovie', JSON.stringify(featuredMoviesResponse));
        await AsyncStorage.setItem('PopularMovie', JSON.stringify(popularMoviesResponse));
        await AsyncStorage.setItem('RecentMovie', JSON.stringify(recentMoviesResponse));
        await AsyncStorage.setItem('BongoMovie', JSON.stringify(bongoMoviesResponse));
        await AsyncStorage.setItem('Series', JSON.stringify(seriesResponse));
        await AsyncStorage.setItem('Movies', JSON.stringify(moviesResponse));
        await AsyncStorage.setItem('ShortMovies', JSON.stringify(shortMoviesResponse));
        await AsyncStorage.setItem('FirstLoad', 'not first load');
        await this.fetchLocalData();
    }

    fetchLocalData = async () => {
        const topMovieResponse = await AsyncStorage.getItem('TopMovie');
        const featuredMoviesResponse = await AsyncStorage.getItem('FeaturedMovie');
        const popularMoviesResponse = await AsyncStorage.getItem('PopularMovie');
        const recentMoviesResponse = await AsyncStorage.getItem('RecentMovie');
        const bongoMoviesResponse = await AsyncStorage.getItem('BongoMovie');
        const seriesResponse = await AsyncStorage.getItem('Series');
        const moviesResponse = await AsyncStorage.getItem('Movies');
        const shortMoviesResponse = await AsyncStorage.getItem('ShortMovies');
        this.setState({ topMovieData: JSON.parse(topMovieResponse) });
        this.setState({ featuredMoviesData: JSON.parse(featuredMoviesResponse) });
        this.setState({ popularMoviesData: JSON.parse(popularMoviesResponse) });
        this.setState({ recentMoviesData: JSON.parse(recentMoviesResponse) });
        this.setState({ bongoMovies: JSON.parse(bongoMoviesResponse) });
        this.setState({ seriesData: JSON.parse(seriesResponse) });
        this.setState({ moviesData: JSON.parse(moviesResponse) });
        this.setState({ shortMoviesData: JSON.parse(shortMoviesResponse) });
        this.setState({
            loader: false
        });
    }


    //fetching data
    fetchData = async () => {
        const firstTime = await AsyncStorage.getItem('FirstLoad');
        if (firstTime == null) {
            await this.fetchOnlineData();
        } else {
            await this.fetchLocalData();
            this.fetchOnlineData();
        }
        this.setState({ loader: false });
    }

    //fetching on refresh
    _onRefresh = async () => {
        this.setState({ refreshing: true },
            () => { this.componentDidMount() });
        this.setState({ refreshing: false });
    }

    //passing and navigating to details page
    _details = (data) => {
        this.props.navigation.navigate(data.category ? 'Details' : 'SeriesDetails', data)
    }

    _keyExtractor = (item, index) => item.title;


    render() {
        const CardsRow = (dataArray) => {
            return (
                <View style={styles.listContainer}>
                    <FlatList
                        horizontal
                        style={styles.flatList}
                        data={dataArray}
                        keyExtractor={this._keyExtractor}
                        renderItem={({ item }) =>
                            <TouchableRipple onPress={() => this._details(item)}>
                                <View style={styles.movieCard}>
                                    <ImageBackground
                                        style={styles.imageFull}
                                        imageStyle={{ borderRadius: 10 }}
                                        source={{ uri: this.state.rootUrl + '/uploads/posts/300/' + item.graphical_mobile_cover }}
                                    >
                                        <Badge style={{ opacity: this._checkIfnew(item.published_at) == 'true' ? 1 : 0, position: 'absolute', bottom: 5, right: 5, backgroundColor: ColorPalette.accent }} mode='flat'>
                                            <Text style={{ color: ColorPalette.text }}>New</Text>
                                        </Badge>
                                    </ImageBackground>
                                    <Text style={{ color: ColorPalette.text, textAlign: 'center', marginTop: 3 }}>{`${item.title = undefined ? item.name : item.title}`}</Text>
                                </View>
                            </TouchableRipple>
                        }
                    />
                </View>
            )
        }
        if (this.state.loader == true) {
            return (
                <ImageBackground
                    source={require('../assets/images/imgbackground3.png')}
                    style={{ flexGrow: 1, backgroundColor: ColorPalette.primary, alignItems: 'center', justifyContent: 'center' }}>
                    <PulseIndicator animating={true} color={'#ecf0f1'} size={30} />
                </ImageBackground>
            );
        }
        else {
            return (
                <View style={styles.container}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                            />
                        }

                        style={styles.container}
                        onScroll={Animated.event([
                            { nativeEvent: { contentOffset: { y: this.scrollY } } },
                        ])}
                        scrollEventThrottle={16}
                    >
                        <View style={styles.topContainer}>
                            <FlatList
                                data={this.state.topMovieData}
                                keyExtractor={(item) => 'item'}
                                renderItem={({ item }) =>
                                    <TouchableRipple onPress={() => this._details(item)}>
                                        <ImageBackground
                                            style={styles.topImageFull}
                                            source={{ uri: this.state.rootUrl + '/uploads/posts/' + item.mobile_cover }}
                                            resizeMode='stretch'
                                            imageStyle={{ width: Dimensions.get('window').width, height: '120%' }}
                                        // blurRadius={1}
                                        >
                                            <ImageBackground style={styles.topImageBackground} source={require('../assets/images/topback.png')} resizeMode='cover'>
                                                <View style={styles.fac}>
                                                    <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                                                        <Headline style={{ color: ColorPalette.text }}>{`${item.title}`}</Headline>
                                                        <Button style={{ backgroundColor: ColorPalette.text, marginTop: 5 }} onPress={() => this._details(item)}>
                                                            <Text style={{ color: ColorPalette.textDark }}>Watch now</Text>
                                                        </Button>
                                                    </View>
                                                </View>
                                            </ImageBackground>
                                        </ImageBackground>
                                    </TouchableRipple>
                                }
                            />
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.titleHeader}>
                                <Text style={styles.activeText}>
                                    Featured Movies
                                </Text>
                            </View>
                            {CardsRow(this.state.featuredMoviesData)}
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.titleHeader}>
                                <Text style={styles.activeText}>
                                    Popular Movies
                                </Text>
                            </View>
                            {CardsRow(this.state.popularMoviesData)}
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.titleHeader}>
                                <Text style={styles.activeText}>
                                    Recent Added
                                </Text>
                            </View>
                            {CardsRow(this.state.recentMoviesData)}
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.titleHeader}>
                                <Text style={styles.activeText}>
                                    Bongo Movies
                                </Text>
                            </View>
                            {CardsRow(this.state.bongoMovies)}
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.titleHeader}>
                                <Text style={styles.activeText}>
                                    Best Series
                                </Text>
                            </View>
                            {CardsRow(this.state.seriesData)}
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.titleHeader}>
                                <Text style={styles.activeText}>
                                    Best Movies
                                </Text>
                            </View>
                            {CardsRow(this.state.moviesData)}
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.titleHeader}>
                                <Text style={styles.activeText}>
                                    Best Short Movies
                                </Text>
                            </View>
                            {CardsRow(this.state.shortMoviesData)}
                        </View>
                    </ScrollView>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: ColorPalette.primary
    },
    topContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 2 + 70,
        marginBottom: 5
    },
    topImageFull: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 2 + 70,
        borderRadius: 10
    },
    topImageBackground: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: '100%',
        height: '100%',
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    movieCard: {
        width: Dimensions.get('window').width / 2 - 70,
        height: 'auto',
        margin: 2.5,
        borderRadius: 10
    },
    imageFull: {
        width: '100%',
        height: Dimensions.get('window').height / 3 - 70,
        borderRadius: 10
    },
    row: {
        flexDirection: 'row'
    },
    titleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 7,
        marginTop: 5
    },
    activeText: {
        color: ColorPalette.text,
        margin: 5
    },
    activeAccentText: {
        color: ColorPalette.text
    },
    flatList: {
        marginLeft: 10,
        marginBottom: 10
    },
    cardContainer: {
        backgroundColor: ColorPalette.primary,
        margin: 0,
        borderRadius: 10
    },
    fac: {
        position: 'absolute',
        margin: 15,
        bottom: 0,
    },
});
export default withNavigation(HomeScreen);