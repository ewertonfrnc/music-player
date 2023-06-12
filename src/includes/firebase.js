import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
} from 'firebase/auth'
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  getFirestore,
  collection,
  query,
  updateDoc,
  deleteDoc,
  limit,
  startAfter,
  orderBy,
  where,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { nanoid } from 'nanoid'

const firebaseConfig = {
  apiKey: 'AIzaSyCXi-YWA4ZvPLX5Jy7FvRT7tpF5sUQoC8s',
  authDomain: 'music-player-2fff4.firebaseapp.com',
  projectId: 'music-player-2fff4',
  storageBucket: 'music-player-2fff4.appspot.com',
  messagingSenderId: '30371723104',
  appId: '1:30371723104:web:8f19d9de7958c4d9bf5005'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
initializeFirestore(app, { cache: CACHE_SIZE_UNLIMITED })

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

///////////////////////////
// AUTH
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback)

export const sigInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return

  return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth)

///////////////////////////
// DATABASE
export const createUserDocumentFromAuth = async (userAuth, additionalInformation) => {
  if (!userAuth) return

  const userDocRef = doc(db, 'users', userAuth.uid)
  const userSnapshot = await getDoc(userDocRef)

  if (!userSnapshot.exists()) {
    const { email } = userAuth
    const createdAt = new Date()

    try {
      await setDoc(userDocRef, {
        displayName: additionalInformation.name,
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

export const createSongsDocument = async (song, additionalInformation) => {
  if (!song) return

  const songDocRef = doc(db, 'songs', song.uid)
  const songSnapshot = await getDoc(songDocRef)

  if (!songSnapshot.exists()) {
    const createdAt = new Date()

    try {
      await setDoc(songDocRef, {
        createdAt,
        ...song,
        ...additionalInformation
      })
    } catch (error) {
      console.log('Erro ao adicionar música', error.message)
    }
  }

  return songDocRef
}

export const createCommentDocument = async (comment) => {
  if (!comment) return

  const commentDocRef = doc(db, 'comments', comment.uid)
  const commentSnapshot = await getDoc(commentDocRef)

  if (!commentSnapshot.exists()) {
    try {
      await setDoc(commentDocRef, {
        ...comment
      })
    } catch (error) {
      console.log('Erro ao adicionar música', error.message)
    }
  }

  return commentDocRef
}

export const getSongDocuments = async (
  songsArr = [],
  maxPerPage,
  getLastDocRef,
  lastDocRef,
  handleScroll
) => {
  // query the songs collection
  const collectionRef = collection(db, 'songs')
  const q = query(
    collectionRef,
    orderBy('modifiedName'),
    startAfter(lastDocRef || 0),
    limit(maxPerPage)
  )

  const querySnapshot = await getDocs(q)

  if (getLastDocRef) {
    getLastDocRef(querySnapshot.docs[querySnapshot.docs.length - 1])
    handleScroll(querySnapshot.empty)
  }

  let songs = []
  querySnapshot.forEach((docSnapshot) => {
    const song = {
      docId: docSnapshot.id,
      ...docSnapshot.data()
    }

    songs.push(song)
  })

  songs = [...songsArr, ...songs]
  return songs
}

export const getAllComments = async (routeId) => {
  let comments = []

  const commentsRef = collection(db, 'comments')
  const q = query(commentsRef, where('songId', '==', routeId))

  const commentSnapshot = await getDocs(q)
  commentSnapshot.forEach((comment) => comments.push(comment.data()))

  return comments
}

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

export const getSongDocument = async (songId, router) => {
  const songDocRef = doc(db, 'songs', songId)
  const songSnapshot = await getDoc(songDocRef)

  if (!songSnapshot.exists()) {
    router.push({ name: 'home' })
    return
  }

  return songSnapshot.data()
}

export const updateSongDocument = async (songUid, values) => {
  const songDocRef = doc(db, 'songs', songUid)
  await updateDoc(songDocRef, { ...values })
}

export const deleteSongFromDatabase = async (song) => {
  // query the songs collection
  const collectionRef = collection(db, 'songs')
  const q = query(collectionRef)

  // get all songs documents
  const querySnapshot = await getDocs(q)

  querySnapshot.forEach((doc) => {
    if (song.uid === doc.ref.id) deleteDoc(doc.ref)
  })
}

///////////////////////////
// STORAGE
export const musicUpload = (file, uploadsArr, user, updateSongList) => {
  const songsRef = ref(storage, `songs/${file.name}`)
  const uploadTask = uploadBytesResumable(songsRef, file)

  const uploadIndex =
    uploadsArr.push({
      uploadTask,
      currentProgress: 0,
      name: file.name,
      variant: 'bg-blue-400',
      icon: 'fas fa-spinner fa-spin',
      textClass: ''
    }) - 1

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      uploadsArr[uploadIndex].currentProgress = progress
    },
    (error) => {
      uploadsArr[uploadIndex].variant = 'bg-red-400'
      uploadsArr[uploadIndex].icon = 'fas fa-times'
      uploadsArr[uploadIndex].textClass = 'text-red-400'
      console.log(error)
    },
    async () => {
      const userData = await getUserDocument(user.uid)
      const song = {
        uid: nanoid(),
        displayName: userData.name || '',
        originalName: uploadTask.snapshot.ref.name,
        modifiedName: uploadTask.snapshot.ref.name,
        genre: '',
        commentCount: 0
      }
      song.url = await getDownloadURL(uploadTask.snapshot.ref)
      const songRef = await createSongsDocument(song)
      updateSongList(songRef)

      uploadsArr[uploadIndex].variant = 'bg-green-400'
      uploadsArr[uploadIndex].icon = 'fas fa-check'
      uploadsArr[uploadIndex].textClass = 'text-green-400'
    }
  )
}

export const deleteSongFromStorage = async (song) => {
  const songRef = ref(storage, `songs/${song.originalName}`)
  await deleteObject(songRef)
}
