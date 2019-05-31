import React from 'react';
import { 
    StyleSheet,
    View,
    Dimensions,
    Image,
    WebView
} from 'react-native';
import { 
    Subheading,
    Divider,
    Headline
} from 'react-native-paper';
//global components
import Colors from '../../../global/colors';
import Config from '../../../global/config';




export default class TermsAndConditionsScreen extends React.Component {

    constructor(props){
        super(props);
        this.state=({
            rootUrl:Config.rootUrl,
            appId:Config.appId,
            appKey:Config.appKey,
            loader:true,
            termsAndConditions:null
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
    
    componentDidMount = ()=>{
        this.fetchData()
    }

    //fetching data
    fetchData = async()=>{
        const termsAndConditionsrequest = await fetch(this.state.rootUrl+'/api/terms-conditions',{
            method:'GET',
            headers:{
                appId:this.state.appId,
                appKey:this.state.appKey
            }
        })
        const terms = await termsAndConditionsrequest.json();
        alert(JSON.stringify(terms.terms));
        this.setState({termsAndConditions:terms.terms});
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.uperPart}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Headline style={{color:Colors.activeText.default}}>
                            GET IN TOUCH!
                        </Headline>
                        <Image source={require('../../../assets/images/129517.png')} style={styles.headerIcon}/>
                    </View>
                </View>
                <View style={{margin:20}}>
                    <WebView
                        source={{uri:'http://zacutv.com/terms-and-conditions'}}
                        onNavigationStateChange={this.onNavigationStateChange}
                        // startInLoadingState
                        scalesPageToFit
                        javaScriptEnabled
                        style={{flex:1,backgroundColor:'black'}}
                    />
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
