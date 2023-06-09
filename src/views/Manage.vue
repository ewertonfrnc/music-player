<template>
  <main>
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <Upload ref="upload" :addSong="addSong" />
        </div>

        <div class="col-span-2">
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">Minhas músicas</span>
              <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
            </div>

            <div class="p-6">
              <CompositionItem
                v-for="(song, index) in songs"
                :key="song.docId"
                :song="song"
                :updateSong="updateSong"
                :index="index"
                :removeSong="removeSong"
                :updateUnsavedFlag="updateUnsavedFlag"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Upload from '../components/Upload.vue'
import CompositionItem from '../components/CompositionItem.vue'

import { getSongDocuments } from '../includes/firebase'

export default {
  name: 'Manage',
  components: {
    Upload,
    CompositionItem
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false
    }
  },
  methods: {
    updateSong(index, values) {
      this.songs[index].modifiedName = values.modifiedName
      this.songs[index].genre = values.genre
    },
    removeSong(index) {
      this.songs.splice(index, 1)
    },
    async addSong() {
      this.songs = await getSongDocuments()
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    }
  },
  async created() {
    this.addSong()
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) next()
    else {
      const leave = confirm('Você tem alterações não salvas. Tem certeza que deseja sair?')
      next(leave)
    }
  }
}
</script>

<style lang="scss" scoped></style>
