import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View ,TextInput,Pressable,LogBox,Image,FlatList,TouchableOpacity,Alert} from 'react-native';
import firebase from './firebase/firebase'
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';

if (Platform.OS === 'web') {
  null
} else {
  LogBox.ignoreLogs(['Setting a timer for a long period of time'])
}
const App1 = () => {
  const [Title, setTitle] = useState('')
  const [categoryTitle, setcategoryTitle] = useState('')
  const [image, setimage] = useState(null)
  const [category, setcategory] = useState([])
  const [quotesList, setquotesList] = useState([])
  const [change, setchange] = useState('') //dummy
  const [changeArray, setchangeArray] = useState([])//dummy

  useEffect(() => {
    (async() => {
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
      
        } catch (error) {
          console.log(error)
        }
    })();
  }, [categoryTitle,change,changeArray])

  
  
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, [pickImage]);

  const pickImage = async (title,length) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
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
    console.log('done')
         
    } catch (error) {
        console.log(error)
    }
  
}
  
  const titleCheck = async() => {
    const caseChange = Title.toLowerCase()
    const res = category.includes(caseChange)
    if (!res) {
      alert('no problem')
      try {
        const result = await firebase.firestore().collection('url').doc(caseChange).set({
          title: caseChange,
          image:[]
        })
        setcategoryTitle(caseChange)
      } catch (error) {
        console.log(error)
      }
     
      
    } else {
      alert('name already taken')
    }
  }

  const deleteAlert = async(title, index,imgname) => {
   
    
    Alert.alert(
      "Delete",
      "Do you want to remove this image ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => deleteImage(title,index,imgname) }
      ]
    );
}

  const deleteImage=async(title,index,imgfileName) => {
    
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
    console.log('delete')
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <View style={styles.container}>
      <Text>title</Text>
      <TextInput
        
        value={Title}
        onChangeText={(text) => {
          setTitle(text)
        }}
        style={{borderWidth:1,width:'90%',paddingLeft:10,marginTop:'3%'}}
      />
      <Pressable onPress={titleCheck} style={{marginTop:'3%'}}>
        <Text>done</Text>
      </Pressable>

      
      
      {quotesList.map((value, index) => {
       
        return (
          <View key={index} style={{flexDirection:'row',marginTop:'10%'}}>
            <Text >{value.title}</Text>
            <TouchableOpacity onPress={()=>pickImage(value.title,value.image.length)} style={{width:20,height:20,borderWidth:1,backgroundColor:'gray',marginLeft:5}}>
                 
            </TouchableOpacity>
            <FlatList
              data={value.image}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              renderItem={({item,index}) => {
                
                return (
                  <TouchableOpacity onLongPress={()=>deleteAlert(value.title,index,item.name)}>
                    <Image source={{ uri: item.url }} style={{ width: 20, height: 20, marginHorizontal: 5 }} />
                  </TouchableOpacity>
                )
              }}
            />
             
          </View>
         
        )
      })}
    </View>
  );
}

export default App1

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
