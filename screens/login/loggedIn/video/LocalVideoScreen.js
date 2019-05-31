import React from 'react';
import { 
    StyleSheet,
    View,
    BackHandler,
    Dimensions,
    StatusBar
} from 'react-native';
import { 
    TouchableRipple
} from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    PulseIndicator
} from 'react-native-indicators';



const BackButton =(props)=>{
    return(
        <View style={{width:Dimensions.get('window').width/6-50}}>
            <TouchableRipple onPress={()=>{
                ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT)
                StatusBar.setHidden(false);
                props.navigation.navigate('Downloads')
                }} 
                style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Ionicons name='ios-arrow-back' size={20} style={{color:'#ecf0f1'}}/>
            </TouchableRipple>
        </View>
    )
}
export default class LocalVideoScreen extends React.Component {
    constructor(props){
        super(props);
        this.state=({
            rootUrl:'http://zacutv.com',
            appId:1020451,
            appKey:'akdj4ej10132dkhe10',
            videoUrl:null,
            data:this.props.navigation.state.params,
            loading:false,
        })
    }


    static navigationOptions = ({navigation})=>({
        headerTransparent:true,
        headerTintColor:'#fcfaf1',
        headerStyle:{
          backgroundColor:'transparent'
        },
        headerLeft: <BackButton navigation={navigation}/>,
        // tabBarVisible:false
      });
    
    componentDidMount() {
        ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        StatusBar.setHidden(true);
    }

    componentWillUnmount() {
        // ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE);
        // BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    
    handleBackPress = () => {
        ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
        StatusBar.setHidden(false);
        this.props.navigation.navigate('Downloads');
        return true;
    };

    render() {
        if(this.state.loading == true){
            return(
                <View style={[styles.container,{height:Dimensions.get('window').height,justifyContent:'center',alignItems:'center'}]}>
                    <PulseIndicator animating={true} color={'#ecf0f1'} size={30}/>
                </View>
            )
        }
        else{
            return (
                    // <Video
                    //     source={{ uri: this.state.data.item.object.localPath }}
                    //     rate={1.0}
                    //     volume={1.0}
                    //     isMuted={false}
                    //     resizeMode="cover"
                    //     shouldPlay
                    //     useNativeControls
                    //     style={{ width: '100%', height: '100%' }}
                    // />
                    <View></View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});
