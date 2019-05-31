import React from 'react';
import { 
    StyleSheet,
    View,
    ImageBackground,
} from 'react-native';
import { 
    Title,
    TouchableRipple,
    Text,
} from 'react-native-paper';
import {
    PulseIndicator
} from 'react-native-indicators';
//global components
import Config from '../../../global/config'


export default class PlansScreen extends React.Component {
    constructor(props){
        super(props);
        this.state=({
            rootUrl:Config.rootUrl,
            appId:Config.appId,
            appKey:Config.appKey,
            data:this.props.navigation.state.params,
            plansLoader:true,
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


    //fetch plans
    _fecthPlans = async()=>{
        const plansJson = await fetch(this.state.rootUrl+'/api/get-plans',{
            method:'POST',
            headers:{
                appId:this.state.appId,
                appKey:this.state.appKey
            }
        })
        const plansResponse = await plansJson.json();
        var array = [];
        array.push({
            data: plansResponse
        })
        // alert(JSON.stringify(array, null, 4));
        this.setState({plansData:array,plansLoader:false});
    }

    render() {
        const Plans = ()=>{
            if(this.state.plansLoader == true){
                return(
                    <View style={[{height:'auto',justifyContent:'center',alignItems:'center'}]}>
                        <PulseIndicator animating={true} color={Colors.activeText.default} size={30}/>
                    </View>
                )
            }
            else{
                return(
                    <View style={{height:'auto'}}>
                        <FlatList
                            keyExtractor={({item})=>'item'}
                            data={this.state.plansData}
                            renderItem={(item)=>
                                <TouchableRipple 
                                    style={{marginBottom:5,backgroundColor:Colors.primary.default,borderRadius:5}}
                                    onPress={()=>{this.setState({checked:'basic'});}}
                                >
                                    <View style={[styles.row,{padding:3}]}>
                                        <View style={{width:'30%',alignItems:'center',justifyContent:'center'}}>
                                            <Title style={{color:Colors.dimActiveText.default}}>price</Title> 
                                        </View>                                              
                                        <View style={[{width:'50%',paddingBottom:3}]}>
                                            <Title style={{color:Colors.activeText.default}}>name</Title>                                                    
                                            <Text style={{color:Colors.dimActiveText.default}}>time</Text>
                                        </View>
                                        <View style={{width:'20%',alignItems:'center',justifyContent:'center'}}>
                                            <RadioButton
                                                uncheckedColor={Colors.dimActiveText.default}
                                                value='basic'
                                                color={Colors.activeText.default}
                                                status={checked==='basic'?'checked':'unchecked'}
                                                onPress={()=>{this.setState({checked:'basic'});}}
                                            />
                                        </View> 
                                    </View>
                                </TouchableRipple>
                            }
                        />
                    </View>
                )
            }
        }
        return (
            <ImageBackground style={styles.container} source={require('../../../assets/images/imgbackground3.png')}>
                <Plans />
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
});
