import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import TabBarIcon from 'react-native-vector-icons/Ionicons';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  AsyncStorage
} from 'react-native';

//Screens
import HomeScreen from '../screens/HomeScreen';
import TvShowScreen from '../screens/TvShowScreen';
import MovieScreen from '../screens/MovieScreen';
import ShortMovieScreen from '../screens/ShortMovieScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SeriesDetailsScreen from '../screens/SeriesDetailsScreen';
import VideoScreen from '../screens/video/VideoScreen';
import SeriesVideoScreen from '../screens/video/SeriesVideoScreen';
import LoginScreen from '../screens/login/loggedOut/LoginScreen';
import SignUpScreen from '../screens/login//loggedOut/SignUpScreen';
import ForgotPasswordScreen from '../screens/login/loggedOut/ForgotPasswordScreen';
import AccountScreen from '../screens/login/loggedIn/AccountScreen';
import EditAccountScreen from '../screens/login/loggedIn/EditAccountScreen';
import SearchScreen from '../screens/SearchScreen';
import AuthScreen from '../screens/login/AuthScreen';
import Colors from '../global/colors'
import PlansScreen from '../screens/login/loggedIn/PlansScreen';
import DownloadsScreen from '../screens/Downloads';
import LocalVideoScreen from '../screens/login/loggedIn/video/LocalVideoScreen';
import BrowserScreen from '../screens/BrowserScreen';
import ContactUsScreen from '../screens/login/loggedIn/ContactUs';
import AboutUsScreen from '../screens/login/loggedIn/AboutUS';
import More from '../screens/More';
import ResetPassword from '../screens/login/loggedOut/ResetPasswordScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen,
  SeriesDetails: SeriesDetailsScreen,
  Search: SearchScreen,
  VideoPlayer: VideoScreen,
  LocalVideo: LocalVideoScreen,
  SeriesVideoPlayer: SeriesVideoScreen,
});

HomeStack.navigationOptions = {
  title: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      size={25}
      name={
        'md-home'
      }
      style={{ color: focused ? Colors.activeTabText.default : Colors.inactiveTabText.default }}
    />
  ),
};

HomeStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {
    title: "Home",
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        size={25}
        name={
          'md-home'
        }
        style={{ color: focused ? Colors.activeTabText.default : Colors.inactiveTabText.default }}
      />
    ),
  };
  if (routeName === 'VideoPlayer' || routeName === 'SeriesVideoPlayer' || routeName === 'LocalVideo') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
}

const BrowseStack = createStackNavigator({
  Browser: BrowserScreen,
  Movie: MovieScreen,
  TvShow: TvShowScreen,
  ShortMovie: ShortMovieScreen,
  SeriesDetails: SeriesDetailsScreen,
  More: More,
  Details: DetailsScreen,
  VideoPlayer: VideoScreen,
  SeriesVideoPlayer: SeriesVideoScreen
});

BrowseStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {
    title: "Browse",
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        size={25}
        name={
          'md-film'
        }
        style={{ color: focused ? Colors.activeTabText.default : Colors.inactiveTabText.default }}
      />
    ),
  }
  if (routeName === 'VideoPlayer' || routeName === 'SeriesVideoPlayer' || routeName === 'LocalVideo') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const SearchStack = createStackNavigator({
  Search: SearchScreen,
  Details: DetailsScreen,
  SeriesDetails: SeriesDetailsScreen,
  VideoPlayer: VideoScreen,
  SeriesVideoPlayer: SeriesVideoScreen,
});


SearchStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {
    title: "Search",
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        size={25}
        name={
          'md-search'
        }
        style={{ color: focused ? Colors.activeTabText.default : Colors.inactiveTabText.default }}
      />
    ),
  }
  if (routeName === 'VideoPlayer' || routeName === 'SeriesVideoPlayer' || routeName === 'LocalVideo') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const DownLoadsStack = createStackNavigator({
  Downloads: DownloadsScreen,
  LocalVideo: LocalVideoScreen
});


DownLoadsStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {
    title: "Downloads",
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        size={25}
        name={
          'md-arrow-down'
        }
        style={{ color: focused ? Colors.activeTabText.default : Colors.inactiveTabText.default }}
      />
    ),
  }
  if (routeName === 'LocalVideo') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

const AuthStack = createStackNavigator({
  Auth: AuthScreen
})

const LoginStack = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen,
  ForgotPassword: ForgotPasswordScreen,
  Reset: ResetPassword,
});

const LoggedInStack = createStackNavigator({
  Account: AccountScreen,
  Downloads: DownloadsScreen,
  EditAccount: EditAccountScreen,
  Details: DetailsScreen,
  Plans: PlansScreen,
  ContactUs: ContactUsScreen,
  AboutUs: AboutUsScreen,
})

const AccountStack = createSwitchNavigator(
  {
    AuthPage: AuthStack,
    LoginPage: LoginStack,
    LoggedIn: LoggedInStack
  },
  {
    initialRouteName: 'AuthPage'
  }
)

AccountStack.navigationOptions = {
  title: "Account",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      size={25}
      name={
        'md-contact'
      }
      style={{ color: focused ? Colors.activeTabText.default : Colors.inactiveTabText.default }}
    />
  ),
};

// export default createBottomTabNavigator(
//   {
//     HomeStack,
//     BrowseStack,
//     SearchStack,
//     AccountStack
//   },
//   {
//     tabBarOptions: {
//       activeTintColor: Colors.activeTabText.default,
//       inactiveTintColor: Colors.inactiveTabText.default,
//       inactiveBackgroundColor:Colors.secondary.default,
//       activeBackgroundColor:Colors.secondary.default,
//       showLabel:true
//     },
//     style:{
//       backgroundColor:'#1a1a1a',
//       topBorderColor:'#1a1a1a'
//     },
//     animationEnabled:true,
//     initialRouteName:'HomeStack'
//   }
// );

export default createMaterialBottomTabNavigator({
  Home: {
    screen: HomeStack
  },
  Browser: {
    screen: BrowseStack
  },
  Search: {
    screen: SearchStack
  },
  // DownLoads:{
  //   screen: DownLoadsStack
  // },
  Account: {
    screen: AccountStack,
  },
}, {
    initialRouteName: 'Home',
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: Colors.primary.default },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222'
  },
})