//dependencies
import React from 'react';
import {
    Dimensions, 
    ScrollView, 
    StyleSheet,
    View,
    ActivityIndicator,
    FlatList,
    ImageBackground,
    Image,
    RefreshControl
} from 'react-native';
import {
    Button,
    TouchableRipple,
    Paragraph,
    Title,
    Text
  } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {
    PulseIndicator
} from 'react-native-indicators';
import Colors from '../global/colors';



export default class TvShow extends React.Component {

    //pageHeader
    static navigationOptions = ({navigation})=>({
        headerTitle:'Series',
        headerTransparent:false,
        headerTintColor:'#fcfaf1',
        // headerTitleStyle:{flex:1,textAlign:'center'},
        headerStyle:{
          backgroundColor:Colors.primary.default,
          elevation:0,
        },
      });

    //constructor
    constructor(props){
        super(props);
        this.state=({
            rootUrl:'https://zacutv.com',
            appId:1020451,
            appKey:'akdj4ej10132dkhe10',
            offSet:0,
            seriesData:[],
            holder:[],
            refreshing:false,
            loader:true,
            showHeader:true
        })
    }

    //calling fetchdata
    componentDidMount(){
        this.fetchData();
    }
  
    //fetching data
    fetchData = async()=>{
        const seriesJson = await fetch(this.state.rootUrl+'/api/series/'+this.state.offSet,{
            method:'GET',
            headers:{
                appId:this.state.appId,
                appKey:this.state.appKey
            }
        })
        const seriesResponse = await seriesJson.json();
        this.setState({seriesData:seriesResponse});
        this.setState({loader:false});
    }

    //fetching on refresh
    _onRefresh= async ()=>{
        this.setState({refreshing: true},
            ()=>{this.componentDidMount()});
        this.setState({refreshing: false});
    }

    //passing and navigating to details page
    _details = (data)=>{
        this.props.navigation.navigate('SeriesDetails', data);
    }

    _loadMore = async()=>{
        this.setState({
            offSet: this.state.offSet+10
        })
        const moviesJson = await fetch(this.state.rootUrl+'/api/series/'+this.state.offSet,{
            method:'GET',
            headers:{
                appId:this.state.appId,
                appKey:this.state.appKey
            }
        })
        const moviesResponse = await moviesJson.json();
        this.setState({
            seriesData: [...this.state.seriesData, ...moviesResponse]
        });
    }


    render() {
        if(this.state.loader==true){
            return(
                <ImageBackground 
                    source={require('../assets/images/imgbackground3.png')}
                    style={{flexGrow:1,backgroundColor:Colors.primary.default,alignItems:'center',justifyContent:'center'}}>
                    <PulseIndicator animating={true} color={'#ecf0f1'} size={30}/>
                </ImageBackground>
            );
        }
        else{
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                        />
                    }
                    style={styles.container}
                >
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <FlatList
                            data={this.state.seriesData}
                            numColumns={3}
                            keyExtractor={({item})=>'item'}
                            onEndReached={()=>this._loadMore()}
                            onEndReachedThreshold={0}
                            renderItem={({item})=>
                                <TouchableRipple onPress={()=>this._details(item)}>
                                    <View style={styles.movieCard}>
                                        <ImageBackground 
                                            style={styles.imageFull}
                                            source={{uri:this.state.rootUrl+'/uploads/posts/300/'+item.graphical_mobile_cover}}
                                        ></ImageBackground>
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
    container:{
        backgroundColor: Colors.primary.default
    },
    movieCard:{
        width:Dimensions.get('window').width/2-70,
        height:Dimensions.get('window').height/3-70,
        backgroundColor:'#f39c12',
        margin:2.5
    },
    imageFull:{
        width:'100%',
        height:'100%',
        backgroundColor:'#fff'
    },
});
