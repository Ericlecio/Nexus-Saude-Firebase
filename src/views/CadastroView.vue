<template>
  <div>
    <Navbar />
    <div class="container py-5 mt-5">
      <div class="row justify-content-center" >
        <div class="col-md-10">
          <div class="card shadow-lg border-0 rounded-4 p-5 bg-light" >
            <div class="text-center d-flex align-items-center justify-content-center mb-3">
              <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde"
                class="img-fluid logo-small me-3" />
              <h1 class="text-primary fw-bold">Nexus Saúde</h1>
            </div>
            <h3 class="text-center text-muted mb-5">Cadastro de Médico</h3>
            <form @submit.prevent="submitForm">
              <div class="row g-4">
                <div class="col-md-3">
                  <label for="nomeCompleto" class="form-label">Nome Completo</label>
                  <input v-model="form.nomeCompleto" type="text" id="nomeCompleto" class="form-control"
                    placeholder="Digite seu nome completo" required />
                </div>
                <div class="col-md-3">
                  <label for="cpf" class="form-label">CPF</label>
                  <input v-model="form.cpf" @input="handleCPFInput" type="text" id="cpf" class="form-control"
                    placeholder="Digite seu CPF" required />
                </div>
                <div class="col-md-3">
                  <label for="sexo" class="form-label">Sexo</label>
                  <select v-model="form.sexo" id="sexo" class="form-select" required>
                    <option value="" disabled selected>Selecione o sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                  <input v-model="form.dataNascimento" type="date" id="dataNascimento" class="form-control" required />
                </div>

              </div>

              <div class="row g-4 mt-3">
                <div class="col-md-3">
                  <label for="crm" class="form-label">CRM</label>
                  <input v-model="form.crm" type="text" id="crm" class="form-control" placeholder="Digite o CRM"
                    @input="formatCRM" required />
                </div>
                <div class="col-md-3">
                  <label for="uf" class="form-label">UF</label>
                  <select v-model="form.uf" id="uf" class="form-select" required>
                    <option value="" disabled selected>Selecione a UF</option>
                    <option v-for="estado in ufs" :key="estado" :value="estado">
                      {{ estado }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="email" class="form-label">E-mail</label>
                  <input v-model="form.email" type="email" id="email" class="form-control"
                    placeholder="seuemail@dominio.com" required />
                </div>
                <div class="col-md-3">
                  <label for="telefoneConsultorio" class="form-label">Telefone</label>
                  <input v-model="form.telefoneConsultorio" @input="handlePhoneInput" type="text"
                    id="telefoneConsultorio" class="form-control" placeholder="(00) 00000-0000" required />
                </div>
                <div class="col-md-3">
                  <label for="valorConsulta" class="form-label">Valor da Consulta</label>
                  <input v-model="form.valorConsulta" type="number" id="valorConsulta" class="form-control"
                    placeholder="Digite o valor" required />
                </div>
                <div class="col-md-3">
                  <label for="especialidade" class="form-label">Especialidade</label>
                  <select v-model="form.especialidade" id="especialidade" class="form-select" required>
                    <option value="" disabled selected>Selecione a especialidade</option>
                    <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                      {{ especialidade }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="senha" class="form-label">Senha</label>
                  <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" v-model="form.senha" id="senha"
                      class="form-control" placeholder="Digite sua senha" required />
                    <button type="button" class="btn btn-outline-secondary" @click="togglePassword">
                      {{ showPassword ? "Ocultar" : "Mostrar" }}
                    </button>
                  </div>
                </div>

              </div>

              <div class="mt-4">
                <label class="form-label">Horários de Atendimento</label>
                <div class="row">
                  <div class="col-md-4 mb-3" v-for="(dia, index) in Object.entries(diasAtendimento)" :key="index">
                    <div class="d-flex align-items-center">
                      <label class="me-2">{{ dia[0].charAt(0).toUpperCase() + dia[0].slice(1) }}</label>
                      <select v-model="dia[1].inicio" class="form-select me-2" @change="validateHorario(dia)">
                        <option v-for="hora in horarios" :key="hora" :value="hora">{{ hora }}</option>
                      </select>
                      <select v-model="dia[1].fim" class="form-select" @change="validateHorario(dia)">
                        <option v-for="hora in horarios" :key="hora" :value="hora">{{ hora }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-center mt-4">
                <button type="submit" class="btn btn-primary btn-lg w-50 shadow">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import DAOService from "@/services/DAOService";

export default {
  name: "CadastroMedico",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      ufs: [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR",
        "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
      ],
      horarios: this.gerarHorarios("07:00", "20:00", 30),
      diasAtendimento: {
        segunda: { inicio: "", fim: "" },
        terca: { inicio: "", fim: "" },
        quarta: { inicio: "", fim: "" },
        quinta: { inicio: "", fim: "" },
        sexta: { inicio: "", fim: "" },
        sabado: { inicio: "", fim: "" },
      },
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
        "Imunologia"
      ],
      form: {
        nomeCompleto: "",
        cpf: "",
        sexo: "",
        dataNascimento: "",
        email: "",
        senha: "",
        telefoneConsultorio: "",
        crm: "",
        especialidade: "",
        valorConsulta: 0,
      },
      showPassword: false,
      crmInvalido: false,
      ufs: ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"],
    };
  },
  methods: {
    formatCRM(event) {
      let input = event.target.value.toUpperCase().replace(/[^0-9A-Z/]/g, "");
      let parts = input.split("/");

      if (parts[0].length > 6) {
        parts[0] = parts[0].substring(0, 6);
      }

      if (parts.length > 1) {
        parts[1] = parts[1].substring(0, 2);
        if (!this.ufs.includes(parts[1])) {
          this.crmInvalido = true;
        } else {
          this.crmInvalido = false;
        }
      }

      this.form.crm = parts.join("/").toUpperCase();
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    gerarHorarios(horaInicio, horaFim, intervaloMinutos) {
      const horarios = [];
      let [hora, minuto] = horaInicio.split(":").map(Number);
      const [fimHora, fimMinuto] = horaFim.split(":").map(Number);

      while (hora < fimHora || (hora === fimHora && minuto <= fimMinuto)) {
        const horaFormatada = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
        horarios.push(horaFormatada);
        minuto += intervaloMinutos;
        if (minuto >= 60) {
          minuto -= 60;
          hora++;
        }
      }
      return horarios;
    },

    handleCPFInput(event) {
      this.form.cpf = event.target.value.replace(/\D/g, "")
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .slice(0, 14);
    },

    handlePhoneInput(event) {
      let phone = event.target.value.replace(/\D/g, "");
      phone = phone.replace(/^(\d{2})(\d)/g, "($1) $2");
      phone = phone.replace(/(\d{5})(\d)/, "$1-$2");
      this.form.telefoneConsultorio = phone.slice(0, 15);
    },

    validateHorario(dia) {
      if (dia[1].fim <= dia[1].inicio) {
        alert("O horário final deve ser maior que o horário inicial.");
        dia[1].fim = "";
      }
    },

    async submitForm() {
      if (this.crmInvalido) {
        alert("Corrija o CRM antes de prosseguir.");
        return;
      }

      try {
        const medicoDao = new DAOService("medicos");
        await medicoDao.insert({ ...this.form, diasAtendimento: this.diasAtendimento });
        alert("Médico cadastrado com sucesso!");
        this.$router.push("/");
      } catch (error) {
        console.error("Erro ao cadastrar médico: ", error);
        alert("Erro ao cadastrar médico. Tente novamente.");
      }
    }
  },
};
</script>



<style scoped>
.logo-small {
  max-width: 80px;
  animation: fadeIn 2s ease-in-out;
}

.text-center button {
  width: 50%;
}

.form-control,
.form-select {
  border-radius: 10px;
  border: 1px solid #ced4da;
}

.input-group button {
  border-radius: 10px;
}

.card {
  background-color: #f8f9fa;
}

button {
  transition: all 0.3s ease-in-out;
}

button:hover {
  transform: scale(1.05);
}
</style>