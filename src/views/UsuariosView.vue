<template>
  <v-sheet width="300" class="mx-auto">
    <v-form @submit.prevent="submit">
      <v-text-field
        v-model="nome_livro"
        :rules="rules"
        label="Nome do Livro"
      ></v-text-field>
      <v-btn
        :loading="loading"
        type="submit"
        block
        class="mt-2"
        text="Submit"
      ></v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
  export default {
    data: vm => ({
      loading: false,
      rules: [value => vm.checkApi(value)],
      timeout: null,
      userName: '',
    }),

    methods: {
      async submit (event) {
        this.loading = true
        const results = await event
        this.loading = false

        alert(JSON.stringify(results, null, 2))
      },
      async checkApi (userName) {
        return new Promise(resolve => {
          clearTimeout(this.timeout)

          this.timeout = setTimeout(() => {
            if (!userName) return resolve('Please enter a user name.')
            if (userName === 'johnleider') return resolve('User name already taken. Please try another one.')

            return resolve(true)
          }, 1)
        })
      },
    },
  }
</script>