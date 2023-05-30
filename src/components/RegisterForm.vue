<template>
  <div
    class="text-white text-center font-bold p-4 mb-4 rounded"
    v-if="regShowAlert"
    :class="regAlertVariant"
    v-text="regAlertMessage"
  />
  <VeeForm :validation-schema="schema" @submit="register" :initial-values="userData">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Nome</label>
      <VeeField
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Insira seu nome"
      />
      <ErrorMessage name="name" class="text-red-600" />
    </div>

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

    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Idade</label>
      <VeeField
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage name="age" class="text-red-600" />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Senha</label>
      <VeeField
        name="password"
        type="password"
        placeholder="Insira sua senha"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage name="password" class="text-red-600" />
    </div>

    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirmar senha</label>
      <VeeField
        name="confirmPassword"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirmar senha"
      />
      <ErrorMessage name="confirmPassword" class="text-red-600" />
    </div>

    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">País</label>
      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="BRA">Brasil</option>
        <option value="ARG">Argentina</option>
        <option value="FRA">França</option>
      </VeeField>
      <ErrorMessage name="country" class="text-red-600" />
    </div>

    <!-- TOS -->
    <div class="block mb-3 pl-6">
      <VeeField
        name="tos"
        value="1"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <label class="inline-block">Aceitar termos de uso</label>
      <ErrorMessage name="tos" class="text-red-600 block" />
    </div>

    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="regInSubmission"
    >
      Cadastrar
    </button>
  </VeeForm>
</template>

<script>
import { ErrorMessage } from 'vee-validate'
import { mapActions } from 'pinia'
import useUserStore from '../stores/user'

export default {
  name: 'RegisterForm',
  components: { ErrorMessage },
  data() {
    return {
      userData: {
        country: 'BRA'
      },
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:8|max:100',
        confirmPassword: 'passwords_mismatch:@password',
        country: 'required',
        tos: 'tos'
      },
      regInSubmission: false,
      regShowAlert: false,
      regAlertVariant: 'bg-blue-500',
      regAlertMessage: 'Por favor, aguarde! Sua conta está sendo criada.'
    }
  },
  methods: {
    ...mapActions(useUserStore, {
      createUserAction: 'register'
    }),
    async register(values) {
      this.regShowAlert = true
      this.regInSubmission = true
      this.regAlertVariant = 'bg-blue-500'
      this.regAlertMessage = 'Por favor, aguarde! Sua conta está sendo criada.'

      try {
        await this.createUserAction(values)
      } catch (error) {
        this.regInSubmission = false
        this.regAlertVariant = 'bg-red-500'
        this.regAlertMessage = 'Erro ao criar sua conta. Tente novamente mais tarde.'
        return
      }

      this.regAlertVariant = 'bg-green-500'
      this.regAlertMessage = 'Sua conta foi criada.'
      window.location.reload()
    }
  }
}
</script>
