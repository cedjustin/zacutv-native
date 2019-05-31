import React from 'react';
import { 
    StyleSheet,
    View,
    Dimensions,
    Image,
} from 'react-native';
import { 
    Text,
    Headline
} from 'react-native-paper';
//global components
import Colors from '../../../global/colors';
import Config from '../../../global/config';



export default class AboutUsScreen extends React.Component {

    constructor(props){
        super(props);
        this.state=({
            rootUrl:Config.rootUrl,
            appId:Config.appId,
            appKey:Config.appKey,
            loader:true,
        })
    }


    static navigationOptions = ({navigation})=>({
        header:null,
        headerTransparent:true,
        headerTintColor:Colors.activeText.default,
        headerStyle:{
            elevation:0,
            backgroundColor:'transparent'
        }
        // tabBarVisible:false
      });

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.uperPart}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Headline style={{color:Colors.activeText.default}}>
                            ABOUT US
                        </Headline>
                        <Image source={require('../../../assets/images/movie.png')} style={styles.headerIcon}/>
                    </View>
                </View>
                <View style={{margin:20}}>
                    <Text></Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.activeText.default
    },
    uperPart: {
        width:'100%',
        height:Dimensions.get('window').height/3,
        backgroundColor:Colors.activeAccentText.default,
        justifyContent:'center',
        alignItems:'center'
    },
    headerIcon:{
        width:100,
        height:100
    }
});
