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
        cpf: "",
        sexo: "",
        dataNascimento: "",
        email: "",
        senha: "",
        tipo: "",
        telefone: "",
        planoSaude: "",

        crm: "",
        especialidade: "",
        telefoneConsultorio: "",
        valorConsulta: 0,

        nivelPermissao: "admin",
        ultimoLogin: "",
      },
      currentStep: 1,
    };
  },
  methods: {
    formatCPF(value) {
      const onlyNumbers = value.replace(/\D/g, "");
      return onlyNumbers
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .slice(0, 14);
    },

    goBack() {
      window.history.back();
    },

    handleCPFInput(event) {
      this.form.cpf = this.formatCPF(event.target.value);
    },

    validateAge() {
      const today = new Date();
      const birthDate = new Date(this.form.dataNascimento);
      const age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();

      if (age < 18 || (age === 18 && month < 0)) {
        alert("Você precisa ter pelo menos 18 anos para se cadastrar.");
        return false;
      }
      return true;
    },

    async submitForm() {
      if (!this.validateAge()) return;

      try {
        const usuarioData = {
          nomeCompleto: this.form.nomeCompleto,
          cpf: this.form.cpf,
          sexo: this.form.sexo,
          dataNascimento: this.form.dataNascimento,
          email: this.form.email,
          senha: this.form.senha,
          tipo: this.form.tipo,
        };

        const dao = new DAOService("usuarios");
        const docId = await dao.insert(usuarioData);

        if (this.form.tipo === "medico") {
          const medicoData = {
            crm: this.form.crm,
            especialidade: this.form.especialidade,
            telefoneConsultorio: this.form.telefoneConsultorio,
            valorConsulta: this.form.valorConsulta,
            usuarioId: docId,
            diasAtendimento: this.diasAtendimento,
          };
          const medicoDao = new DAOService("medicos");
          await medicoDao.insert(medicoData);
        } else if (this.form.tipo === "paciente") {
          const pacienteData = {
            telefone: this.form.telefone,
            planoSaude: this.form.planoSaude,
            usuarioId: docId,
          };
          const pacienteDao = new DAOService("pacientes");
          await pacienteDao.insert(pacienteData);
        } else if (this.form.tipo === "admin") {
          const adminData = {
            nivelPermissao: this.form.nivelPermissao,
            ultimoLogin: this.form.ultimoLogin,
            usuarioId: docId,
          };
          const adminDao = new DAOService("admins");
          await adminDao.insert(adminData);
        }

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
    <div class="container py-5 mt-5" >
      <div class="row justify-content-center align-items-center" >
        <!-- Coluna para a Imagem -->
        <div class="col-md-4 d-flex justify-content-center">

          <div class="logo-container text-center">
            <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde" class="img-fluid" />
          </div>
        </div>

        <!-- Coluna para o Formulário -->
        <div class="col-md-6">
          <div class="card shadow-lg border-0 rounded-3">
            <div class="row g-0">
              <div class="col-md-12 bg text-light p-4" style="background-color: #000524; border-radius: 2%;" >
                <h1 class="text-center mb-3">Nexus Saúde</h1>
                <h3 class="text-center mb-4">Cadastro de Usuário</h3>
                <form @submit.prevent="submitForm">
                  <div v-if="currentStep === 1">
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
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="nomeCompleto" class="form-label">Nome Completo</label>
                        <input v-model="form.nomeCompleto" type="text" id="nomeCompleto" class="form-control rounded-3"
                          placeholder="Digite seu nome completo" required />
                      </div>
                      <div class="col-md-6">
                        <label for="cpf" class="form-label">CPF</label>
                        <input v-model="form.cpf" @input="handleCPFInput" type="text" id="cpf"
                          class="form-control rounded-3" placeholder="Digite seu CPF" required />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="sexo" class="form-label">Sexo</label>
                        <select v-model="form.sexo" id="sexo" class="form-select rounded-3" required>
                          <option value="" disabled selected>Selecione o sexo</option>
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                          <option value="O">Outro</option>
                        </select>
                      </div>

                      <div class="col-md-6">
                        <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                        <input v-model="form.dataNascimento" type="date" id="dataNascimento"
                          class="form-control rounded-3" :max="maxDate" required />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="email" class="form-label">E-mail</label>
                        <input v-model="form.email" type="email" id="email" class="form-control rounded-3"
                          placeholder="seuemail@dominio.com" required />
                      </div>
                      <div class="col-md-6">
                        <label for="senha" class="form-label">Senha</label>
                        <input v-model="form.senha" type="password" id="senha" class="form-control rounded-3"
                          placeholder="Digite sua senha" required />
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="button" class="btn btn-primary rounded-3 btn-lg" @click="goBack">Voltar</button>
                      <button type="button" class="btn btn-primary rounded-3 btn-lg" @click="nextStep">Próximo</button>
                    </div>
                  </div>

                  <div v-if="currentStep === 2">
                    <div v-if="form.tipo === 'medico'">
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="crm" class="form-label">CRM</label>
                          <input v-model="form.crm" type="text" id="crm" class="form-control rounded-3"
                            placeholder="123456/PE" required />
                        </div>
                        <div class="col-md-6">
                          <label for="especialidade" class="form-label">Especialidade</label>
                          <select v-model="form.especialidade" id="especialidade" class="form-select rounded-3"
                            required>
                            <option value="" disabled selected>Selecione a especialidade</option>
                            <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                              {{ especialidade }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="telefoneConsultorio" class="form-label">Telefone Consultório</label>
                          <input v-model="form.telefoneConsultorio" type="text" id="telefoneConsultorio"
                            class="form-control rounded-3" placeholder="Digite o telefone do consultório" required />
                        </div>
                        <div class="col-md-6">
                          <label for="valorConsulta" class="form-label">Valor da Consulta</label>
                          <input v-model="form.valorConsulta" type="number" id="valorConsulta"
                            class="form-control rounded-3" placeholder="Digite o valor da consulta" required />
                        </div>
                      </div>

                      <!-- Horários de Atendimento -->
                      <div class="row mb-3">
                        <div class="col-md-14">
                          <h5>Horários de Atendimento</h5>
                          <div class="row">
                            <div class="col-md-4">
                              <label for="segundaInicio">Segunda</label>
                              <input v-model="diasAtendimento.segunda.inicio" type="time" id="segundaInicio"
                                class="form-control" />
                              <input v-model="diasAtendimento.segunda.fim" type="time" id="segundaFim"
                                class="form-control" />
                            </div>
                            <div class="col-md-4">
                              <label for="tercaInicio">Terça</label>
                              <input v-model="diasAtendimento.terca.inicio" type="time" id="tercaInicio"
                                class="form-control" />
                              <input v-model="diasAtendimento.terca.fim" type="time" id="tercaFim"
                                class="form-control" />
                            </div>
                            <div class="col-md-4">
                              <label for="quartaInicio">Quarta</label>
                              <input v-model="diasAtendimento.quarta.inicio" type="time" id="quartaInicio"
                                class="form-control" />
                              <input v-model="diasAtendimento.quarta.fim" type="time" id="quartaFim"
                                class="form-control" />
                            </div>
                            <div class="col-md-4">
                              <label for="quintaInicio">Quinta</label>
                              <input v-model="diasAtendimento.quinta.inicio" type="time" id="quintaInicio"
                                class="form-control" />
                              <input v-model="diasAtendimento.quinta.fim" type="time" id="quintaFim"
                                class="form-control" />
                            </div>
                            <div class="col-md-4">
                              <label for="sextaInicio">Sexta</label>
                              <input v-model="diasAtendimento.sexta.inicio" type="time" id="sextaInicio"
                                class="form-control" />
                              <input v-model="diasAtendimento.sexta.fim" type="time" id="sextaFim"
                                class="form-control" />
                            </div>
                            <div class="col-md-4">
                              <label for="sabadoInicio">Sábado</label>
                              <input v-model="diasAtendimento.sabado.inicio" type="time" id="sabadoInicio"
                                class="form-control" />
                              <input v-model="diasAtendimento.sabado.fim" type="time" id="sabadoFim"
                                class="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Formulário do Paciente -->
                    <div v-if="form.tipo === 'paciente'">
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="telefone" class="form-label">Telefone</label>
                          <input v-model="form.telefone" type="text" id="telefone" class="form-control rounded-3"
                            placeholder="Digite seu telefone" required />
                        </div>
                        <div class="col-md-6">
                          <label for="planoSaude" class="form-label">Plano de Saúde</label>
                          <input v-model="form.planoSaude" type="text" id="planoSaude" class="form-control rounded-3"
                            placeholder="Digite o plano de saúde" />
                        </div>
                      </div>
                    </div>
                    <div v-if="form.tipo === 'admin'">
                      <div class="row mb-3">
                        <div class="col-md-12">
                          <label for="nivelPermissao" class="form-label">Nível de Permissão</label>
                          <select v-model="form.nivelPermissao" id="nivelPermissao" class="form-select rounded-3"
                            required>
                            <option value="admin">Administrador</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-md-12">
                        <div class="text-center">
                          <button type="button" class="btn btn-primary rounded-5 btn-lg" @click="goBack">Voltar</button>
                          <button type="submit" class="btn btn-success rounded-3 btn-lg">Cadastrar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
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
.text-center button{
    margin-right:10px;
    margin-left: 10px;
    width: 30%;
}
</style>