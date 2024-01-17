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
                :rules="divAtiva === 'cadastrar' ? rules : []"
                label="Nome do Livro"
              ></v-text-field>
              <v-btn type="submit" block class="mt-2">Cadastrar</v-btn>
            </v-form>
          </v-sheet>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="modoEdicao" align="center" justify="center">
      <v-col>
        <v-sheet width="300" class="mx-auto">
          <v-form @submit.prevent="salvarEdicao">
            <div class="mb-2 text-center">
              <h1>
                Editar Livro
              </h1>
            </div>
            <v-text-field
              v-model="livroEditado.nome_livro"
              label="Nome do Livro"
            ></v-text-field>
            <v-btn type="submit" block class="mt-2">Salvar</v-btn>
          </v-form>
        </v-sheet>
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
    <v-alert v-if="showSuccess" type="success" class="mt-2">
      Cadastro realizado com sucesso!
    </v-alert>
    <v-alert v-if="deleteSucess" type="success" class="mt-2">
      Livro excluido com sucesso.
    </v-alert>
    <v-alert v-if="deleteError" type="error" class="mt-2">
      Erro ao excluir o Livro.
    </v-alert>
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
    showSuccess: false,
    deleteSucess: false,
    deleteError: false,
    divAtiva: 'listar',
    livros: [],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nome do Livro', value: 'nome_livro' },
      { text: 'Data da Inclusão', value: 'dt_inclusao' },
      { text: 'Data da Alteração', value: 'dt_alteracao' },
      { text: 'Ação', value: 'action', sortable: false },
    ],
    modoEdicao: false,
    livroEditado: {
      id: null,
      nome_livro: '',
      dt_inclusao: '',
      dt_alteracao: '',
    },
  }),
  methods: {
    mostrar(div) {
      if (div === 'cadastrar') {
        this.nome_livro = ''
      }
      this.divAtiva = div
    },

    async fetchLivros() {
      const url = 'http://localhost:8000/api/livros'
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()

        // Formate as datas usando moment
        data.livros.forEach(livro => {
          livro.dt_inclusao = moment(livro.dt_inclusao).format('DD/MM/YYYY')
          livro.dt_alteracao = moment(livro.dt_alteracao).format('DD/MM/YYYY')
        })

        this.livros = data.livros;
      } catch (error) {
        console.error('Error fetching livro data:', error.message)
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
          throw new Error('Network response was not ok')
        }

        this.showSuccess = true
        this.fetchLivros()

        setTimeout(() => {
          this.showSuccess = false
        }, 3000);
        this.divAtiva = 'listar'
      } catch (error) {
        console.error('Houve um problema com a solicitação Fetch:', error.message)
      }
    },

    async editarLivro(item) {
      this.livroEditado = {
        id: item.id,
        nome_livro: item.nome_livro,
        dt_inclusao: item.dt_inclusao,
        dt_alteracao: item.dt_alteracao,
      }
      this.divAtiva = 'editar'
      this.modoEdicao = true
    },

    async salvarEdicao() {
      try {
        const response = await fetch(`http://localhost:8000/api/livros/${this.livroEditado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome_livro: this.livroEditado.nome_livro,
          }),
        })

        if (response.ok) {
          this.modoEdicao = false
          this.divAtiva = 'listar'
          this.fetchLivros()
        } else {
          console.error('Erro ao editar o livro')
        }
      } catch (error) {
        console.error('Erro na requisição de edição:', error.message)
      }
    },

    async excluirLivro(id) {
      try {
        const response = await fetch(`http://localhost:8000/api/livros/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          this.fetchLivros()
          this.deleteSucess = true
        } else {
          this.deleteError = true
        }
        setTimeout(() => {
          this.deleteSucess = false
          this.deleteError = false
        }, 3000);
      } catch (error) {
        console.error('Erro na requisição de exclusão:', error.message)
      }
    },
  },
  created() {
    this.fetchLivros()
  },
}
</script>