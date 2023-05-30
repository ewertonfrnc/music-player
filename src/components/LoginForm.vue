<template>
  <div
    class="text-white text-center font-bold p-4 mb-4"
    v-if="loginShowAlert"
    :class="loginAlertVariant"
    v-text="loginAlertMessage"
  />
  <VeeForm :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Insira seu email"
      />
      <ErrorMessage name="email" class="text-red-600" />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Senha</label>
      <VeeField
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Insira sua senha"
      />
      <ErrorMessage name="password" class="text-red-600" />
    </div>

    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="loginInSubmission"
    >
      Entrar
    </button>
  </VeeForm>
</template>

<script>
import { mapActions } from 'pinia'
import useUserStore from '../stores/user'

export default {
  name: 'LoginForm',
  data() {
    return {
      userData: {},
      loginSchema: {
        email: 'required|email',
        password: 'required|min:8|max:100'
      },
      loginInSubmission: false,
      loginShowAlert: false,
      loginAlertVariant: 'bg-blue-500',
      loginAlertMessage: 'Por favor, aguarde! Acessando sua conta.'
    }
  },
  methods: {
    ...mapActions(useUserStore, ['authenticate']),
    async login(values) {
      this.loginInSubmission = true
      this.loginShowAlert = true
      this.loginAlertVariant = 'bg-blue-500'
      this.loginAlertMessage = 'Por favor, aguarde! Acessando sua conta.'

      try {
        this.userData = await this.authenticate(values)
      } catch (error) {
        this.loginInSubmission = false
        this.loginAlertVariant = 'bg-red-500'
        this.loginAlertMessage = 'Email ou senha inválidos.'

        return
      }

      this.loginAlertVariant = 'bg-green-500'
      this.loginAlertMessage = `Olá, ${this.userData.name}! Bom te ver de volta!`
      window.location.reload()
    }
  }
}
</script>
