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
                  Cadastrar Usuário
                </h1>
              </div>
              <v-text-field
                v-model="nome"
                :rules="divAtiva === 'cadastrar' ? rules : []"
                label="Nome do Usuário"
              ></v-text-field>
              <v-text-field
                v-model="cpf"
                :rules="divAtiva === 'cadastrar' ? rules : []"
                label="CPF"
                @input="formatarCPF"
                maxlength="14"
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
                Editar Usuário
              </h1>
            </div>
            <v-text-field
              v-model="UsuarioEditado.nome"
              label="Nome do Usuário"
            ></v-text-field>
            <v-text-field
              v-model="cpf"
              :rules="divAtiva === 'cadastrar' ? rules : []"
              label="CPF"
              @input="formatarCPF"
              maxlength="14"
            ></v-text-field>
            <v-btn type="submit" block class="mt-2">Salvar</v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col>
        <div v-show="divAtiva === 'listar'" class="tableListar">
          <v-data-table :items="usuarios" :headers="headers">
            <template v-slot:item.action="{ item }">
              <v-btn @click="editarUsuario(item)" icon>
                ✏️
              </v-btn>
              <v-btn class="ml-2" @click="excluirUsuario(item.id)" icon>
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
      Usuario excluido com sucesso.
    </v-alert>
    <v-alert v-if="deleteError" type="error" class="mt-2">
      Erro ao excluir o Usuario.
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
    nome: '',
    cpf: '',
    showSuccess: false,
    deleteSucess: false,
    deleteError: false,
    divAtiva: 'listar',
    usuarios: [],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nome do Usuário', value: 'nome' },
      { text: 'CPF', value: 'cpf' },
      { text: 'Data da Inclusão', value: 'dt_inclusao' },
      { text: 'Data da Alteração', value: 'dt_alteracao' },
      { text: 'Ação', value: 'action', sortable: false },
    ],
    modoEdicao: false,
    UsuarioEditado: {
      id: null,
      nome: '',
      cpf: '',
      dt_inclusao: '',
      dt_alteracao: '',
    },
  }),
  methods: {
    mostrar(div) {
      if (div === 'cadastrar') {
        this.nome = ''
        this.cpf = ''
      }
      this.divAtiva = div
    },

    async fetchUsuarios() {
      const url = 'http://localhost:8000/api/usuarios'
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()

        // Formate as datas usando moment
        data.usuarios.forEach(usuario => {
          usuario.dt_inclusao = moment(usuario.dt_inclusao).format('DD/MM/YYYY')
          usuario.dt_alteracao = moment(usuario.dt_alteracao).format('DD/MM/YYYY')
        })

        this.usuarios = data.usuarios;
      } catch (error) {
        console.error('Error fetching usuarios data:', error.message)
      }
    },

    async submitForm() {
      const url = 'http://localhost:8000/api/usuarios';
      const data = {
        nome: this.nome,
        cpf: this.cpf
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
        this.fetchUsuarios()

        setTimeout(() => {
          this.showSuccess = false
        }, 3000);
        this.divAtiva = 'listar'
      } catch (error) {
        console.error('Houve um problema com a solicitação Fetch:', error.message)
      }
    },

    async editarUsuario(item) {
      this.UsuarioEditado = {
        id: item.id,
        nome: item.nome,
        cpf: item.cpf,
        dt_inclusao: item.dt_inclusao,
        dt_alteracao: item.dt_alteracao,
      }
      this.divAtiva = 'editar'
      this.modoEdicao = true
    },

    async salvarEdicao() {
      try {
        const response = await fetch(`http://localhost:8000/api/usuarios/${this.UsuarioEditado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: this.UsuarioEditado.nome,
            cpf: this.UsuarioEditado.cpf,
          }),
        })

        if (response.ok) {
          this.modoEdicao = false
          this.divAtiva = 'listar'
          this.fetchUsuarios()
        } else {
          console.error('Erro ao editar o usuário')
        }
      } catch (error) {
        console.error('Erro na requisição de edição:', error.message)
      }
    },

    async excluirUsuario(id) {
      try {
        const response = await fetch(`http://localhost:8000/api/usuarios/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          this.fetchUsuarios()
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

    formatarCPF() {
      // Remove caracteres não numéricos
      const numerosCPF = this.cpf.replace(/\D/g, '');

      // Limita o tamanho do CPF a 11 caracteres
      const cpfLimitado = numerosCPF.slice(0, 11);

      // Aplica a máscara
      const cpfFormatado = cpfLimitado.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
        '$1.$2.$3-$4'
      );

      // Atualiza a propriedade cpf diretamente
      this.cpf = cpfFormatado;
    },
  },
  created() {
    this.fetchUsuarios()
  },
}
</script>