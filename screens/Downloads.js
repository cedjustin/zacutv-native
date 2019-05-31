import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    AsyncStorage,
    FlatList,
    WebView
} from 'react-native';
import {
    Title,
    ProgressBar,
    Card,
    Text,
    Chip,
    Divider,
    Snackbar,
    Button
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withNavigation } from "react-navigation";
import {
    PulseIndicator
} from 'react-native-indicators';
import Colors from '../global/colors';
import Config from '../global/config';
import { refreshToken } from '../global/requests';




class DownloadsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Downloads',
        headerTransparent: false,
        headerTintColor: Colors.activeText.default,
        headerStyle: {
            elevation: 0,
            backgroundColor: Colors.secondary.default
        }
    });

    constructor(props) {
        super(props);
        this.state = ({
            rootUrl: Config.rootUrl,
            appId: Config.appId,
            appKey: Config.appKey,
            data: [],
            counter: 0,
            downloadedObject: {
                title: null,
                remoteUrl: null,
                localPath: null,
                dateCreated: null
            }
        })
    }

    componentDidMount = async () => {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", async () => {
            this.props.navigation.state.params = this.props.navigation.state.params == undefined ? [] : this.props.navigation.state.params
            if (this.props.navigation.state.params != this.state.data) {
                this.setState({
                    data: this.props.navigation.state.params
                    // counter: this.state.data != this.props.navigation.state.params ? this.state.counter + 1 : this.state.counter
                })
                alert(JSON.stringify(this.props.navigation.state.params))
            } else {
                alert(JSON.stringify(this.state.data));
            }
        });
    }


    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    // a function to download a file
    _downloadFile = async (urlToDownload) => {
        try {

            //get progress
            const callback = downloadProgress => {
                const progress =
                    downloadProgress.totalBytesWritten /
                    downloadProgress.totalBytesExpectedToWrite;
                this.setState({
                    downloadProgress: progress,
                });
            };

            //videourl to be downloaded
            const downloadResumable = FileSystem.createDownloadResumable(
                urlToDownload,
                FileSystem.documentDirectory + this.state.data.title + '.mp4',
                {},
                callback
            );

            //downloading
            try {
                const { uri } = await downloadResumable.downloadAsync();
                this.setState({ downloadedObject: { object: { title: this.state.data.title, remoteUrl: urlToDownload, localPath: uri, dateCreated: new Date() } } })
            }
            catch (e) {
                // alert('<therererer>'+e);
            }
        }
        catch (e) {
            // alert('<herererere>'+e);
        }
    }

    // a function to register a task
    _registerTask(taskName, task) {
        TaskManager.defineTask(taskName, task);
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={{ color: Colors.activeText.default }}>{this.state.counter}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary.default,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default withNavigation(DownloadsScreen);