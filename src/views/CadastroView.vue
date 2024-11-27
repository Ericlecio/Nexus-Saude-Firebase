<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import DAOService from "@/services/DAOService";

export default {
  name: "CadastroUsuario",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      diasAtendimento: {
        segunda: { inicio: "", fim: "" },
        terca: { inicio: "", fim: "" },
        quarta: { inicio: "", fim: "" },
        quinta: { inicio: "", fim: "" },
        sexta: { inicio: "", fim: "" },
        sabado: { inicio: "", fim: "" },
      },
      especialidades: ["Pediatria", "Cardiologia", "Dermatologia"],
      form: {
        nomeCompleto: "",
        crm: "",
        especialidade: "",
        telefone: "",
        email: "",
        senha: "",
        tipo: "", // medico, paciente, admin
      },
      // Controlar qual etapa do formulário está sendo exibida
      currentStep: 1, // 1 = primeira parte, 2 = segunda parte
    };
  },
  methods: {
    getTimeSlots() {
      const slots = [];
      const startHour = 8;
      const endHour = 18;

      for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
          const hour = h < 10 ? `0${h}` : h;
          const minute = m < 10 ? `0${m}` : m;
          slots.push(`${hour}:${minute}`);
        }
      }
      return slots;
    },

    async submitForm() {
      try {
        // Organize os dados para envio ao Firestore
        const usuarioData = {
          nomeCompleto: this.form.nomeCompleto,
          email: this.form.email,
          senha: this.form.senha,
          tipo: this.form.tipo, // medico, paciente, admin
        };

        // Criação do documento do usuário
        const dao = new DAOService("usuarios");
        const docId = await dao.insert(usuarioData);

        // Dados específicos de cada tipo de usuário
        if (this.form.tipo === "medico") {
          const medicoData = {
            crm: this.form.crm,
            especialidade: this.form.especialidade,
            diasAtendimento: this.diasAtendimento,
          };
          const medicoDao = new DAOService("medicos");
          await medicoDao.insert(medicoData);
        } else if (this.form.tipo === "paciente") {
          // Dados do paciente (exemplo)
          const pacienteData = {
            telefone: this.form.telefone,
          };
          const pacienteDao = new DAOService("pacientes");
          await pacienteDao.insert(pacienteData);
        } else if (this.form.tipo === "admin") {
          // Dados do administrador (exemplo)
          const adminData = {
            permissao: "full", // Definir permissões de acordo com a necessidade
          };
          const adminDao = new DAOService("admins");
          await adminDao.insert(adminData);
        }

        // Redirecionamento
        alert("Usuário cadastrado com sucesso!");
        this.$router.push("/");
      } catch (error) {
        console.error("Erro ao cadastrar usuário: ", error);
        alert("Ocorreu um erro ao cadastrar o usuário. Tente novamente.");
      }
    },

    nextStep() {
      this.currentStep++;
    },
  },
};
</script>

<template>
  <div>
    <Navbar />
    <div class="container py-5 mt-5"> <!-- Adicionada margem superior com mt-5 -->
      <div class="row justify-content-center align-items-center">
        <!-- Card Principal -->
        <div class="col-lg-10">
          <div class="card shadow-lg border-0 rounded-3">
            <div class="row g-0">
              <!-- Formulário -->
              <div class="col-md-8 bg text-light p-4" style="background-color: #000524 ;">
                <h1 class="text-center mb-3">Nexus Saúde</h1>
                <h3 class="text-center mb-4">Cadastro de Usuário</h3>
                <form @submit.prevent="submitForm">
                  <!-- Primeira Parte do Formulário -->
                  <div v-if="currentStep === 1">
                    <!-- Tipo de Usuário -->
                    <div class="row mb-3">
                      <div class="col-md-12">
                        <label for="tipo" class="form-label">Tipo de Usuário</label>
                        <select v-model="form.tipo" id="tipo" class="form-select rounded-3" required>
                          <option value="" disabled selected>Selecione o tipo de usuário</option>
                          <option value="medico">Médico</option>
                          <option value="paciente">Paciente</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </div>
                    </div>

                    <!-- Nome Completo e E-mail -->
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="nomeCompleto" class="form-label">Nome Completo</label>
                        <input v-model="form.nomeCompleto" type="text" id="nomeCompleto" class="form-control rounded-3" placeholder="Digite seu nome completo" required />
                      </div>
                      <div class="col-md-6">
                        <label for="email" class="form-label">E-mail</label>
                        <input v-model="form.email" type="email" id="email" class="form-control rounded-3" placeholder="seuemail@dominio.com" required />
                      </div>
                    </div>

                    <!-- Senha -->
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="senha" class="form-label">Senha</label>
                        <input v-model="form.senha" type="password" id="senha" class="form-control rounded-3" placeholder="Digite sua senha" required />
                      </div>
                    </div>

                    <!-- Botão "Próximo" -->
                    <div class="text-center">
                      <button type="button" class="btn btn-primary rounded-3 btn-lg" @click="nextStep">
                        Próximo
                      </button>
                    </div>
                  </div>

                  <!-- Segunda Parte do Formulário (Aparece quando currentStep == 2) -->
                  <div v-if="currentStep === 2">
                    <!-- Campos Condicionais para Médico -->
                    <div v-if="form.tipo === 'medico'">
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="crm" class="form-label">CRM</label>
                          <input v-model="form.crm" type="text" id="crm" class="form-control rounded-3" placeholder="123456/PE" required />
                        </div>
                        <div class="col-md-6">
                          <label for="especialidade" class="form-label">Especialidade</label>
                          <select v-model="form.especialidade" id="especialidade" class="form-select rounded-3" required>
                            <option value="" disabled selected>Selecione</option>
                            <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">{{ especialidade }}</option>
                          </select>
                        </div>
                      </div>

                      <!-- Horários de Atendimento -->
                      <div class="mb-3">
                        <label class="form-label">Horários de Atendimento</label>
                        <div class="row">
                          <div class="col-6 col-md-4 mb-3" v-for="(dia, key) in diasAtendimento" :key="key">
                            <label :for="key" class="form-label">{{ key }}</label>
                            <div class="input-group">
                              <select v-model="dia.inicio" :id="`${key}-inicio`" class="form-select">
                                <option v-for="slot in getTimeSlots()" :key="slot" :value="slot">{{ slot }}</option>
                              </select>
                              <select v-model="dia.fim" :id="`${key}-fim`" class="form-select">
                                <option v-for="slot in getTimeSlots()" :key="slot" :value="slot">{{ slot }}</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Campos Condicionais para Paciente -->
                    <div v-if="form.tipo === 'paciente'">
                      <p>Dados do paciente (por exemplo, histórico de doenças, etc.)</p>
                    </div>

                    <!-- Campos Condicionais para Admin -->
                    <div v-if="form.tipo === 'admin'">
                      <p>Configurações do administrador (controle de permissões, etc.)</p>
                    </div>

                    <!-- Botão de Submit -->
                    <div class="text-center">
                      <button type="submit" class="btn btn-primary rounded-3 btn-lg">
                        Criar Conta
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <!-- Logo -->
              <div class="col-md-4 bg-light d-flex justify-content-center align-items-center">
                <img src="@/assets/img/NexusSaude_vertical.png" alt="Nexus Saúde" class="img-fluid logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.container {
  max-width: 90%; /* Diminuir a largura */
  margin-top: 50px; /* Margem superior */
}

.bg-dark {
  background-color: #000524;
}

.card {
  border-radius: 15px; /* Borda arredondada para o card */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); /* Adicionando sombra */
}

.btn-dark {
  background-color: #000524;
  border-color: #000524;
  color: white;
}

.btn-dark:hover {
  background-color: #53ba83;
  border-color: #53ba83;
  color: #fff;
}

.form-select,
.form-control {
  border-radius: 8px;
}

.input-group select {
  width: 50%;
}
</style>
