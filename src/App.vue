<template>
  <Header />

  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <Component :is="Component"></Component>
    </Transition>
  </RouterView>

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

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
