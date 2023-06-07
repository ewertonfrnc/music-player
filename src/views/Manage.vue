<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <Upload ref="upload" />
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
            />
          </div>
        </div>
      </div>
    </div>
  </section>
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
      songs: []
    }
  },
  methods: {
    updateSong(index, values) {
      this.songs[index].modifiedName = values.modifiedName
      this.songs[index].genre = values.genre
    },
    removeSong(index) {
      this.songs.splice(index, 1)
    }
  },
  async created() {
    this.songs = await getSongDocuments()
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.upload.cancelUploads()
    next()
  }
}
</script>

<style lang="scss" scoped></style>
