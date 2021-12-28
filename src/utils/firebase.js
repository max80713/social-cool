import firebase from 'firebase/compat/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC3Hl0LNpQUHj6F3xYJGA9ATSiy9nuGSD4',
  authDomain: 'social-cool.firebaseapp.com',
  projectId: 'social-cool',
  storageBucket: 'social-cool.appspot.com',
  messagingSenderId: '397156742656',
  appId: '1:397156742656:web:1143c728333bf65c8d4ae5',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

export default firebase;

export { auth };
