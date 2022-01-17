import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyBvU63XRhjcBUkhT78n2ulTrfF2ODGFPfA",
    authDomain: "sistema-chamado-79446.firebaseapp.com",
    projectId: "sistema-chamado-79446",
    storageBucket: "sistema-chamado-79446.appspot.com",
    messagingSenderId: "1000165188677",
    appId: "1:1000165188677:web:28b1c1cdf8248afcd8af2c",
    measurementId: "G-RXF10PKV0J"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;