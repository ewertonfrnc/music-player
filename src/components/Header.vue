<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        class="text-white font-bold uppercase text-2xl mr-4"
        >Musicly</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!user">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Entrar / Cadastrar</a
            >
          </li>
          <template v-else>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="signOut">Sair</a>
            </li>
            <li>
              <router-link to="/manage" class="px-2 text-white">Gerenciar conta</router-link>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { signOutUser } from '../includes/firebase'

import { mapStores, mapState } from 'pinia'
import useModalStore from '../stores/modal'
import useUserStore from '../stores/user'

export default {
  name: 'Header',
  computed: {
    ...mapState(useUserStore, ['user']),
    ...mapStores(useModalStore)
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen
    },
    signOut() {
      signOutUser()
      if (this.$route.meta.requiresAuth) this.$router.push({ name: 'home' })
    }
  }
}
</script>
