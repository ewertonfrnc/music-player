<template>
  <main>
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Ouça suas músicas favoritas</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Viva a trilha sonora da sua vida com o Musicly! Transforme cada momento em uma
            experiência musical inesquecível. Seja o protagonista da sua própria jornada sonora e
            compartilhe sua vibe com o mundo. Mergulhe em um oceano de batidas envolventes e
            deixe-se levar pelo ritmo.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">Músicas</span>
          <!-- Icon -->
          <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
        </div>

        <!-- Playlist -->
        <ol id="playlist">
          <SongItem v-for="song in songs" :key="song.uid" :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { getSongDocuments } from '../includes/firebase'
import SongItem from '../components/SongItem.vue'

export default {
  name: 'Home',
  components: { SongItem },
  data() {
    return {
      songs: [],
      maxPerPage: 5,
      pendingRequest: false,
      lastDocRef: null
    }
  },
  methods: {
    async getSongs() {
      if (this.pendingRequest) return

      this.pendingRequest = true
      this.songs = await getSongDocuments(
        this.songs,
        this.maxPerPage,
        this.getLastDocRef,
        this.lastDocRef,
        this.handleScroll
      )
      this.pendingRequest = false
    },
    handleScroll(isEmpty) {
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

      if (isEmpty === true) window.removeEventListener('scroll', this.handleScroll)
      if (bottomOfWindow) this.getSongs()
    },
    getLastDocRef(lastDoc) {
      this.lastDocRef = lastDoc
    }
  },
  async created() {
    await this.getSongs()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="scss" scoped></style>
