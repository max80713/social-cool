import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC3Hl0LNpQUHj6F3xYJGA9ATSiy9nuGSD4',
  authDomain: 'social-cool.firebaseapp.com',
  projectId: 'social-cool',
  storageBucket: 'social-cool.appspot.com',
  messagingSenderId: '397156742656',
  appId: '1:397156742656:web:1143c728333bf65c8d4ae5',
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };
