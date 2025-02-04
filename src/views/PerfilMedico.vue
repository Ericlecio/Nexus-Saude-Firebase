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
        <div class="card shadow-sm mb-4" id="informacoespessois">
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
            <p><strong>CPF:</strong> {{ medico.cpf || "Não informado" }}</p>
            <p><strong>Valor da Consulta:</strong> {{ medico.valorConsulta || "Não informado" }}</p>
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

        <!-- Histórico de Consultas -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-calendar-alt me-2 text-primary"></i>
              <strong>Histórico de Consultas</strong>
            </h5>
            <div v-if="agenda.length">
              <table class="table table-striped table-hover">
                <thead class="table-primary">
                  <tr>
                    <th>Paciente</th>
                    <th>Telefone</th>
                    <th>Data e Hora</th>
                    <th>Local</th>
                    <th>Especialidade</th>
                    <th>Valor</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="consulta in agenda" :key="consulta.id">
                    <td>{{ consulta.pacienteNome || "Não informado" }}</td>
                    <td>{{ consulta.pacienteTelefone || "Não informado" }}</td>
                    <td>{{ consulta.data || "Sem data" }}</td>
                    <td>{{ consulta.local || "Não informado" }}</td>
                    <td>{{ consulta.especialidade || "Não informado" }}</td>
                    <td>{{ consulta.valorConsulta || "Não informado" }}</td>
                    <td>{{ consulta.situacao || "Sem status" }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="text-muted text-center">Nenhuma consulta encontrada.</p>
          </div>
        </div>

        <div class="botoes-acao">
          <button class="btn btn-warning" @click="abrirModal('senha')">
            Alterar Senha
          </button>

          <button class="btn btn-danger" @click="abrirModal('exclusao')">
            Excluir Conta
          </button>
        </div>

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

              <!-- <label>E-mail</label>
              <input v-model="formEdit.email" type="email" class="form-control" readonly /> -->

              <label>Telefone</label>
              <input v-model="formEdit.telefoneConsultorio" type="text" class="form-control" @input="formatarTelefone"
                required />

              <label>CRM</label>
              <input v-model="formEdit.crm" type="text" class="form-control" maxlength="6" @input="validarCRM"
                required />

              <label>CPF</label> <!-- CPF agora validado -->
              <input v-model="formEdit.cpf" type="text" class="form-control" required maxlength="14"
                @input="formatarCPF" />

              <label>Valor da Consulta (R$)</label>
              <input v-model="formEdit.valorConsulta" type="text" class="form-control" @input="formatarValorConsulta"
                required />

              <label>Especialidade</label>
              <select v-model="formEdit.especialidade" id="especialidade" class="form-select" required>
                <option value="" disabled selected>
                  Selecione a especialidade
                </option>
                <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                  {{ especialidade }}
                </option>
              </select>

              <label>UF</label>
              <select v-model="formEdit.uf" class="form-control" required>
                <option v-for="uf in ufOptions" :key="uf" :value="uf">{{ uf }}</option>
              </select>

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


      <!-- Modal de Confirmação de Exclusão -->
      <div v-if="showModalExclusao" class="modal-overlay d-flex justify-content-center align-items-center"
        style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);">
        <div class="modal-content p-4 bg-white rounded shadow" style="width: 300px;">
          <h4 class="text-center text-danger">Confirmar Exclusão</h4>
          <p class="text-center">Insira sua senha para confirmar a exclusão da conta.</p>

          <input v-model="senhaExclusao" type="password" class="form-control mb-3" placeholder="Digite sua senha"
            required />

          <div class="text-center">
            <button @click="excluirConta" class="btn btn-danger">Confirmar Exclusão</button>
            <button @click="fecharModal" class="btn btn-secondary ms-2">Cancelar</button>
          </div>
        </div>
      </div>


    </div>
  </div>
  <Footer />
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import BotaoVoltar from "@/components/BotaoVoltar.vue";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch
} from "firebase/firestore";

import {
  getAuth,
  onAuthStateChanged,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";


export default {
  name: "PerfilMedico",
  components: { Navbar, Footer, BotaoVoltar },
  data() {
    return {
      showModalSenha: false,
      novaSenha: "",
      confirmarSenha: "",
      showModalExclusao: false,
      senhaExclusao: "", // Armazena a senha para exclusão
      medico: null,
      medicoId: null,
      showModalEdit: false,
      campoSelecionado: "",
      formEdit: {},
      hoje: new Date().toISOString().split("T")[0],
      horariosDisponiveis: this.gerarHorarios("07:00", "20:00", 15),
      diasSemana: ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"],
      duracaoConsulta: 30,
      agenda: [],
      ufOptions: [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
      ],
      especialidades: [
        "Pediatria",
        "Cardiologia",
        "Dermatologia",
        "Ortopedia",
        "Neurologia",
        "Ginecologia",
        "Urologia",
        "Oftalmologia",
        "Endocrinologia",
        "Gastroenterologia",
        "Psiquiatria",
        "Otorrinolaringologia",
        "Reumatologia",
        "Nefrologia",
        "Oncologia",
        "Hematologia",
        "Pneumologia",
        "Infectologia",
        "Cirurgia Geral",
        "Anestesiologia",
        "Clínica Médica",
        "Medicina do Trabalho",
        "Medicina Esportiva",
        "Medicina Intensiva",
        "Radiologia",
        "Hepatologia",
        "Angiologia",
        "Nutrologia",
        "Geriatria",
        "Imunologia",
      ],
    };
  },
  methods: {
    async carregarAgenda() {
      if (!this.medicoId) return;

      try {
        const db = getFirestore();

        // Buscar histórico de consultas da tabela "historicoConsultas"
        const qHistorico = query(collection(db, "historicoConsultas"), where("medicoId", "==", this.medicoId));
        const snapshotHistorico = await getDocs(qHistorico);

        this.agenda = snapshotHistorico.empty ? [] : snapshotHistorico.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            pacienteNome: data.pacienteNome || "Não informado",
            pacienteTelefone: data.pacienteTelefone || "Não informado",
            data: data.data || "Sem data",
            local: data.local || "Não informado",
            especialidade: data.especialidade || "Não informado",
            valorConsulta: data.valorConsulta || "Não informado",
            situacao: data.situacao || "Sem status",
          };
        });

        console.log("📌 Histórico de consultas carregado:", this.agenda);
      } catch (error) {
        console.error("Erro ao carregar histórico de consultas:", error);
        alert("Erro ao carregar o histórico de consultas.");
      }
    },
    formatarCPF(event) {
      let cpf = event.target.value.replace(/\D/g, "");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      this.formEdit.cpf = cpf;
    },
    async verificarAutenticacao() {
      const auth = getAuth();
      const db = getFirestore();

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const medicoRef = doc(db, "medicos", user.uid);
          const medicoSnap = await getDoc(medicoRef);

          if (medicoSnap.exists()) {
            this.medicoId = user.uid;
            this.medico = medicoSnap.data();

            // Após carregar os dados do médico, carregar o histórico de consultas
            await this.carregarAgenda();
          } else {
            alert("Acesso negado! Apenas médicos podem acessar esta página.");
            this.$router.push("/login");
          }
        } else {
          alert("Você precisa estar logado para acessar esta página.");
          this.$router.push("/login");
        }
      });
    },
    abrirModal(campo) {
      if (!this.medico) return;

      // Criar uma cópia dos dados do médico para edição, garantindo que os valores apareçam no modal
      this.formEdit = { ...this.medico };

      this.campoSelecionado = campo;

      if (campo === "senha") {
        this.showModalSenha = true;
      } else if (campo === "exclusao") {
        this.showModalExclusao = true;
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
          this.novaSenha = "";
          this.confirmarSenha = "";
          this.fecharModal();
        } else {
          alert("Usuário não autenticado. Faça login novamente.");
        }
      } catch (error) {
        console.error("Erro ao alterar a senha:", error);

        if (error.code === "auth/requires-recent-login") {
          alert("Por segurança, você precisa fazer login novamente para alterar a senha.");
          await auth.signOut();
          window.location.reload();
        } else {
          alert("Erro ao alterar a senha. Tente novamente.");
        }
      }
    },
    validarCPF(cpf) {
      cpf = cpf.replace(/\D/g, '');
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
      const calc = (n) => [...cpf].slice(0, n).reduce((s, d, i) => s + d * (n + 1 - i), 0) * 10 % 11 % 10;
      return calc(9) === +cpf[9] && calc(10) === +cpf[10];
    },
    fecharModal() {
      this.showModalEdit = false;
      this.showModalSenha = false;
      this.showModalExclusao = false;
      this.campoSelecionado = "";
      this.novaSenha = "";
      this.confirmarSenha = "";
    },
    async salvarEdicao() {
      if (this.campoSelecionado === 'info' && !this.validarCPF(this.formEdit.cpf)) {
        return alert("CPF inválido. Verifique e tente novamente.");
      }

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
            dataNascimento: this.formEdit.dataNascimento,
            cpf: this.formEdit.cpf,
            valorConsulta: this.formEdit.valorConsulta

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
    formatarValorConsulta(event) {
      let valor = event.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
      valor = (parseInt(valor, 10) / 100).toFixed(2);    // Converte para formato de moeda
      this.formEdit.valorConsulta = `R$ ${valor.replace('.', ',')}`; // Formatação final
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
    async excluirConta() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const db = getFirestore();

        if (!user) {
          alert("Usuário não autenticado.");
          return;
        }

        if (!this.senhaExclusao) {
          alert("Por favor, insira sua senha.");
          return;
        }

        // Reautenticação do usuário
        const credential = EmailAuthProvider.credential(user.email, this.senhaExclusao);
        await reauthenticateWithCredential(user, credential);

        // Criar um batch para operações em lote
        const batch = writeBatch(db);

        // Buscar todos os agendamentos do médico
        const agendamentosQuery = query(collection(db, "agendamentos"), where("medicoId", "==", this.medicoId));
        const agendamentosSnapshot = await getDocs(agendamentosQuery);

        if (!agendamentosSnapshot.empty) {
          for (const agendamentoDoc of agendamentosSnapshot.docs) {
            const agendamento = agendamentoDoc.data();

            // Criar um novo documento no histórico de consultas
            const historicoRef = doc(collection(db, "historicoConsultas"));
            batch.set(historicoRef, {
              medicoId: agendamento.medicoId,
              medicoNome: agendamento.medicoNome,
              pacienteId: agendamento.pacienteId,
              pacienteNome: agendamento.pacienteNome,
              pacienteTelefone: agendamento.pacienteTelefone,
              data: agendamento.data,
              local: agendamento.local,
              especialidade: agendamento.especialidade,
              valorConsulta: agendamento.valorConsulta,
              situacao: "Médico removido do sistema",
            });

            // Excluir o agendamento original
            batch.delete(agendamentoDoc.ref);
          }
        }

        // Excluir o médico do Firestore
        const medicoRef = doc(db, "medicos", this.medicoId);
        batch.delete(medicoRef);

        // Commit das operações em lote
        await batch.commit();
        console.log("✅ Histórico atualizado e médico removido com sucesso.");

        // Excluir a conta do Firebase Authentication
        await deleteUser(user);

        alert("Conta excluída com sucesso!");
        window.location.href = "/"; // Redirecionamento após exclusão
      } catch (error) {
        console.error("Erro ao excluir conta:", error);

        if (error.code === "auth/wrong-password") {
          alert("Senha incorreta. Tente novamente.");
        } else if (error.code === "auth/too-many-requests") {
          alert("Muitas tentativas. Tente novamente mais tarde.");
        } else if (error.code === "auth/requires-recent-login") {
          alert("Você precisa fazer login novamente por segurança.");
        } else {
          alert(`Erro ao excluir conta: ${error.message}`);
        }
      } finally {
        this.senhaExclusao = ""; // Limpar o campo de senha após a tentativa
        this.fecharModal();
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

#informacoespessois .card-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* Duas colunas */
  gap: 15px;
  /* Espaçamento entre as colunas */
}

#informacoespessois p {
  margin-bottom: 10px;
  word-break: break-word;
  /* Evita quebra de layout com textos longos */
}

/* Responsividade para telas menores */
@media (max-width: 768px) {
  #informacoespessois .card-body {
    grid-template-columns: 1fr;
    /* Em telas menores, uma coluna */
  }
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

.botoes-acao {
  display: flex;
  justify-content: space-between;
  /* Um botão à esquerda e outro à direita */
  margin-top: 20px;
}
</style>