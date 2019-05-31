import React from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Dimensions,
    SafeAreaView,
    FlatList,
    ImageBackground,
    ScrollView
} from 'react-native';
import {
    TouchableRipple,
    Paragraph,
    Text
} from 'react-native-paper';
import Colors from '../global/colors';
import {
    PulseIndicator
} from 'react-native-indicators';
import _ from 'lodash';





export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            rootUrl: 'https://zacutv.com',
            appId: 1020451,
            appKey: 'akdj4ej10132dkhe10',
            searchKey: null,
            searchedMovieData: [],
            limit: 36,
            loader: true
        })
    }

    _fetchSearchedMovies = _.debounce(async () => {
        const searchedMovieJson = await fetch(this.state.rootUrl + '/api/search-movies/' + this.state.limit + '?search_key=' + this.state.searchKey, {
            method: 'GET',
            headers: {
                appId: this.state.appId,
                appKey: this.state.appKey,
            }
        })
        const searchedMovieResponse = await searchedMovieJson.json();
        this.setState({ searchedMovieData: searchedMovieResponse, loader: false });
    }, 250)

    //pageHeader
    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: '#fcfaf1',
        headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
        },
    };

    componentDidMount = () => {
        this._fetchSearchedMovies();
    }

    _fetchResult = (searchKey) => {
        this.setState({ searchKey: searchKey, searchedMovieData: null, loader: true });
        this._fetchSearchedMovies();
    }

    _details = (data) => {
        // alert(JSON.stringify(data));
        this.props.navigation.navigate(data.category ? 'Details' : 'SeriesDetails', data);
    }


    render() {
        //displaying search results
        const SearchResult = () => {
            if (this.state.searchKey == null) {
                return (
                    <View></View>
                )
            }
            else if (this.state.searchKey != null && this.state.loader === true) {
                return (
                    <View
                        style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', height: Dimensions.get('window').height / 2 }}>
                        <PulseIndicator animating={true} color={'#ecf0f1'} size={30} />
                    </View>
                )
            }
            else {
                return (
                    <View>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <FlatList
                                data={this.state.searchedMovieData}
                                numColumns={3}
                                keyExtractor={({ item }) => 'item'}
                                renderItem={({ item }) =>
                                    <TouchableRipple onPress={() => this._details(item)}>
                                        <View style={styles.movieCard}>
                                            <ImageBackground
                                                imageStyle={{ borderRadius: 10 }}
                                                style={styles.imageFull}
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
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ marginTop: 20 }}>
                    <View style={{ margin: 10 }}>
                        <TextInput
                            style={{
                                height: 40,
                                color: '#fff',
                                backgroundColor: Colors.searchPlaceHolder.default,
                                borderRadius: 100,
                                marginRight: 5,
                                paddingHorizontal: 10,
                            }}
                            placeholder='Search'
                            autoFocus
                            underlineColorAndroid='transparent'
                            placeholderTextColor='#ecf0f1'
                            onChangeText={(searchKey) => this._fetchResult(searchKey)}
                            value={this.state.searchKey}
                        />
                    </View>
                </View>
                <ScrollView style={{ margin: 10 }}>
                    <SearchResult />
                </ScrollView>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary.default,
    },
    movieCard: {
        width: Dimensions.get('window').width / 2 - 70,
        height: 'auto',
        margin: 2.5,
        borderRadius:10
    },
    imageFull: {
        width: '100%',
        height: Dimensions.get('window').height / 3 - 70,
        backgroundColor: '#fff'
    },
});
