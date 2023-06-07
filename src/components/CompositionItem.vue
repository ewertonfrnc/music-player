<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>

      <button
        @click.prevent="deleteSong"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        @click.prevent="showForm = !showForm"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>

    <div v-show="showForm">
      <div v-if="showAlert" :class="alertVariant" class="text-white text-center font-bold p-4 mb-4">
        {{ alertMessage }}
      </div>

      <VeeForm :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Título</label>
          <VeeField
            type="text"
            name="modifiedName"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Insira o título da música"
          />
          <ErrorMessage class="text-red-600" name="modifiedName" />
        </div>

        <div class="mb-3">
          <label class="inline-block mb-2">Gênero</label>
          <VeeField
            type="text"
            name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Insira o Gênero da música"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>

        <button
          type="submit"
          :disabled="inSubmission"
          class="py-1.5 px-3 rounded text-white bg-green-600 mr-3"
        >
          Salvar
        </button>
        <button
          type="button"
          :disabled="inSubmission"
          @click="showForm = false"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
        >
          Fechar
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script>
import {
  updateSongDocument,
  deleteSongFromStorage,
  deleteSongFromDatabase
} from '../includes/firebase'

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      showForm: false,
      showAlert: false,
      inSubmission: false,
      alertVariant: 'bg-blue-500',
      alertMessage: 'Por favor, aguarde! Atualizando a música.',
      schema: {
        modifiedName: 'required',
        genre: 'alpha_spaces'
      }
    }
  },
  methods: {
    async edit(values) {
      this.inSubmission = true
      this.showAlert = true
      this.alertVariant = 'bg-blue-500'
      this.alertMessage = 'Por favor, aguarde! Atualizando a música.'

      try {
        await updateSongDocument(this.song.docId, values)
      } catch (error) {
        this.inSubmission = false
        this.showAlert = false
        this.alertVariant = 'bg-red-500'
        this.alertMessage = 'Algo deu errado. Tente novamente mais tarde.'
        return
      }

      this.updateSong(this.index, values)

      this.inSubmission = false
      this.alertVariant = 'bg-green-500'
      this.alertMessage = 'Música atualizada.'
    },
    async deleteSong() {
      await deleteSongFromStorage(this.song)
      await deleteSongFromDatabase(this.song)
      this.removeSong(this.index)
    }
  }
}
</script>
