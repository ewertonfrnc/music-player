import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate'
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minValue,
  max_value as maxValue,
  confirmed
} from '@vee-validate/rules'

export default {
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('min', min)
    defineRule('max', max)
    defineRule('email', email)
    defineRule('tos', required)
    defineRule('required', required)
    defineRule('min_value', minValue)
    defineRule('max_value', maxValue)
    defineRule('passwords_mismatch', confirmed)
    defineRule('alpha_spaces', alphaSpaces)

    configure({
      generateMessage: (context) => {
        const messages = {
            min: `O valor inserido é muito curto.`,
            max: `O valor inserido é muito longo.`,
            email: `O campo 'Email' precisa de um email válido.`,
            required: `Este campo é obrigatório.`,
            min_value: `O valor está abaixo do permitido.`,
            maxValue: `O valor está acima do permitido.`,
            açpha_spaces: `Este campo permite apenas caracteres alfabéticos.`,
            passwords_mismatch: 'As senhas não são iguais.',
            tos: 'Você precisa aceitar os termos de uso. '
          },
          message = messages[context.rule.name] || `O campo ${context.field} é inválido.`

        return message
      }
    })
  }
}
