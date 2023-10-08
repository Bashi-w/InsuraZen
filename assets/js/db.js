//firebase
const firebaseConfig = {
    apiKey: "AIzaSyAIOwX6ilFcgRhbBeaV8Ds_ijOOh6Iq-48",
    authDomain: "insurazen-cab4e.firebaseapp.com",
    projectId: "insurazen-cab4e",
    storageBucket: "insurazen-cab4e.appspot.com",
    messagingSenderId: "1029999099896",
    appId: "1:1029999099896:web:fb6b223fbaf88a7af7200d",
    measurementId: "G-JYTM4ZM4S4"
    };


    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    const auth = firebase.auth();