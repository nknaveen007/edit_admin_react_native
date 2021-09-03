import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect,useMemo} from 'react';
import { Platform,Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {useFonts,Poppins_400Regular,Poppins_400Regular_Italic,Poppins_500Medium,Poppins_500Medium_Italic,Poppins_600SemiBold,Poppins_600SemiBold_Italic,Poppins_300Light_Italic
} from '@expo-google-fonts/poppins';
import {RobotoSlab_400Regular,RobotoSlab_500Medium,RobotoSlab_600SemiBold,RobotoSlab_700Bold,} from '@expo-google-fonts/roboto-slab';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureFonts,DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AppLoading from 'expo-app-loading';
import { AuthContext } from './context/Context';
import LoginScreen from './Screen/Login/LoginScreen';
import QuotesScreen from './Screen/Main/QuotesScreen';
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";
import DrawerScreen from './Screen/Main/DrawerScreen';
import TemplatePng from './Screen/Main/TemplatePng';
import { ToastProvider } from 'react-native-fast-toast'
import CustomisableAlert, { showAlert, closeAlert } from "react-native-customisable-alert";
import DashBoard from './Screen/Main/DashBoard';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#536DFE',
    accent: '#f1c40f',
  },
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const LoginComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown:false}}/>
      </Stack.Navigator>
  )
}


const DrawerComponent = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1050px)'
  })

  return (
  <Drawer.Navigator initialRouteName='DashBoard' drawerContent={(props) => <DrawerScreen {...props} />} screenOptions={{ drawerType: isDesktopOrLaptop ? 'permanent' : 'slide', drawerActiveBackgroundColor: '#fff' }}>
      <Drawer.Screen  name="DashBoard" component={DashBoard} options={{headerStyle:{backgroundColor:'#2547F9'},headerTintColor:'#fff',headerShown:true,headerLeft:isDesktopOrLaptop?()=>null:null}}  />
      <Drawer.Screen name="Quotes" component={QuotesScreen} options={{ headerStyle: { backgroundColor: '#2547F9' }, headerTintColor: '#fff', headerShown: isDesktopOrLaptop ? false : true }} />
      <Drawer.Screen name="Png" component={TemplatePng} options={{ headerStyle: { backgroundColor: '#2547F9' }, headerTintColor: '#fff', headerShown: isDesktopOrLaptop ? false : true }} />
  </Drawer.Navigator>
  )
}



const App = () => {
  let [fontsLoaded] = useFonts({
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    RobotoSlab_400Regular,
    RobotoSlab_500Medium,
    RobotoSlab_600SemiBold,
    RobotoSlab_700Bold,
   
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  
  
  
  
  
  AsyncStorage.getItem('token').then(value => {
    setUserToken(value)
  })
  
  
  const authContext = useMemo(() => ({
    signIn: (number) => {
      AsyncStorage.getItem('token').then(value => {
        setUserToken(value)
      })
    },
  
    signOut: () => {
      AsyncStorage.clear()
      setUserToken(null);
    },
  
  
  }), []);
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

  }, []);
  
  
  
  if (!fontsLoaded || isLoading) {
    return <AppLoading />;
  } else {

    return (
<ToastProvider>
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
          <NavigationContainer>
              <StatusBar style='light' />
              {Platform.OS === 'web' ? null : <CustomisableAlert dismissable titleStyle={{ fontSize: 18, fontWeight: 'bold' }} btnLabelStyle={{
                color: 'white', paddingHorizontal: 10, textAlign: 'center',
              }}
              />}
            {userToken?<DrawerComponent/>:<LoginComponent/>}
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
</ToastProvider>
    );
  }
}

export default App


