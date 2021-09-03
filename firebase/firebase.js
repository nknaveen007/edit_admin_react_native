import * as firebase from 'firebase'
import '@firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyDqRn7DE5DrV_nl7W6Zp5kMgEu0a8dy_6c",
    authDomain: "react-native-editor-app.firebaseapp.com",
    projectId: "react-native-editor-app",
    storageBucket: "react-native-editor-app.appspot.com",
    messagingSenderId: "961710633055",
    appId: "1:961710633055:web:8038fbf89e89b2be30ebea"
  };
  // Initialize Firebase
  

  try {
    if (firebaseConfig.apiKey) {
        firebase.default.initializeApp(firebaseConfig);
    }
  } catch (err) {
    alert(err)
  }

  export default firebase.default