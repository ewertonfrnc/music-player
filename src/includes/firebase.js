import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { doc, getDoc, getDocs, setDoc, getFirestore, collection, query } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCXi-YWA4ZvPLX5Jy7FvRT7tpF5sUQoC8s',
  authDomain: 'music-player-2fff4.firebaseapp.com',
  projectId: 'music-player-2fff4',
  storageBucket: 'music-player-2fff4.appspot.com',
  messagingSenderId: '30371723104',
  appId: '1:30371723104:web:8f19d9de7958c4d9bf5005'
}

// Initialize Firebase
initializeApp(firebaseConfig)

export const auth = getAuth()
export const db = getFirestore()

///////////////////////////
// AUTH
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const createUserDocumentFromAuth = async (userAuth, additionalInformation) => {
  if (!userAuth) return

  const userDocRef = doc(db, 'users', userAuth.uid)
  const userSnapshot = await getDoc(userDocRef)

  if (!userSnapshot.exists()) {
    const { email } = userAuth
    const createdAt = new Date()

    try {
      await setDoc(userDocRef, {
        email,
        createdAt,
        ...additionalInformation
      })
    } catch (error) {
      console.log('Erro ao criar usuário.', error.message)
    }
  }

  return userDocRef
}

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback)

export const sigInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return

  return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth)

///////////////////////////
// DATABASE
export const getUserDocument = async (userUid) => {
  // query the users collection
  const collectionRef = collection(db, 'users')
  const q = query(collectionRef)

  // get all users documents
  const querySnapshot = await getDocs(q)

  let userData
  querySnapshot.forEach((docSnapshot) => {
    if (docSnapshot.id === userUid) userData = docSnapshot.data()
  })

  return userData
}
