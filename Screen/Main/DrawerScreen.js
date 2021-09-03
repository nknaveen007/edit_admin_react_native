import React,{useState,useEffect, useContext,useReducer,useRef} from 'react'
import {Image,  StyleSheet, View,SafeAreaView, TouchableOpacity,Alert,StatusBar ,ActivityIndicator,Modal,Pressable, Dimensions, Platform} from 'react-native'
import { DrawerItem, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {Text,Divider,Button} from 'react-native-paper';
import { MaterialCommunityIcons,FontAwesome5,Feather,MaterialIcons } from '@expo/vector-icons';
import { Icon ,Overlay} from 'react-native-elements'
import { AuthContext } from '../../context/Context';
import { LinearGradient } from 'expo-linear-gradient';
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";
import { showAlert, closeAlert } from "react-native-customisable-alert";
import AwesomeAlert from 'react-native-awesome-alerts';



const DrawerScreen = ({ ...props }) => {
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-device-width: 1050px)' })
  const [WebAlert, setWebAlert] = useState(false)
 
  const { signOut } = useContext(AuthContext)
  const [Select, setSelect] = useState({
    png: false,
    quotes: false,
    dashboard:true
  })
  
  const hideDialog = () => setWebAlert(false);
 

  const createTwoButtonAlert = () => {
    if (Platform.OS == 'web') {
       setWebAlert(true)
     }else{
      showAlert({
        title: 'Are you sure?',
        message: `You want to Logout?`,
        alertType: 'warning',
         onPress: () => {
           signOut()
           closeAlert()
         },
         onDismiss: () => closeAlert(),btnLabel:'yes'
      
      })
     }
    }
   
  const nav=(name) => {
    switch (name) {
      case 'DashBoard':
        setSelect({
          png: false,
          quotes: false,
          dashboard:true
        })
        break;
      
      case 'Quotes':
        setSelect({
          png: false,
          quotes: true,
          dashboard:false
        })
        
        break;
     
      case 'Png':
        setSelect({
          png: true,
          quotes: false,
          dashboard:false
        })
        break;
      
      default:
        break;
    }
    props.navigation.navigate(name)
  }
      

  return (
<LinearGradient
    colors={['#0029FF','#3F5EFD']}
      style={styles.mainContainer}>
      
<DrawerContentScrollView  {...props}  >
        <Text style={styles.HeadingText}>Technotoil</Text>
        <Divider style={ {borderWidth:0.5,borderColor:'#fff',width:'90%',alignSelf:'center',marginBottom:'10%'}}/>

<DrawerItem
   icon={({ color, size }) => (<MaterialCommunityIcons name="monitor-dashboard" color={Select.dashboard?'#0029FF':'#fff'} size={isDesktopOrLaptop?25:22} />)}
   label="Dashboard"
   labelStyle={[styles.textNav,{color:Select.dashboard?'#0029FF':'#fff',fontSize:isDesktopOrLaptop?16:15}]}
   style={{backgroundColor:Select.dashboard?'#fff':null}}
   onPress={() => nav('DashBoard')
}/>  
        
<DrawerItem
   icon={({ color, size}) => (<MaterialCommunityIcons name="comment-quote-outline" color={Select.quotes?'#0029FF':'#fff'} size={isDesktopOrLaptop?25:22}/>)}
   label='Quotes'
   labelStyle={[styles.textNav,{color:Select.quotes?'#0029FF':'#fff',fontSize:isDesktopOrLaptop?16:17}]}
   style={{backgroundColor:Select.quotes?'#fff':null}}
   onPress={() => nav('Quotes')}
 />

<DrawerItem
   icon={({ color, size }) => (<MaterialCommunityIcons name="picture-in-picture-top-right" color={Select.png?'#0029FF':'#fff'} size={isDesktopOrLaptop?25:22} />)}
   label="Template"
   labelStyle={[styles.textNav,{color:Select.png?'#0029FF':'#fff',fontSize:isDesktopOrLaptop?16:15}]}
   style={{backgroundColor:Select.png?'#fff':null}}
   onPress={() => nav('Png')
    
    }
    
        />
        

  <Button icon="logout" mode="outlined" color='#fff' style={{
          width: 150, borderColor: '#fff', borderWidth: 1, alignSelf:isDesktopOrLaptop?'flex-start': 'center', marginTop:50,marginLeft:'5%'}} onPress={createTwoButtonAlert}>
    Logout
  </Button>
       
  <AwesomeAlert
          show={WebAlert}
          showProgress={false}
          title="Are You Sure?"
          message={`Do you want to Logout!`}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="cancel"
          confirmText="Yes"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            hideDialog()
          }}
          onConfirmPressed={() => {
            signOut()
            hideDialog()
            
          }}
        />

    </DrawerContentScrollView>
</LinearGradient>
       
      )
}

export default DrawerScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex:1
  },
  drawerContent: {
    alignContent:'space-between',
    flex:1
  },
  textNav: {
    fontFamily: 'Poppins_500Medium',
    
  },
  HeadingText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold_Italic',
    marginBottom: '5%',
    marginTop:'10%'
  }
   
    
   
})
