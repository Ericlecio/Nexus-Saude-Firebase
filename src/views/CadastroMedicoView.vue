<template>
  <div>
    <Navbar />
    <div class="container py-5 mt-5">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card shadow-lg border-0 rounded-4 p-5 bg-light">
            <div class="text-center d-flex align-items-center justify-content-center mb-3">
              <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde"
                class="img-fluid logo-small me-3" />
              <h1 class="text-primary fw-bold">Nexus Saúde</h1>
            </div>
            <h3 class="text-center text-muted mb-5">Cadastro de Médico</h3>
            <form @submit.prevent="submitForm">
              <div class="row g-4">
                <!-- Nome Completo -->
                <div class="col-md-3">
                  <label for="nomeCompleto" class="form-label">Nome Completo</label>
                  <input v-model="form.nomeCompleto" type="text" id="nomeCompleto" class="form-control"
                    placeholder="Digite seu nome completo" required @input="validarNome" />
                </div>

                <!-- CPF -->
                <div class="col-md-3">
                  <label for="cpf" class="form-label">CPF</label>
                  <input v-model="form.cpf" @input="handleCPFInput" type="text" id="cpf" class="form-control"
                    placeholder="Digite seu CPF" required />
                </div>

                <!-- Sexo -->
                <div class="col-md-3">
                  <label for="sexo" class="form-label">Sexo</label>
                  <select v-model="form.sexo" id="sexo" class="form-select" required>
                    <option value="" disabled selected>Selecione o sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                </div>

                <!-- Data de Nascimento -->
                <div class="col-md-3">
                  <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                  <input v-model="form.dataNascimento" type="date" id="dataNascimento" class="form-control" required />
                </div>
              </div>

              <div class="row g-4 mt-3">
                <!-- CRM -->
                <div class="col-md-3">
                  <label for="crm" class="form-label">CRM</label>
                  <input v-model="form.crm" type="text" id="crm" class="form-control" placeholder="Digite o CRM"
                    @input="formatCRM" required />

                  <small v-if="crmInvalido" class="text-danger">
                    CRM inválido. Verifique o formato ou a UF.
                  </small>
                </div>

                <!-- UF -->
                <div class="col-md-3">
                  <label for="uf" class="form-label">UF</label>
                  <select v-model="form.uf" id="uf" class="form-select" required>
                    <option value="" disabled selected>Selecione a UF</option>
                    <option v-for="estado in ufs" :key="estado" :value="estado">
                      {{ estado }}
                    </option>
                  </select>
                </div>

                <!-- E-mail -->
                <div class="col-md-3">
                  <label for="email" class="form-label">E-mail</label>
                  <input v-model="form.email" type="email" id="email" class="form-control"
                    placeholder="seuemail@dominio.com" required />
                </div>

                <!-- Telefone -->
                <div class="col-md-3">
                  <label for="telefoneConsultorio" class="form-label">Telefone</label>
                  <input v-model="form.telefoneConsultorio" @input="handlePhoneInput" type="text"
                    id="telefoneConsultorio" class="form-control" placeholder="(00) 00000-0000" required />
                </div>
              </div>

              <div class="row g-4 mt-3">
                <!-- Valor da Consulta -->
                <div class="col-md-3">
                  <label for="valorConsulta" class="form-label">Valor da Consulta</label>
                  <input v-model="form.valorConsulta" type="text" id="valorConsulta" class="form-control"
                    placeholder="R$ 0,00" required @input="formatarValorConsulta" />
                  <small v-if="valorInvalido" class="text-danger">O valor da consulta deve ser maior que R$ 0,00</small>
                </div>

                <!-- Especialidade -->
                <div class="col-md-3">
                  <label for="especialidade" class="form-label">Especialidade</label>
                  <select v-model="form.especialidade" id="especialidade" class="form-select" required>
                    <option value="" disabled selected>
                      Selecione a especialidade
                    </option>
                    <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                      {{ especialidade }}
                    </option>
                  </select>
                </div>

                <!-- Tempo Médio de Consulta -->
                <div class="col-md-3">
                  <label for="tempoConsulta" class="form-label">Tempo Médio de Consulta</label>
                  <select v-model="form.tempoConsulta" id="tempoConsulta" class="form-select" required>
                    <option value="" disabled selected>Selecione</option>
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">1 hora</option>
                  </select>
                </div>

                <!-- Senha -->
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

              <!-- Horários de Atendimento -->
              <div class="mt-4">
                <label class="form-label">Horários de Atendimento</label>
                <div class="row">
                  <div class="col-md-4 mb-3" v-for="(dia, index) in Object.entries(diasAtendimento)" :key="index">
                    <div class="d-flex align-items-center">
                      <label class="me-2">{{
                        dia[0].charAt(0).toUpperCase() + dia[0].slice(1)
                      }}</label>
                      <select v-model="dia[1].inicio" class="form-select me-2" @change="validateHorario(dia)">
                        <option v-for="hora in horarios" :key="hora" :value="hora">
                          {{ hora }}
                        </option>
                      </select>
                      <select v-model="dia[1].fim" class="form-select" @change="validateHorario(dia)">
                        <option v-for="hora in horarios" :key="hora" :value="hora">
                          {{ hora }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botão Cadastrar -->
              <div class="text-center mt-4">
                <button type="submit" class="btn btn-primary btn-lg w-50 shadow">
                  Cadastrar
                </button>
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";

export default {
  name: "CadastroMedico",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      ufs: [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO",
      ],
      horarios: this.gerarHorarios("07:00", "20:00", 15),
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
        "Imunologia",
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
        uf: "",
        especialidade: "",
        valorConsulta: "R$ 0,00",
        tempoConsulta: "",
      },
      valorInvalido: false,
      showPassword: false,
      crmInvalido: false,
    };
  },
  methods: {
    validarNome(event) {
      this.form.nomeCompleto = event.target.value.replace(
        /[^A-Za-zÀ-ÿ\s]/g,
        ""
      );
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    handleCPFInput(event) {
      this.form.cpf = event.target.value
        .replace(/\D/g, "")
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .slice(0, 14);
      if (this.form.cpf.length === 14) {
        if (!this.validarCPF(this.form.cpf)) {
          alert("CPF inválido. Por favor, verifique.");
          this.form.cpf = "";
        }
      }
    },
    validarCPF(cpf) {
      cpf = cpf.replace(/[^\d]+/g, "");
      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
      }
      let soma = 0;
      let resto;
      for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
      }
      soma = 0;
      for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
      }
      return true;
    },
    formatCRM(event) {
      this.form.crm = event.target.value.replace(/\D/g, ""); // Remove tudo que não for número

      if (this.form.crm.length > 6) {
        this.form.crm = this.form.crm.slice(0, 6); // Garante exatamente 6 dígitos
      }
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
    gerarHorarios(horaInicio, horaFim, intervaloMinutos) {
      const horarios = [];
      let [hora, minuto] = horaInicio.split(":").map(Number);
      const [fimHora, fimMinuto] = horaFim.split(":").map(Number);

      while (hora < fimHora || (hora === fimHora && minuto <= fimMinuto)) {
        const horaFormatada = `${String(hora).padStart(2, "0")}:${String(
          minuto
        ).padStart(2, "0")}`;
        horarios.push(horaFormatada);
        minuto += intervaloMinutos;
        if (minuto >= 60) {
          minuto -= 60;
          hora++;
        }
      }
      return horarios;
    },
    formatarValorConsulta(event) {
      let valor = event.target.value.replace(/\D/g, "");
      if (valor === "" || parseFloat(valor) === 0) {
        this.form.valorConsulta = "R$ 0,00";
        this.valorInvalido = true; // Exibe o erro caso o valor seja 0
        return;
      }

      this.valorInvalido = false;

      let valorFormatado = (parseFloat(valor) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      this.form.valorConsulta = valorFormatado;
    },
    async submitForm() {
      if (!/^\d{6}$/.test(this.form.crm)) {
        alert("O CRM deve conter exatamente 6 dígitos numéricos.");
        return;
      }

      if (!this.validarCPF(this.form.cpf)) {
        alert("CPF inválido. Por favor, corrija antes de prosseguir.");
        return;
      }

      const hoje = new Date();
      const nascimento = new Date(this.form.dataNascimento);
      const idade = hoje.getFullYear() - nascimento.getFullYear();
      if (idade < 18) {
        alert("Apenas médicos acima de 18 anos podem ser cadastrados.");
        return;
      }

      const camposObrigatorios = [
        "nomeCompleto", "cpf", "sexo", "dataNascimento", "email",
        "telefoneConsultorio", "crm", "uf", "especialidade",
        "valorConsulta", "tempoConsulta", "senha"
      ];
      for (const campo of camposObrigatorios) {
        if (!this.form[campo]) {
          alert(`O campo "${campo}" é obrigatório.`);
          return;
        }
      }

      const valorNumerico = parseFloat(this.form.valorConsulta.replace("R$", "").replace(/\./g, "").replace(",", "."));
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        alert("O valor da consulta deve ser maior que R$ 0,00.");
        return;
      }

      const algumHorarioPreenchido = Object.values(this.diasAtendimento).some(dia => dia.inicio && dia.fim);
      if (!algumHorarioPreenchido) {
        alert("Você deve informar pelo menos um dia e horário de atendimento.");
        return;
      }

      try {
        const auth = getAuth();
        const db = getFirestore();

        // 🔹 **VERIFICA SE O E-MAIL JÁ EXISTE NO FIREBASE AUTHENTICATION**
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("email", "==", this.form.email));
        const existingUser = await getDocs(userQuery);

        if (!existingUser.empty) {
          alert("Já existe um usuário cadastrado com este e-mail no sistema.");
          return;
        }

        // 🔹 **VERIFICA SE O E-MAIL JÁ EXISTE NA COLEÇÃO 'MEDICOS' OU 'PACIENTES'**
        const medicoQuery = query(collection(db, "medicos"), where("email", "==", this.form.email));
        const pacienteQuery = query(collection(db, "pacientes"), where("email", "==", this.form.email));

        const [medicoSnap, pacienteSnap] = await Promise.all([
          getDocs(medicoQuery),
          getDocs(pacienteQuery)
        ]);

        if (!medicoSnap.empty || !pacienteSnap.empty) {
          alert("Já existe um usuário cadastrado com este e-mail.");
          return;
        }

        // Criando a conta no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, this.form.email, this.form.senha);
        const userId = userCredential.user.uid;

        // Criando os horários de atendimento formatados
        const diasComHorarios = {};
        Object.entries(this.diasAtendimento).forEach(([dia, { inicio, fim }]) => {
          if (inicio && fim) {
            diasComHorarios[dia] = this.gerarHorarios(inicio, fim, parseInt(this.form.tempoConsulta));
          }
        });

        // Adicionando o médico ao Firestore
        const medicoRef = doc(db, "medicos", userId);
        await setDoc(medicoRef, {
          id: userId,
          nomeCompleto: this.form.nomeCompleto,
          cpf: this.form.cpf,
          sexo: this.form.sexo,
          dataNascimento: this.form.dataNascimento,
          email: this.form.email,
          telefoneConsultorio: this.form.telefoneConsultorio,
          crm: this.form.crm,
          uf: this.form.uf,
          especialidade: this.form.especialidade,
          valorConsulta: valorNumerico,
          tempoConsulta: this.form.tempoConsulta,
          diasAtendimento: diasComHorarios,
          dataCadastro: new Date().toISOString(),
        });

        alert("Médico cadastrado com sucesso!");
        this.$router.push({ path: "/login", query: { userType: "medico", email: this.form.email, senha: this.form.senha } });

      } catch (error) {
        console.error("Erro ao cadastrar médico: ", error);
        alert("Erro ao cadastrar médico. Tente novamente.");
      }
    },
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
