//dependencies
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    View,
    FlatList,
    ImageBackground,
    RefreshControl
} from 'react-native';
import {
    TouchableRipple,
    Headline,
    Chip,
    Text,
    Badge
} from 'react-native-paper';
import {
    PulseIndicator
} from 'react-native-indicators';
//global components
import Colors from '../global/colors';
import Config from '../global/config';




export default class More extends React.Component {

    //pageHeader
    static navigationOptions = ({ navigation }) => ({
        headerTransparent: false,
        headerTintColor: '#fcfaf1',
        // headerTitleStyle:{flex:1,textAlign:'center'},
        headerStyle: {
            backgroundColor: Colors.primary.default,
            elevation: 0
        },
    });

    //constructor
    constructor(props) {
        super(props);
        this.state = ({
            rootUrl: Config.rootUrl,
            appId: Config.appId,
            appKey: Config.appKey,
            offSet: 0,
            moviesData: [],
            refreshing: false,
            loader: true,
            showHeader: true,
            params: this.props.navigation.state.params
        })
    }

    //calling fetchdata
    componentDidMount() {
        this.fetchData();
    }

    //fetching data
    fetchData = async () => {
        const moviesJson = await fetch(this.state.rootUrl + '/api/movies-by-condition/' + this.state.offSet + '?type=' + this.state.params.type + '&id=' + this.state.params.id, {
            method: 'GET',
            headers: {
                appId: this.state.appId,
                appKey: this.state.appKey
            }
        })
        const moviesResponse = await moviesJson.json();
        this.setState({
            moviesData: [...this.state.moviesData, ...moviesResponse]
        });
        this.setState({ loader: false });
    }

    _loadMore = () => {
        this.setState({
            offSet: this.state.offSet + 10
        });
        fetch(this.state.rootUrl + '/api/movies-by-condition/' + this.state.offSet + '?type=category&id=' + this.state.params.id, {
            method: 'GET',
            headers: {
                appId: this.state.appId,
                appKey: this.state.appKey
            }
        }).then(res => res.json()).then(res => {
            this.setState({
                moviesData: [...this.state.moviesData, ...res]
            });
        })
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

    //fetching on refresh
    _onRefresh = async () => {
        this.setState({ refreshing: true },
            () => { this.componentDidMount() });
        this.setState({ refreshing: false });
    }

    //passing and navigating to details page
    _details = (data) => {
        this.props.navigation.navigate('Details', data);
    }


    render() {
        if (this.state.loader == true) {
            return (
                <ImageBackground
                    source={require('../assets/images/imgbackground3.png')}
                    style={{ flexGrow: 1, backgroundColor: Colors.primary.default, alignItems: 'center', justifyContent: 'center' }}>
                    <PulseIndicator animating={true} color={'#ecf0f1'} size={30} />
                </ImageBackground>
            );
        }
        else {
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                        />
                    }
                    style={styles.container}
                >
                    <View style={{ margin: 20 }}>
                        <Headline style={{ color: Colors.activeText.default }}>{`${this.state.params.name}`}</Headline>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <FlatList
                            data={this.state.moviesData}
                            numColumns={3}
                            keyExtractor={({ item }) => 'item'}
                            onEndReached={() => this._loadMore()}
                            onEndReachedThreshold={10}
                            renderItem={({ item }) =>
                                <TouchableRipple onPress={() => this._details(item)}>
                                    <View style={styles.movieCard}>
                                        <ImageBackground
                                            style={styles.imageFull}
                                            imageStyle={{borderRadius:10}}
                                            source={{ uri: this.state.rootUrl + '/uploads/posts/300/' + item.graphical_mobile_cover }}
                                        >
                                            <Badge style={{ opacity: this._checkIfnew(item.published_at) == 'true' ? 1 : 0, position: 'absolute', bottom: 5, right: 5, backgroundColor: Colors.activeAccentText.default }} mode='flat'>
                                                <Text style={{ color: Colors.activeText.default }}>New</Text>
                                            </Badge>
                                        </ImageBackground>
                                    </View>
                                </TouchableRipple>
                            }
                        />
                    </View>
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary.default
    },
    movieCard: {
        width: Dimensions.get('window').width / 2 - 70,
        height: Dimensions.get('window').height / 3 - 70,
        backgroundColor: '#f39c12',
        margin: 2.5,
        borderRadius:10
    },
    imageFull: {
        width: '100%',
        height: '100%',
    },
});
