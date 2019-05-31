import React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Dimensions,
    ScrollView
} from 'react-native';
import {
    Text,
    Button,
    Subheading
} from 'react-native-paper';
import {
    PulseIndicator
} from 'react-native-indicators';
//global components
import Colors from '../global/colors';
import Config from '../global/config';


export default class BrowserScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            rootUrl: Config.rootUrl,
            appId: Config.appId,
            appKey: Config.appKey,
            loader: true,
            categories: null,
            genres: null,
            open: false
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
    componentDidMount = async () => {
        // ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
    }

    componentDidMount = () => {
        this.fetchData()
    }

    //fetching data
    fetchData = async () => {
        const categoriesrequest = await fetch(this.state.rootUrl + '/api/get-categories', {
            method: 'GET',
            headers: {
                appId: this.state.appId,
                appKey: this.state.appKey
            }
        })
        const categoriesjson = await categoriesrequest.json();
        this.setState({ categories: categoriesjson });

        // genres
        const genresrequest = await fetch(this.state.rootUrl + '/api/get-genres', {
            method: 'GET',
            headers: {
                appId: this.state.appId,
                appKey: this.state.appKey
            }
        })
        const genresjson = await genresrequest.json();
        this.setState({ genres: genresjson });
        this.setState({ loader: false });
        setTimeout(this.setState({ open: true }), 5000);
    }

    _navigate = (item, type) => {
        item.type = type;
        this.props.navigation.navigate('More', item);
    }

    render() {
        if (this.state.loader === true) {
            return (
                <View style={[styles.container, { height: Dimensions.get('window').height / 4 - 70, justifyContent: 'center', alignItems: 'center' }]}>
                    <PulseIndicator animating={true} color={Colors.activeText.default} size={30} />
                </View>
            )
        }
        else {
            return (
                <ScrollView style={styles.container}>
                    <View style={{ margin: 20 }}>
                        <Subheading style={{ color: Colors.activeText.default, marginTop: 20 }}>Categories</Subheading>
                        <FlatList
                            style={styles.flatList}
                            data={this.state.categories}
                            keyExtractor={({ item }) => 'key'}
                            renderItem={({ item }) =>
                                <Button style={{ backgroundColor: 'rgba(255,255,255,0.2)', marginTop: 5 }} onPress={() => this._navigate(item, 'category')}>
                                    <Text style={{ color: Colors.activeText.default }}>{`${item.name}`}</Text>
                                </Button>
                            }
                        />
                    </View>
                    <View style={{ margin: 20 }}>
                        <Subheading style={{ color: Colors.activeText.default, marginTop: 20 }}>Genres</Subheading>
                        <FlatList
                            style={styles.flatList}
                            data={this.state.genres}
                            keyExtractor={({ item }) => 'key'}
                            renderItem={({ item }) =>
                                <Button style={{ backgroundColor: 'rgba(255,255,255,0.2)', marginTop: 5 }} onPress={() => this._navigate(item, 'genres')}>
                                    <Text style={{ color: Colors.activeText.default }}>{`${item.name}`}</Text>
                                </Button>
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
        flex: 1,
        backgroundColor: Colors.primary.default
    },
});
