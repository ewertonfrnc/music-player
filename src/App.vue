<template>
  <Header />

  <RouterView />

  <Player />

  <Auth />
</template>

<script>
import { onAuthStateChangedListener } from './includes/firebase'

import { mapWritableState } from 'pinia'
import useUserStore from './stores/user'

import Header from './components/Header.vue'
import Auth from './components/Auth.vue'
import Player from './components/Player.vue'

export default {
  name: 'App',
  components: {
    Header,
    Auth,
    Player
  },
  computed: {
    ...mapWritableState(useUserStore, ['user'])
  },
  methods: {
    checkUserSession() {
      onAuthStateChangedListener((user) => {
        this.user = user
      })
    }
  },
  mounted() {
    this.checkUserSession()
  }
}
</script>
