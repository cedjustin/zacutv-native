import React from 'react';
import { 
    StyleSheet,
    View,
    Dimensions,
    Image
} from 'react-native';
import { 
    Subheading,
    Divider,
    Headline
} from 'react-native-paper';
//global components
import Colors from '../../../global/colors';
import Config from '../../../global/config';



export default class ContactUsScreen extends React.Component {

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
                            GET IN TOUCH!
                        </Headline>
                        <Image source={require('../../../assets/images/129517.png')} style={styles.headerIcon}/>
                    </View>
                </View>
                <View style={{margin:20}}>
                    <Subheading style={{color:Colors.activeAccentText.default}}>Tel</Subheading>
                    <Subheading>+(250) 788 304 594</Subheading>
                    <Divider />
                    <Subheading style={{color:Colors.activeAccentText.default}}>Email</Subheading>
                    <Subheading>contact@zacutv.com</Subheading>
                    <Divider />
                    <Subheading style={{color:Colors.activeAccentText.default}}>Location</Subheading>
                    <Subheading>Kigali, Nyarugenge</Subheading>
                    <Divider />
                    <Subheading style={{color:Colors.activeAccentText.default}}>Street</Subheading>
                    <Subheading>KN 2, Round</Subheading>
                    <Divider />
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
