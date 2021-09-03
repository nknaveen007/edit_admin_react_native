import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,useWindowDimensions,Image,TouchableOpacity } from 'react-native'
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";
import {LineChart,BarChart,PieChart,ProgressChart,ContributionGraph,StackedBarChart} from 'react-native-chart-kit';
import firebase from '../../firebase/firebase'
import { DataTable, Card, useTheme,Dialog, Portal } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import { useToast } from 'react-native-fast-toast'
import { Icon } from 'react-native-elements'
import { MaterialIcons,FontAwesome5,Ionicons,FontAwesome } from '@expo/vector-icons';
import { showAlert, closeAlert } from "react-native-customisable-alert";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';


const TemplatePng = () => {
    const {width,height}=useWindowDimensions()
    const isDesktopOrLaptop = useMediaQuery({query: '(min-device-width: 1050px)'})
    const isTabOrLap = useMediaQuery({ query: '(min-device-width: 601px)' })
    const isMobile = useMediaQuery({ query: '(max-device-width: 600px)' })
    const isgraphWith = useMediaQuery({ query: '(max-device-width: 370px)' })
  
   
    const [page1, setPage1] = useState(0);
    const [template, settemplate] = useState({})
    const [tempCurrentImg, settempCurrentImg] = useState(null)
    const [previewImg, setpreviewImg] = useState(false)
    const [pngArray, setpngArray] = useState([])
    const [pngCurrentImg, setpngCurrentImg] = useState(false)
    const [deleteImgDetails, setdeleteImgDetails] = useState({ index: 0, name: '' })
    const [DelImgAlert, setDelImgAlert] = useState(false)
    const [changeArray, setchangeArray] = useState([])//dummy check
    const [change, setchange] = useState('') //dummy state for reload after change
    const [loader, setloader] = useState(false)
    
    const hideDialogPreviewImage = () => {
        setpreviewImg(false)
        setpngCurrentImg(false)
    }

    useEffect(() => {
        (async () => {
            try {
                setloader(true)
                const template = await firebase.firestore().collection('poster').doc('CtJkRfZXhgHrojgR33Zn').get()
                settemplate(template.data())
                const png = await firebase.firestore().collection('Png').doc('DhRQz6RCOuhpHdxej00O').get()
                setpngArray(png.data().image)
                setloader(false)
            } catch (error) {
                setloader(false)
                alert(error)
                console.error(error)
            }
            
           
        })()
    }, [changeArray,change])

    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);
    
      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
    
        if (!result.cancelled) {
          uploadedImages(result.uri)
          
        } else if(result.cancelled){
          
        }
    };

    const uploadedImages= async(uri)=>{
        let imgName = moment().format('MMMM Do YYYY, h:mm:ss a')
      
      try {
          setloader(true)
          const document = await firebase.firestore().collection('Png').doc('DhRQz6RCOuhpHdxej00O').get()
          let array = document.data().image
          
        const responce=await fetch(uri)
        const blob=await responce.blob()
        var ref = firebase.storage().ref().child(`Png/` + imgName)
        const snapshot = await ref.put(blob);
        const imgUrl = await snapshot.ref.getDownloadURL();
          
          array.push({
            url: imgUrl,
            name: imgName
          })
           await firebase.firestore().collection('Png').doc('DhRQz6RCOuhpHdxej00O').update(
            {
              image:array
            }
          )  
        setchange(imgUrl)
       
             setloader(false)
        } catch (error) {
        console.log(error)
        setloader(false)
        }
      
    }

    const deleteImgInWeb = () => {
        setDelImgAlert(true) 
          setpreviewImg(false)
  }

  const deleteAlert = async( index,imgname) => {
   
     Platform.OS === 'web' ? deleteImgInWeb():
     showAlert({
      title: 'Are you sure?',
      message: `You want to delete the Image!`,
      alertType: 'warning',
       onPress: () => {
        
           deleteImage(index, imgname)
           setpreviewImg(false)
           closeAlert()
        
       },
       onDismiss: () => closeAlert(),btnLabel:'yes'
    
    })
    }
    
      const deleteImage=async(index,imgfileName) => {
        setloader(true)
        try {
          const document = await firebase.firestore().collection('Png').doc('DhRQz6RCOuhpHdxej00O').get()
          let array = document.data().image
          await firebase.storage().ref().child(`Png/` + imgfileName).delete()
          array.splice(index, 1)
          await firebase.firestore().collection('Png').doc('DhRQz6RCOuhpHdxej00O').update(
            {
              image:array
            }
          )  
          setchangeArray(array)
          setloader(false)
        } catch (error) {
          console.log(error)
        }
    }
    
    const commonAlert = (value, type,position) => {
      
        toast.show(value, {
          duration: 4000,
          offset: 30,
          animationType: 'zoom-in',
          placement: isMobile?'bottom':'top',
          textStyle: { fontSize: isMobile?16:20,fontFamily:'Poppins_500Medium' },
          style:{marginTop:isMobile?null:'5%',backgroundColor:'#03C52E'}
    })
    }
    
    const itemsPerPage=4
    const  from = page1 * itemsPerPage;
    const to = (page1 + 1) * itemsPerPage;



    return (
    <View style={styles.mainContainer}>
            <View style={{ marginTop: 10, marginHorizontal: 10 }}>
                <Text style={{fontFamily:'Poppins_600SemiBold',fontSize:18}}>Poster</Text>
            <Card>
          <DataTable>
            <DataTable.Header  style={{backgroundColor:'#536DFE'}}>
                        <DataTable.Title
                            style={{color:'#fff'}}
              >
               <Text style={{color:'#fff',fontSize:16}}>No's</Text>
              </DataTable.Title>
              <DataTable.Title style={{flex:2}}> <Text style={{color:'#fff',fontSize:16}}>Name</Text></DataTable.Title>
              <DataTable.Title style={{flex:2,right:'5%'}} numeric> <Text style={{color:'#fff',fontSize:16}}>Update</Text></DataTable.Title>
    
            </DataTable.Header>
  
        {Object.keys(template).map((key, index) => {
            return(
            <DataTable.Row key={index}>
                <DataTable.Cell style={styles.first} > <Text style={{ fontFamily: 'Poppins_400Regular' }}>{ index+1}</Text></DataTable.Cell>
                <Text style={{ alignSelf: 'center', flex: 2, left: '1%',textTransform:'capitalize',fontFamily:'Poppins_400Regular', }}>{key}</Text>
                <DataTable.Cell style={{ flex: 2,right:20 }} onPress={() => {
                                settempCurrentImg(template[key])
                                setpreviewImg(true)}
                            } numeric>
                        <Ionicons  name="eye" size={30} color="black" style={{ marginRight:20 }} />
                        </DataTable.Cell>
            </DataTable.Row>
            )
          })}
              
  </DataTable>
        </Card>
    </View>

            <Card style={{marginTop: 20, marginHorizontal: 10, height: 50,}}>
                <View style={{  flexDirection: 'row',justifyContent:'space-evenly',paddingVertical:10 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: 'gray', }}>Upload Templates</Text>
                    <TouchableOpacity onPress={pickImage}>
                   <FontAwesome5 name="file-upload" size={24} color="#03C52E" />
                   </TouchableOpacity>
                </View>
            </Card>

            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
            <Text style={{fontFamily:'Poppins_600SemiBold',fontSize:18}}>Template</Text>
            <Card>
          <DataTable>
            <DataTable.Header  style={{backgroundColor:'#536DFE'}}>
                        <DataTable.Title
                            style={{color:'#fff'}}
              >
               <Text style={{color:'#fff',fontSize:16}}>No's</Text>
              </DataTable.Title>
              <DataTable.Title style={{flex:2}}> <Text style={{color:'#fff',fontSize:16}}>Name</Text></DataTable.Title>
              <DataTable.Title style={{flex:2,right:'5%'}} numeric> <Text style={{color:'#fff',fontSize:16}}>Images</Text></DataTable.Title>
    
            </DataTable.Header>
  
            {pngArray.map((item,index) => (
              <DataTable.Row key={index}>
                    <DataTable.Cell style={styles.first} > <Text style={{ fontFamily:'Poppins_400Regular' }}>{index+1}</Text></DataTable.Cell>
                    <Text style={{ alignSelf: 'center', flex: 2, left: '1%',textTransform:'capitalize',fontFamily:'Poppins_400Regular' }}>{item.name}</Text>
                    <DataTable.Cell style={{ flex: 2, right: 20 }} onPress={() => {
                        setdeleteImgDetails({name:item.name,index:index})
                        settempCurrentImg(item.url)
                        setpngCurrentImg(true)
                        
                                setpreviewImg(true)}
                            } numeric>
                        <Ionicons  name="eye" size={30} color="black" style={{ marginRight:20 }} />
                        </DataTable.Cell>
          
                
              </DataTable.Row>
            ))}
  
            <DataTable.Pagination
              page={page1}
              numberOfPages={Math.round(pngArray.length / itemsPerPage)}
              onPageChange={(page) => setPage1(page)}
              label={`${from + 1}-${to} of ${pngArray.length}`}
              
                        
            />
          </DataTable>
        </Card>
            </View>


<Portal>
    <Dialog style={{maxWidth:1000,alignSelf:isTabOrLap?'center':null}} visible={previewImg} onDismiss={hideDialogPreviewImage}>
        <Dialog.ScrollArea>
                        <Image source={{ uri: tempCurrentImg }} resizeMode='contain' style={{ width: 260, height: 400 }} />
                       {pngCurrentImg?<MaterialIcons onPress={() => {
                deleteAlert( deleteImgDetails.index, deleteImgDetails.name)
              }
              } name="delete" size={45} color="#F30C0C" style={{ alignSelf:'center',marginBottom:5 }} />:null}
        </Dialog.ScrollArea>
    </Dialog>
            </Portal>
            
            <AwesomeAlert
          show={DelImgAlert}
          showProgress={false}
          title="Are You Sure?"
          message={`Do you want delete this this Image!`}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            setDelImgAlert(false)
          }}
          onConfirmPressed={() => {
           
              deleteImage( deleteImgDetails.index,deleteImgDetails.name)
              setDelImgAlert(false);
           

            
          }}
        />

<AwesomeAlert
          show={loader}
          showProgress={true}
          progressSize={26}
          progressColor={'#536DFE'}
          message="Loading....."
        />
        </View>
    )
}


export default TemplatePng

const styles = StyleSheet.create({
    mainContainer: {
        
    }
})
