<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Carregar arquivos</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>

    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragOver }"
        @drag.prevent=""
        @dragstart.prevent=""
        @dragend.prevent="isDragOver = false"
        @dragover.prevent="isDragOver = true"
        @dragenter.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="upload($event)"
      >
        <h5>Clique ou arraste suas músicas aqui</h5>
      </div>

      <input type="file" multiple @change="upload($event)" />

      <hr class="my-6" />

      <!-- Progess Bars -->
      <div v-for="upload in uploads" :key="upload.name" class="mb-4">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.textClass">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.currentProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { musicUpload, createSongsDocument } from '../includes/firebase'
import useUserStore from '../stores/user'
import { mapState } from 'pinia'

export default {
  name: 'Upload',
  data() {
    return {
      isDragOver: false,
      uploads: []
    }
  },
  computed: {
    ...mapState(useUserStore, ['user'])
  },
  methods: {
    upload($event) {
      this.isDragOver = false

      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]
      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') return
        musicUpload(file, this.uploads, this.user)
      })
    },
    cancelUploads() {
      this.uploads.forEach((upload) => upload.uploadTask.cancel())
    }
  }
}
</script>

<style lang="scss" scoped></style>
