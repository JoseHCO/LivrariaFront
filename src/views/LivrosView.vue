<template>
  <div>
    <v-row class="mt-2" align="center" justify="center">
      <v-col cols="auto">
        <v-btn @click="mostrar('cadastrar')">Cadastrar</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="mostrar('listar')">Listar</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div v-show="divAtiva === 'cadastrar'" class="formCadastro">
          <v-sheet width="300" class="mx-auto">
            <v-form @submit.prevent="submitForm">
              <div class="mb-2 text-center">
                <h1>
                  Cadastrar Livro
                </h1>
              </div>
              <v-text-field
                v-model="nome_livro"
                :rules="rules"
                label="Nome do Livro"
              ></v-text-field>
              <v-btn type="submit" block class="mt-2">Cadastrar</v-btn>
              <v-alert v-if="showSuccess" type="success" class="mt-2">
                Cadastro realizado com sucesso!
              </v-alert>
            </v-form>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-show="divAtiva === 'listar'" class="tableListar">
          <v-data-table :items="livros" :headers="headers">
            <template v-slot:item.action="{ item }">
              <v-btn @click="editarLivro(item)" icon>
                ✏️
              </v-btn>
              <v-btn class="ml-2" @click="excluirLivro(item.id)" icon>
                🗑️
              </v-btn>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style>
.v-pagination .v-pagination__next,
.v-pagination .v-pagination__prev {
  color: black; 
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-pagination .v-pagination__next::after {
  content: '>';
  font-size: 2em;
}

.v-pagination .v-pagination__prev::before {
  content: '<'; 
  font-size: 2em;
}
</style>

<script>
import moment from 'moment'
export default {
  data: () => ({
    nome_livro: '',
    rules: [
      v => !!v || 'Nome do livro é necessário.',
    ],
    showSuccess: false,
    divAtiva: 'listar',
    livros: [],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nome do Livro', value: 'nome_livro' },
      { text: 'Data da Inclusão', value: 'dt_inclusao' },
      { text: 'Data da Alteração', value: 'dt_alteracao' },
      { text: 'Ação', value: 'action', sortable: false },
    ],
  }),
  methods: {
    mostrar(div) {
      this.divAtiva = div
    },

    async fetchLivros() {
      const url = 'http://localhost:8000/api/livros';
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Formate as datas usando moment
        data.livros.forEach(livro => {
          livro.dt_inclusao = moment(livro.dt_inclusao).format('DD/MM/YYYY');
          livro.dt_alteracao = moment(livro.dt_alteracao).format('DD/MM/YYYY');
        });

        this.livros = data.livros;
      } catch (error) {
        console.error('Error fetching livro data:', error.message);
      }
    },

    async submitForm() {
      const url = 'http://localhost:8000/api/livros';
      const data = {
        nome_livro: this.nome_livro,
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        this.showSuccess = true;

        // Log para verificar se o novo livro é retornado corretamente
        const newLivro = await response.json();
        console.log('Novo Livro:', newLivro);

        // Atualize a tabela após o sucesso do cadastro
        this.fetchLivros();

        setTimeout(() => {
          this.showSuccess = false;
        }, 3000);
      } catch (error) {
        console.error('Houve um problema com a solicitação Fetch:', error.message);
      }
    },

    editarLivro(item) {
    },

    excluirLivro(id) {
    },
  },
  created() {
    this.fetchLivros();
  },
}
</script>