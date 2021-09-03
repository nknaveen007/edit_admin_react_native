import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,ScrollView,Pressable,LogBox,Image,FlatList,TouchableOpacity,Alert,Platform,RefreshControl} from 'react-native'
import { TextInput,Button, Dialog, Portal,Divider } from 'react-native-paper';
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";
import firebase from '../../firebase/firebase'
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import { useToast } from 'react-native-fast-toast'
import { Icon } from 'react-native-elements'
import { MaterialIcons,FontAwesome5 } from '@expo/vector-icons';
import { showAlert, closeAlert } from "react-native-customisable-alert";
import AwesomeAlert from 'react-native-awesome-alerts';



if (Platform.OS !== 'web') {
  LogBox.ignoreLogs(['Setting a timer for a long period of time'])
  } else {
   null
  }
const QuotesScreen = () => {
    const isDesktopOrLaptop = useMediaQuery({query: '(min-device-width: 1050px)'})
    const isTabOrLap = useMediaQuery({ query: '(min-device-width: 601px)' })
    const isMobile = useMediaQuery({ query: '(max-device-width: 600px)' })
    const islistWith = useMediaQuery({ query: '(max-device-width: 470px)' })
    
    const [textCount, settextCount] = useState(30) //text limit counter
    const [inputError, setinputError] = useState(false) //text error check
    const [webButtonVisible, setwebButtonVisible] = useState(true) //top button view
    const [topViewInmobile, settopViewInmobile] = useState(true) //tougle with button and input box

    const [Title, setTitle] = useState('')//text value
    const [categoryTitle, setcategoryTitle] = useState('')
    const [image, setimage] = useState(null)
    const [category, setcategory] = useState([])
    const [quotesList, setquotesList] = useState([])
    const [change, setchange] = useState('') //dummy state for reload after change
    const [changeArray, setchangeArray] = useState([])//dummy state for reload after change 
    const [changeDoc, setchangeDoc] = useState('') //dummy for document delete
    const [visible, setVisible] = useState(false);//category list view for mobile
    const [previewImg, setpreviewImg] = useState(false)//preview image onpress
    const [deleteImgDetails, setdeleteImgDetails] = useState({}) //delete image details stored
    const [loader, setloader] = useState(false)
  
  const [pullRefresh, setpullRefresh] = useState(false)
  const [refreshValue, setrefreshValue] = useState('')
  const [dummyFlatlistrender, setdummyFlatlistrender] = useState([1])
  const [DelImgAlert, setDelImgAlert] = useState(false)
  const [commonDeleteMessage, setcommonDeleteMessage] = useState({value:'',type:'img'})
   
    const toast = useToast()
    const hideDialog = () => setVisible(false);
    const hideDialogPreviewImage = () => setpreviewImg(false);

  useEffect(() => {
    
      (async () => {
          setloader(true)
          try {
            
            const data = await firebase.firestore().collection('url').get()
            let arrayId = []
            let arrayData=[]
            data.forEach((docs) => {
              let convertString=docs.id.toLowerCase()
              arrayId.push(convertString)
              arrayData.push(docs.data())
                })
            setcategory(arrayId)
            setquotesList(arrayData)
            setpullRefresh(false)
            setloader(false)
          } catch (error) {
            setloader(false)
            console.log(error)
            }
        })();
    }, [categoryTitle, change, changeArray,changeDoc,refreshValue])
    
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
    
      const pickImage = async (title,length) => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
    
        if (!result.cancelled) {
          setimage(result.uri);
          uploadedImages(result.uri,title,length)
          
        } else if(result.cancelled){
          
        }
    };
    
    const uploadedImages= async(uri,title)=>{
        let imgName = moment().format('MMMM Do YYYY, h:mm:ss a')
      
      try {
          setloader(true)
          const document = await firebase.firestore().collection('url').doc(title).get()
          let array = document.data().image
          
        const responce=await fetch(uri)
        const blob=await responce.blob()
        var ref = firebase.storage().ref().child(`${title}/` + imgName)
        const snapshot = await ref.put(blob);
        const imgUrl = await snapshot.ref.getDownloadURL();
          console.log(imgUrl)
          array.push({
            url: imgUrl,
            name: imgName
          })
           await firebase.firestore().collection('url').doc(title).update(
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

    const titleCheck = async () => {

      const caseChange = Title.toLowerCase()
        const res = category.includes(caseChange)
      if (!res) {
          setloader(true)
          settopViewInmobile(true)
          textChange('')
          
          try {
            const result = await firebase.firestore().collection('url').doc(caseChange).set({
              title: caseChange,
              image:[]
            })
            setcategoryTitle(caseChange)
            setloader(false)
            commonAlert(`${Title} added`,'success','top')
          } catch (error) {
            console.log(error)
          }
    } else {
          setinputError(true)
          isMobile?
            toast.show("Name already taken", {
                type:'danger',
                position: 'bottom',
                duration: 4000,
                offset: 30,
                animationType: 'slide-in'
          }):null
        }
      }

  const deleteImgInWeb = () => {
        setDelImgAlert(true) 
          setpreviewImg(false)
  }

  const deleteAlert = async(title, index,imgname,value,type) => {
   
     Platform.OS === 'web' ? deleteImgInWeb():
     showAlert({
      title: 'Are you sure?',
      message: `You want to delete the ${value}!`,
      alertType: 'warning',
       onPress: () => {
         if (type == 'img') {
           deleteImage(title, index, imgname)
           setpreviewImg(false)
           closeAlert()
         } else if(type=='doc') {
           deleteDocument(title)
           closeAlert()
         }
       },
       onDismiss: () => closeAlert(),btnLabel:'yes'
    
    })
    }
    
      const deleteImage=async(title,index,imgfileName) => {
        setloader(true)
        try {
          const document = await firebase.firestore().collection('url').doc(title).get()
          let array = document.data().image
          await firebase.storage().ref().child(`${title}/` + imgfileName).delete()
          array.splice(index, 1)
          await firebase.firestore().collection('url').doc(title).update(
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
  
  const deleteDocument = async(title) => {
    try {
      setloader(true)
      const folder = await firebase.storage().ref().child(`${title}`).listAll()
      folder.items.forEach((file) => {
       file.delete()
     })
      await firebase.firestore().collection('url').doc(title).delete() 
    setchangeDoc(title)
      console.log('delete document')
      setloader(false)
    } catch (error) {
      console.log(error)
      setloader(false)
    }
  }
  
    const textChange = (text) => {
        setinputError(false)
        let textlength = text.length
        settextCount(30-textlength)
        setTitle(text)
        if (textlength === 0) {
            setwebButtonVisible(true)
        }
        else {
            setwebButtonVisible(false)
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

  const HeaderComponent = () => {
    return (
      <>
        
        </>
    )
  }
  
 

    return (
        <View style={styles.Container}>
           
            {isMobile && topViewInmobile ?
          <View style={[styles.TopMobileButtons]}>
                    
                    <Button icon="plus" mode="contained"  onPress={() => settopViewInmobile(false)} style={{flex:1,backgroundColor:'green',marginHorizontal:'3%'}}>
                        Add Topic
                    </Button>
                    
                    <Button icon="view-list" mode="contained"  onPress={() => setVisible(true)} style={{flex:1,marginHorizontal:'3%' }}>
                        Category 
                     </Button>

          </View>
                :
                
                <>
                <View style={[styles.TopView, { height: isTabOrLap ? 75 : null, width: isTabOrLap ? '98%' : '95%', paddingHorizontal: isTabOrLap ? '2%' : null,alignItems:isTabOrLap?'flex-start':'center',paddingTop:isTabOrLap?5:null }]}>
                    
                        <TextInput
                            autoFocus={!topViewInmobile}
                            value={Title}
                            mode="outlined"
                            label="Add Category +"
                            placeholder="Category name"
                            maxLength={30}
                            right={<TextInput.Affix text={`/${textCount}`}></TextInput.Affix>}
                            onChangeText={(text) => textChange(text)}
                            error={inputError}
                            style={[styles.inputField, { width: isTabOrLap? '40%' : null,height:isTabOrLap?40:null }]}
                        />
                       
                       {inputError && isTabOrLap ? <Text style={{ color: 'red', fontFamily: 'Poppins_400Regular_Italic', marginLeft: 10 ,position:'absolute',bottom:0}}>Category name already taken</Text> : null}
                       
                    {isTabOrLap ? <View style={[styles.topButtonView]}>
                        <Button icon="sticker-check-outline" mode="contained" disabled={webButtonVisible} onPress={titleCheck} >
                            Done
                        </Button>
                    
                        <Button icon="format-clear" mode="outlined" disabled={webButtonVisible} onPress={() => textChange('')} style={{ marginLeft: '3%' }}>
                            Clear
                        </Button>
                
                <Icon
                  
                  containerStyle={{alignSelf:'center',position:'absolute',right:-10}}
                  raised
                  name='view-list'
                  type='material-community'
                  color='#536DFE'
                  onPress={() => setVisible(true)} />
                    </View> : null}
                </View>
            
                {isMobile ? <View style={[styles.topButtonViewMobile]}>
                    <Button icon="sticker-check-outline" mode="contained" disabled={webButtonVisible} onPress={titleCheck} style={{ flex:1 }}>
                        Done
                    </Button>
                    
                    <Button  mode="outlined" disabled={webButtonVisible} onPress={() => textChange('')} style={{ flex:1,marginHorizontal:'2.5%' }}>
                        Clear
                    </Button>
              
              
              <Button mode="contained" onPress={() => {
                textChange('')
                settopViewInmobile(true);
              }} style={{ flex: 1, backgroundColor: 'gray' }} >
                         Cancel
                    </Button>
                </View> : null}</> }

        <View style={{ width: isTabOrLap?'98%':'95%', height: 50, marginTop: 20,flexDirection:'row',justifyContent:'space-evenly' }}>
          <Text style={{flex:0.5,maxWidth:50,alignSelf:'center',fontFamily:'Poppins_600SemiBold_Italic',fontSize:18,alignSelf:'center',textAlignVertical:'center'}}>No's</Text>
          <Text style={{flex:1,maxWidth:200,fontFamily:'Poppins_600SemiBold_Italic',fontSize:18,alignSelf:'center',textAlignVertical:'center'}}>Category Name</Text>
          <Text style={{flex:1,alignSelf:'center',left:Platform.OS=='web'?null:15,fontFamily:'Poppins_600SemiBold_Italic',fontSize:18,alignSelf:'center',textAlignVertical:'center',marginLeft:Platform.OS==='web' && islistWith?30:20}}>List</Text>
        </View>

        <FlatList
          data={dummyFlatlistrender}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
            onRefresh={() => {
              setpullRefresh(true)
              let value = moment().format('MMMM Do YYYY, h:mm:ss a')
              setrefreshValue(value)
             }}
             refreshing={pullRefresh}
            />
           } style={{height:'100%',width:isTabOrLap?'98%':'95%',marginBottom:5}}
          renderItem={({ item }) => {
            return (
              <>
                {quotesList.map((value, index) => {
       
       return (
         <View key={index} style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-evenly' }}>
           <Text style={[{flex:0.5,maxWidth:30,backgroundColor:'#fff',marginRight:15,textAlign:'center',height:100,textAlignVertical:'center'},styles.categoryTitle]}>{index+1}</Text>
           <View style={[styles.categoryTitleView, { flex: isMobile ? 1 : 1, alignSelf: 'center', maxWidth: 200, height: 100 ,backgroundColor:'#fff'}]}>
                 <Text style={[styles.categoryTitle,{flex:1,fontSize:isMobile?16:18,color:'#484848',alignSelf:'center'}]}>{value.title}</Text>
                 
                 <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }}>
               <MaterialIcons onPress={() => {
                 setcommonDeleteMessage({value:'Entire Document',type:'doc',title:value.title})
                 deleteAlert(value.title,'hii',0,'Entire Document','doc')
                 
               }
               } name="delete" size={35} color="#F30C0C" style={{ alignSelf: 'center' }} />
                      <FontAwesome5 onPress={()=>pickImage(value.title,value.image.length)} name="upload" size={32} color="#03C52E" style={{alignSelf:'center'}}/>
               
                  </View>
            </View>
           
            <FlatList
              data={value.image}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              style={{ flex: 1, left: 15, backgroundColor: '#fff' }}
              renderItem={({item,index}) => {
                
                return (
                  <TouchableOpacity style={{ marginRight: 15 }} onPress={() => {
                    setdeleteImgDetails({ title: value.title, index: index, name: item.name, img: item.url })
                    setpreviewImg(true)
                  }
                  }>
                    <Image source={{ uri: item.url }} style={{ width: 100, height: 100 }} />
                   
                  </TouchableOpacity>
                )
              }}
            />
             </View> 
          
         
        )
                 })}
                </>
            )
          }}
          >
                
        </FlatList>

        <AwesomeAlert
          show={DelImgAlert}
          showProgress={false}
          title="Are You Sure?"
          message={`Do you want delete this ${commonDeleteMessage.value}!`}
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
            if (commonDeleteMessage.type == 'img') {
              deleteImage(deleteImgDetails.title, deleteImgDetails.index, deleteImgDetails.name)
              setDelImgAlert(false);
            } else if (commonDeleteMessage.type == 'doc') {
              console.log('yes common',commonDeleteMessage.type)
              deleteDocument(commonDeleteMessage.title)
              setDelImgAlert(false);
            }

            
          }}
        />

<AwesomeAlert
          show={loader}
          showProgress={true}
          progressSize={26}
          progressColor={'#536DFE'}
          message="Loading....."
        />
     
            
<Portal>
    <Dialog style={{maxWidth:1000,alignSelf:isTabOrLap?'center':null}} visible={previewImg} onDismiss={hideDialogPreviewImage}>
        <Dialog.ScrollArea>
              <Image source={{ uri: deleteImgDetails.img }} resizeMode='contain' style={ {width:260,height:400}}/>
              <MaterialIcons onPress={() => {
                setcommonDeleteMessage({value:'Image',type:'img'})
                deleteAlert(deleteImgDetails.title, deleteImgDetails.index, deleteImgDetails.name,'Image','img')
              }
              } name="delete" size={45} color="#F30C0C" style={{ position: 'absolute', bottom: 10, right: 10 }} />
        </Dialog.ScrollArea>
    </Dialog>
</Portal>         


<Portal>
    <Dialog style={{maxWidth:500,alignSelf:isTabOrLap?'center':null}} visible={visible} onDismiss={hideDialog}>
        <Dialog.ScrollArea>
              
                <FlatList
                  data={category}
                  keyExtractor={(item, index) => index.toString()}
                  style={{paddingBottom:20}}
                  ListHeaderComponent={() => {
                    return (
                      <Text style={{fontFamily:'RobotoSlab_500Medium',fontSize:20,marginVertical:20}}>Category List</Text>
                    )
                  }}
                  renderItem={({ item }) => {
                    return (
                      <>
                      <Text style={{ fontFamily: 'Poppins_400Regular_Italic', textTransform: 'capitalize', fontSize: 18, color: 'gray' }}>{item}</Text>
                      <Divider style={ {borderWidth:0.5,borderColor:'lightgray',width:'100%',alignSelf:'center',marginTop:8,marginBottom:10}}/>
                   </>
                    )

                  }}
                />
          
        </Dialog.ScrollArea>
    </Dialog>
</Portal>    
    </View>
    )
}

export default QuotesScreen

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        
    },
    TopView: {
        backgroundColor: '#fff',
        marginTop: 10,
        borderRadius: 3,
        flexDirection: 'row',
        
    },
    TopMobileButtons: {
        flexDirection: 'row',
        width: '95%',
        justifyContent: 'space-around',
        marginTop:20
    },
    inputField: {
        flex: 1,
        
    },
    topButtonView: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: '5%',
      height: 38,
      marginTop:10
        
    },
  topButtonViewMobile: {
      width:'95%',
        flexDirection: 'row',
        marginTop: '4%',
        alignSelf:'center',
        
  },
  categoryTitle: {
    textTransform: 'capitalize',
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    
    
  },
  categoryTitleView: {
    borderWidth: 0.2,
    borderColor:'lightgray'
  },
 
      
         
})
