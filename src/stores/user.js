import { defineStore } from 'pinia'

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
  sigInAuthUserWithEmailAndPassword,
  getUserDocument
} from '../includes/firebase'

export default defineStore('user', {
  state: () => {
    user: null
  },
  actions: {
    async register(values) {
      const { email, password, name, age, country } = values

      const { user } = await createAuthUserWithEmailAndPassword(email, password)
      createUserDocumentFromAuth(user, { name, age, country })

      this.user = user
    },
    async authenticate(values) {
      const { email, password } = values

      const { user } = await sigInAuthUserWithEmailAndPassword(email, password)
      const userData = await getUserDocument(user.uid)

      return userData
    }
  }
})
