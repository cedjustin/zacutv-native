import React from 'react';
import { 
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  ImageBackground,
  ScrollView
} from 'react-native';
import {
    Title,
    Text,
    Button,
    Paragraph,
    Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Header } from 'react-navigation';
//global components
import Colors from '../../../global/colors';
import Config from '../../../global/config';


export default class ResetPassword extends React.Component{
  //pageHeader
  static navigationOptions = {
        // headerTransparent:true,    
        headerTintColor:'#fcfaf1',
        headerStyle:{
            backgroundColor:Colors.primary.default,
            elevation:0
        },
    };

    constructor(props){
        super(props);
        this.state = ({
            email:null,
            code:null,
            password:null,
            cpassword:null,
            message:null,
            showAlert:false,
            rootUrl:Config.rootUrl,
            appId:Config.appId,
            appKey:Config.appKey,
        })
    }

    _send = async()=>{
        if(this.state.email == null || this.state.password == null || this.state.code == null || this.state.cpassword == null){
            this.setState({
                message:'please fill all the fields',
                showAlert:true
            })
        }
        else if(this.state.password != this.state.cpassword){
            this.setState({
                message:'Passwords doesnt match',
                showAlert:true
            })
        }
        else{
            var resetPasswordResponse;
            await fetch(this.state.rootUrl+'/api/reset-pwd',{
                method:'POST',
                headers:{
                appId:this.state.appId,
                appKey:this.state.appKey,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    email:this.state.email,
                    code:this.state.code,
                    password:this.state.password,
                    password_confirmatiom:this.state.cpassword,
                })
            }).then((res)=>
                resetPasswordResponse = res.json()
            )
            this.setState({message:resetPasswordResponse._55.message,showAlert:true})
            // alert(JSON.stringify(t,null,4))
        }
    }

    _navigateToReset = ()=>{
        this.props.navigation.navigate('Reset');
    }

    render() {
        const {showAlert} = this.state;
        return (
            <ImageBackground style={styles.container} source={require('../../../assets/images/imgbackground3.png')}>
                <KeyboardAvoidingView 
                    behavior='padding' 
                    style={{flex:1,width:'100%',height:'100%'}}
                    keyboardVerticalOffset = {Header.HEIGHT + 40}
                >
                    <ScrollView>
                        <View style={styles.input_container}>
                            <View style={styles.subtitles}>
                                <Title style={styles.subtitle1}>
                                    Enter the email associated with your account
                                </Title>
                                <Paragraph style={styles.subtitle2}>
                                    Enter the code sent in your email
                                </Paragraph>
                            </View>
                            <View style={styles.white_input_container}>
                                <View style={styles.row}>
                                    <Icon name='mail' color='#354656' size={15}/>                            
                                    <TextInput
                                        placeholder='Email'
                                        placeholderTextColor='#bdc3c7'
                                        returnKeyType='next'
                                        keyboardType='default'
                                        underlineColorAndroid='transparent'
                                        style={styles.input}
                                        onChangeText={(email)=>this.setState({email:email})}
                                        onSubmitEditing={()=>this.code.focus()}
                                    />
                                </View>
                                <Divider style={styles.divider}/>
                                <View style={styles.row}>
                                    <Icon name='command' color='#354656' size={15}/>                            
                                    <TextInput
                                        placeholder='Code'
                                        secureTextEntry={false}
                                        placeholderTextColor='#bdc3c7'
                                        returnKeyType='next'
                                        keyboardType='default'
                                        underlineColorAndroid='transparent'
                                        style={styles.input}
                                        onChangeText={(code)=>this.setState({code:code})}
                                        ref={(input)=> this.code=input}
                                        onSubmitEditing={()=>this.password.focus()}
                                    />
                                </View>
                                <Divider style={styles.divider}/>
                                <View style={styles.row}>
                                    <Icon name='lock' color='#354656' size={15}/>                            
                                    <TextInput
                                        placeholder='Password'
                                        secureTextEntry={true}
                                        placeholderTextColor='#bdc3c7'
                                        returnKeyType='next'
                                        keyboardType='default'
                                        underlineColorAndroid='transparent'
                                        style={styles.input}
                                        onChangeText={(password)=>this.setState({password:password})}
                                        ref={(input)=> this.password=input}
                                        onSubmitEditing={()=>this.cpassword.focus()}
                                    />
                                </View>
                                <Divider style={styles.divider}/>
                                <View style={styles.row}>
                                    <Icon name='lock' color='#354656' size={15}/>                            
                                    <TextInput
                                        placeholder='Comfirm Password'
                                        secureTextEntry={true}
                                        placeholderTextColor='#bdc3c7'
                                        returnKeyType='next'
                                        keyboardType='default'
                                        underlineColorAndroid='transparent'
                                        style={styles.input}
                                        onChangeText={(cpassword)=>this.setState({cpassword:cpassword})}
                                        ref={(input)=> this.cpassword=input}
                                    />
                                </View>
                            </View>
                            <View style={styles.lpart}>
                                <Button mode='contained' style={styles.buttonlight} onPress={()=>this._send()}>
                                    <Text style={styles.textDark}>
                                        Send
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                    <AwesomeAlert
                        show={showAlert}
                        onDismiss={()=>this.setState({showAlert:false})}
                        showProgress={false}
                        message={this.state.message}
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={false}
                        cancelText="Login"
                        confirmText="Register"
                        confirmButtonColor={Colors.activeAccentText.default}
                        cancelButtonColor="#1a1a1a"
                        onDismiss={()=>this.setState({showAlert:false})}
                    />
                </KeyboardAvoidingView>
            </ImageBackground>
        );
        }
    }
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    text:{
        color:'#ecf0f1'
    },
    textDark:{
        color:'#1a1a1a'
    },
    input_container:{
        width:'100%',
    },
    input:{
        width:'70%',
        height:40,
        color:'#1c1f24',
        paddingHorizontal:10,
        marginTop:10,
        marginBottom:10
    },
    buttonlight:{
        backgroundColor:Colors.activeText.default,
        marginTop:10,
        marginBottom:10,
        height:Dimensions.get('window').width/4-30,
        borderRadius:100,
        alignContent:'center',
        justifyContent:'center'
    },
    subtitles:{
        justifyContent:'center',
        paddingBottom:20,
        paddingTop:10
    },
    subtitle1:{
        color:Colors.activeText.default,
        textAlign:'center'
    },
    subtitle2:{
        color:Colors.dimActiveText.default,
        textAlign:'center',
        marginTop:10
    },
    row:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start'
    },
    lpart:{
        justifyContent:'center',
        alignItems:'center'
    },
    white_input_container:{
        backgroundColor:'#ecf0f1',
        justifyContent:'center',
        alignItems:'center',
        margin:10,
        borderRadius:5
    },
    divider:{
        backgroundColor:'#1a1a1a',
        width:'90%',
    },
});
