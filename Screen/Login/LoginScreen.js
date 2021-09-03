import React,{useState,useEffect,useContext} from 'react'
import { Platform, StyleSheet, Text, View,ImageBackground,Image ,TouchableOpacity,Dimensions} from 'react-native'
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";
import { TextInput } from 'react-native-paper';
import { Poppins_500Medium_Italic, Poppins_600SemiBold_Italic } from '@expo-google-fonts/poppins';
import { AuthContext } from '../../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-fast-toast'
import validator from 'validator';

const { width, height } = Dimensions.get('window')


const LoginScreen = () => {
    
    const { signIn } = useContext(AuthContext)
    
   const isDesktopOrLaptop = useMediaQuery({
        query: '(min-device-width: 1050px)'
      })
   const  isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' })
   const  isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
   const  isTabletOrMobileDevice = useMediaQuery({
        query: '(max-device-width: 1224px)'
   })
   const isMobile = useMediaQuery({ query: '(max-device-width: 600px)' })
      
      const toast = useToast()
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('')
    const [firsticon, setfirsticon] = useState(false)
    const [secondicon, setsecondicon] = useState(false)
    const [emailerror, setemailerror] = useState(false)
    
    const validation = async() => {
        setemailerror(false)
        if (email !== '' && password !== '') {
            let value = validator.isEmail(email)
            if (value) {
                try {
                    await AsyncStorage.setItem('token', 'hello')
                    signIn()
                } catch (error) {
                    console.log(error)
                    alert(error)
                }
            } else {
               setemailerror(true) 
               commonAlert('Please enter the valid email like example@gmail.com') 
            }
        } else {
            commonAlert('Email and Password is Required')
        }
    }

    const commonAlert = (value) => {
      
        toast.show(value, {
          duration: 4000,
          offset: 30,
          animationType: 'zoom-in',
          placement: isMobile?'bottom':'top',
          textStyle: { fontSize: isMobile?16:20,fontFamily:'Poppins_500Medium' },
          style:{marginTop:isMobile?null:'5%',backgroundColor:'darkgray'}
    })
    }
    
    return (
        <View style={styles.container}>
            
            {isDesktopOrLaptop  ? <ImageBackground resizeMode='cover' source={require('../../assets/Login/wave2.png')} style={styles.designView}>
                <Image  source={require('../../assets/Login/phone.svg')} style={{width:'70%',height:'60%'}}/>
            </ImageBackground> : null}

            <ImageBackground  style={[styles.loginView,{alignItems:isDesktopOrLaptop? 'flex-start':'center'}]} >
                <View style={[styles.loginContainer, {
                    width: isDesktopOrLaptop ? '60%' : '90%',
                    marginLeft:isDesktopOrLaptop?'10%':0
                }]}>
                    {Platform.OS == 'web' ?
                        <Image source={require('../../assets/Login/profile.svg')} resizeMode='contain' style={{ width: '20%' , height: '20%'  }} /> :
                        <Image source={require('../../assets/Login/profilePng.png')}  style={{ width: 150 , height:140  }} />}
                    <Text style={styles.HeadingText}>WELCOME</Text>
                    <TextInput
                        onFocus={() => {
                            setfirsticon(true)
                            setsecondicon(false)
                        }}
                        onBlur={() => {
                            setfirsticon(false)
                        }}
                        value={email}
                        error={emailerror}
                       onChangeText={(text)=>setemail(text)}
                       style={[styles.inputfield,{maxWidth:isDesktopOrLaptop?350:400}]}
                       label="Email"
                       left={<TextInput.Icon name="account" size={22} color={firsticon?'#536DFE':'#A6A5A5'}/>}
                    />
                    <TextInput
                        onFocus={() => {
                            setfirsticon(false)
                            setsecondicon(true)
                        }}
                        onBlur={() => {
                            setsecondicon(false)
                        }}
                        value={password}
                        onChangeText={(text)=>setpassword(text)}
                       style={[styles.inputfield,{maxWidth:isDesktopOrLaptop?350:400}]}
                       label="Password"
                       secureTextEntry
                       left={<TextInput.Icon name="lock" size={22} color={secondicon?'#536DFE':'#A6A5A5'}/>}
                    />
                    <TouchableOpacity onPress={validation} style={[styles.buttonView,{maxWidth:isDesktopOrLaptop?350:400}]}>
                          <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        width: '100%',
        backgroundColor:'#fff'
       
        
    },
    designView: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center'
      
        
    },
    loginView: {
        flex: 1,
        
        justifyContent: 'center',
        borderColor: 'red',
        
    },
    loginContainer: {
        
        alignItems: 'center',
        height: '60%',
        
        
      
        
    },
    HeadingText: {
        fontFamily: 'Poppins_600SemiBold_Italic',
        fontSize: 26,
        marginVertical:'2.5%',
        color:'#767676'
    },
    inputfield: {
        backgroundColor: '#fff',
        width: Platform.OS == 'web' ? '90%' : '90%',
        
       
        
    },
    buttonView: {
        width: Platform.OS == 'web' ? '90%' : '90%',
        paddingVertical: 7,
        backgroundColor: '#536DFE',
        borderRadius: 30,
        marginTop: 40,
        
       
    },
    buttonText: {
        alignSelf: 'center',
        fontFamily: 'Poppins_500Medium_Italic',
        color: '#fff',
        fontSize:18
    }
})
