<template>
  <div>
    <Navbar />
    <br /><br />
    <div class="container py-5">
      <BotaoVoltar />

      <h1 class="text-center mb-4 text-primary">
        {{ medico ? medico.nomeCompleto : "Carregando..." }}
      </h1>

      <div v-if="medico">
        <!-- Informações Pessoais -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              <strong>Informações Pessoais</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal('info')"></i>
            </h5>
            <p><strong>Nome Completo:</strong> {{ medico.nomeCompleto }}</p>
            <p><strong>E-mail:</strong> {{ medico.email }}</p>
            <p><strong>Telefone:</strong> {{ medico.telefoneConsultorio }}</p>
            <p><strong>CRM:</strong> {{ medico.crm || "Não informado" }}</p>
            <p><strong>Especialidade:</strong> {{ medico.especialidade || "Não informado" }}</p>
            <p><strong>UF:</strong> {{ medico.uf }}</p>
            <p><strong>Sexo:</strong> {{ medico.sexo }}</p>
            <p>
              <strong>Data de Nascimento:</strong>
              {{ medico.dataNascimento || "Não informado" }}
            </p>
          </div>
        </div>

        <!-- Horários de Atendimento -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-clock me-2 text-primary"></i>
              <strong>Horários de Atendimento</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal('horarios')"></i>
            </h5>
            <ul class="list-unstyled">
              <li v-for="(horarios, dia) in medico.diasAtendimento" :key="dia">
                <strong> {{ formatDia(dia) }}:</strong>
                <span v-if="horarios.inicio && horarios.fim">
                  {{ horarios.inicio }} - {{ horarios.fim }}
                </span>
                <span v-else class="text-muted">Sem horário definido</span>
              </li>
            </ul>
          </div>
        </div>


        <button class="btn btn-warning mt-2" @click="abrirModal('senha')">
          Alterar Senha
        </button>


        <button class="btn btn-danger" @click="confirmarExclusao">Excluir Conta</button>
      </div>

      <div v-else class="text-center mt-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>


      <!-- Modal de Alteração de Senha -->
      <div v-if="showModalSenha" class="modal-overlay">
        <div class="modal-content">
          <h4 class="text-center text-primary">Alterar Senha</h4>
          <form @submit.prevent="alterarSenha">
            <label>Nova Senha</label>
            <input v-model="novaSenha" type="password" class="form-control" required minlength="6" />

            <label>Confirmar Nova Senha</label>
            <input v-model="confirmarSenha" type="password" class="form-control" required minlength="6" />

            <div class="mt-3 text-center">
              <button type="submit" class="btn btn-success">Salvar</button>
              <button type="button" class="btn btn-secondary ms-2" @click="fecharModal">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>


      <!-- Modal de Edição -->
      <div v-if="showModalEdit" class="modal-overlay">
        <div class="modal-content">
          <h4>{{ campoSelecionado === 'info' ? 'Editar Informações Pessoais' : 'Editar Horários de Atendimento' }}</h4>
          <form @submit.prevent="salvarEdicao">
            <template v-if="campoSelecionado === 'info'">
              <label>Nome Completo</label>
              <input v-model="formEdit.nomeCompleto" type="text" class="form-control" required @input="validarNome" />

              <label>E-mail</label>
              <input v-model="formEdit.email" type="email" class="form-control" readonly />

              <label>Telefone</label>
              <input v-model="formEdit.telefoneConsultorio" type="text" class="form-control" @input="formatarTelefone"
                required />

              <label>CRM</label>
              <input v-model="formEdit.crm" type="text" class="form-control" maxlength="6" @input="validarCRM"
                required />

              <label>Especialidade</label>
              <select v-model="formEdit.especialidade" class="form-control">
                <option>Cardiologia</option>
                <option>Dermatologia</option>
                <option>Ortopedia</option>
                <option>Pediatria</option>
                <option>Ginecologia</option>
              </select>

              <label>UF</label>
              <input v-model="formEdit.uf" type="text" class="form-control" maxlength="2" required />

              <label>Data de Nascimento</label>
              <input v-model="formEdit.dataNascimento" type="date" class="form-control" :max="hoje" required />
            </template>

            <template v-if="campoSelecionado === 'horarios'">
              <div class="container">
                <h4 class="text-center text-primary">Editar Horários de Atendimento</h4>
                <div class="row">
                  <!-- Agora usando diasSemana para garantir a ordem correta -->
                  <div class="col-md-4 mb-3" v-for="dia in diasSemana" :key="dia">
                    <div class="d-flex align-items-center">
                      <label class="me-2">{{ formatDia(dia) }}</label>

                      <!-- Campo para o horário de início -->
                      <select v-model="formEdit.diasAtendimento[dia].inicio" class="form-select me-2"
                        @change="validateHorario(dia)">
                        <option value="">Início</option>
                        <option v-for="hora in horariosDisponiveis" :key="hora" :value="hora">{{ hora }}</option>
                      </select>

                      <!-- Campo para o horário de fim -->
                      <select v-model="formEdit.diasAtendimento[dia].fim" class="form-select me-2"
                        @change="validateHorario(dia)">
                        <option value="">Fim</option>
                        <option v-for="hora in horariosDisponiveis" :key="hora" :value="hora">{{ hora }}</option>
                      </select>

                      <!-- Botão para remover o horário do dia -->
                      <button class="btn btn-danger btn-sm ms-2" @click="removerDia(dia)"
                        v-if="formEdit.diasAtendimento[dia].inicio">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>



            <div class="mt-3 text-center">
              <button type="submit" class="btn btn-success">Salvar</button>
              <button type="button" class="btn btn-secondary ms-2" @click="fecharModal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import BotaoVoltar from "@/components/BotaoVoltar.vue";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, updatePassword } from "firebase/auth";

export default {
  name: "PerfilMedico",
  components: { Navbar, Footer, BotaoVoltar },
  data() {
    return {
      showModalSenha: false,
      novaSenha: "",
      confirmarSenha: "",
      medico: null,
      medicoId: null,
      showModalEdit: false,
      campoSelecionado: "",
      formEdit: {},
      hoje: new Date().toISOString().split("T")[0],
      horariosDisponiveis: this.gerarHorarios("07:00", "20:00", 15),
      diasSemana: ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"],
      duracaoConsulta: 30, // Valor padrão, será atualizado com o valor do banco
    };
  },
  methods: {
    async verificarAutenticacao() {
      const auth = getAuth();
      const db = getFirestore();

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const medicoRef = doc(db, "medicos", user.uid);
          const medicoSnap = await getDoc(medicoRef);

          if (medicoSnap.exists()) {
            this.medicoId = user.uid;
            const medicoData = medicoSnap.data();

            // Garantir que diasAtendimento sempre esteja inicializado
            this.formEdit = {
              ...medicoData,
              diasAtendimento: medicoData.diasAtendimento || {},
            };

            this.medico = medicoData;

            if (this.medico.duracaoConsulta) {
              this.duracaoConsulta = this.medico.duracaoConsulta;
            }

            // Inicializar dias da semana, se não existirem
            this.diasSemana.forEach((dia) => {
              if (!this.formEdit.diasAtendimento[dia]) {
                this.formEdit.diasAtendimento[dia] = { inicio: "", fim: "" };
              } else if (Array.isArray(this.formEdit.diasAtendimento[dia])) {
                this.formEdit.diasAtendimento[dia] = {
                  inicio: this.formEdit.diasAtendimento[dia][0],
                  fim: this.formEdit.diasAtendimento[dia][
                    this.formEdit.diasAtendimento[dia].length - 1
                  ],
                };
              }
            });
          }
        }
      });
    },
    abrirModal(campo) {
      this.campoSelecionado = campo;
      if (campo === "senha") {
        this.showModalSenha = true;
      } else {
        this.showModalEdit = true;
      }
    },
    async alterarSenha() {
      if (this.novaSenha !== this.confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
      }

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          await updatePassword(user, this.novaSenha);
          alert("Senha atualizada com sucesso!");
          this.fecharModal();
        } else {
          alert("Usuário não autenticado.");
        }
      } catch (error) {
        console.error("Erro ao alterar a senha:", error);
        alert("Erro ao alterar a senha. Tente novamente.");
      }
    },
    fecharModal() {
      this.showModalEdit = false;
      this.showModalSenha = false;
      this.campoSelecionado = "";
      this.novaSenha = "";
      this.confirmarSenha = "";
    },
    async salvarEdicao() {
      try {
        const db = getFirestore();
        const medicoRef = doc(db, "medicos", this.medicoId);

        if (this.campoSelecionado === 'info') {
          await updateDoc(medicoRef, {
            nomeCompleto: this.formEdit.nomeCompleto,
            email: this.formEdit.email,
            telefoneConsultorio: this.formEdit.telefoneConsultorio,
            crm: this.formEdit.crm,
            especialidade: this.formEdit.especialidade,
            uf: this.formEdit.uf,
            dataNascimento: this.formEdit.dataNascimento
          });
          alert("Informações pessoais atualizadas com sucesso!");

        } else if (this.campoSelecionado === 'horarios') {
          const diasAtendimentoFiltrado = {};
          Object.keys(this.formEdit.diasAtendimento).forEach((dia) => {
            const horarios = this.formEdit.diasAtendimento[dia];
            if (horarios.inicio && horarios.fim) {
              diasAtendimentoFiltrado[dia] = this.gerarIntervalos(horarios.inicio, horarios.fim, this.duracaoConsulta);
            }
          });

          await updateDoc(medicoRef, {
            diasAtendimento: diasAtendimentoFiltrado
          });
          alert("Horários de atendimento atualizados com sucesso!");
        }

        this.medico = { ...this.formEdit };
        this.fecharModal();
      } catch (error) {
        console.error("Erro ao salvar edições:", error);
        alert("Erro ao salvar edições. Tente novamente.");
      }
    },
    removerDia(dia) {
      delete this.formEdit.diasAtendimento[dia];
    },
    gerarIntervalos(inicio, fim, duracao) {
      const intervalos = [];
      let [hora, minuto] = inicio.split(":").map(Number);
      const [fimHora, fimMinuto] = fim.split(":").map(Number);

      while (hora < fimHora || (hora === fimHora && minuto <= fimMinuto)) {
        intervalos.push(`${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`);
        minuto += duracao;
        if (minuto >= 60) {
          minuto -= 60;
          hora++;
        }
      }

      return intervalos;
    },
    validarNome(event) {
      this.formEdit.nomeCompleto = event.target.value.replace(/[^a-zA-Z\s]/g, "");
    },
    formatarTelefone(event) {
      let telefone = event.target.value.replace(/\D/g, "");
      telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      this.formEdit.telefoneConsultorio = telefone.slice(0, 15);
    },
    validarCRM(event) {
      this.formEdit.crm = event.target.value.replace(/\D/g, "").slice(0, 6);
    },
    formatDia(dia) {
      const dias = {
        segunda: "Segunda-feira",
        terca: "Terça-feira",
        quarta: "Quarta-feira",
        quinta: "Quinta-feira",
        sexta: "Sexta-feira",
        sabado: "Sábado"
      };
      return dias[dia] || dia;
    },
    gerarHorarios(inicio, fim, intervalo) {
      const horarios = [];
      let [hora, minuto] = inicio.split(":").map(Number);
      const [fimHora, fimMinuto] = fim.split(":").map(Number);

      while (hora < fimHora || (hora === fimHora && minuto <= fimMinuto)) {
        horarios.push(`${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`);
        minuto += intervalo;
        if (minuto >= 60) {
          minuto -= 60;
          hora++;
        }
      }
      return horarios;
    },
    validateHorario(dia) {
      const horarios = this.formEdit.diasAtendimento[dia];
      if (horarios.fim <= horarios.inicio && horarios.fim !== "") {
        alert("O horário final deve ser maior que o horário inicial.");
        horarios.fim = "";
      }
    },
  },
  mounted() {
    this.verificarAutenticacao();
  },
};
</script>



<style scoped>
.container {
  max-width: 90%;
}

.cursor-pointer {
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.form-select {
  border-radius: 8px;
  margin: 0 5px;
  min-width: 100px;
}

label {
  font-weight: bold;
  min-width: 80px;
}
</style>