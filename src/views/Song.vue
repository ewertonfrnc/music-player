<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>

      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="playerStore.newSong(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>

    <!-- Form -->
    <section class="container mx-auto mt-6">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comentários ({{ song.commentCount }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>

        <div class="p-6">
          <div
            v-if="commentShowAlert"
            :class="commentAlertVariant"
            class="text-white text-center font-bold p-4 mb-4"
          >
            {{ commentAlertMessage }}
          </div>

          <VeeForm :validation-schema="schema" @submit="addComment" v-if="user">
            <VeeField
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Insira seu comentário"
            />
            <ErrorMessage name="comment" class="text-red-600" />

            <button
              type="submit"
              :disabled="commentInSubmission"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
            >
              Enviar
            </button>
          </VeeForm>

          <!-- Sort Comments -->
          <select
            v-model="orderBy"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Mais recentes</option>
            <option value="2">Mais antigos</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        v-for="comment in sortedComments"
        :key="comment.uid"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ formatDate(new Date(comment.datePosted)) }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import {
  getSongDocument,
  createCommentDocument,
  getUserDocument,
  getAllComments,
  updateSongDocument
} from '../includes/firebase'
import { mapState, mapStores } from 'pinia'
import useUserStore from '../stores/user'
import usePlayerStore from '../stores/player'
import { nanoid } from 'nanoid'

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      comments: [],
      orderBy: '1',
      schema: {
        comment: 'required|min:3'
      },
      commentInSubmission: false,
      commentShowAlert: false,
      commentAlertVariant: 'bg-blue-500',
      commentAlertMessage: 'Por favor, aguarde! Seu comentário está sendo registrado.'
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    ...mapStores(usePlayerStore),
    sortedComments() {
      return this.comments
        .slice()
        .sort((a, b) =>
          this.orderBy === '1'
            ? new Date(b.datePosted) - new Date(a.datePosted)
            : new Date(a.datePosted) - new Date(b.datePosted)
        )
    }
  },
  methods: {
    async addComment(values, { resetForm }) {
      this.commentInSubmission = true
      this.commentShowAlert = true
      this.commentAlertVariant = 'bg-blue-500'
      this.commentAlertMessage = 'Por favor, aguarde! Seu comentário está sendo registrado.'

      // .toString() 'cause Firebase can't store a date in database
      const userData = await getUserDocument(this.user.uid)
      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        songId: this.$route.params.id,
        name: userData.name || userData.displayName,
        uid: nanoid()
      }

      try {
        await createCommentDocument(comment)
        this.commentAlertVariant = 'bg-green-500'
        this.commentAlertMessage = 'Sucesso! Seu comentário foi registrado.'
      } catch (error) {
        this.commentInSubmission = false
        this.commentShowAlert = false
        this.commentAlertVariant = 'bg-green-500'
        this.commentAlertMessage = 'Algo deu errado! Tente novamente mais tarde.'
      }

      this.song.commentCount += 1
      await updateSongDocument(this.$route.params.id, { commentCount: this.song.commentCount })
      this.getComments()

      resetForm()
      setTimeout(() => {
        this.commentInSubmission = false
        this.commentShowAlert = false
      }, 2000)
    },
    async getComments() {
      this.comments = await getAllComments(this.$route.params.id)
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(date)
    }
  },
  watch: {
    orderBy(newValue) {
      if (newValue === this.$route.query.orderBy) return

      this.$router.push({
        query: { orderBy: newValue }
      })
    }
  },
  async created() {
    const { orderBy } = this.$route.query

    this.orderBy = orderBy === '1' || orderBy === '2' ? orderBy : '1'

    this.song = await getSongDocument(this.$route.params.id, this.$router)
    this.getComments()
  }
}
</script>
