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
        sexo: "",  // Novo campo
        dataNascimento: "",  // Novo campo
        email: "",
        senha: "",
        tipo: "",  // Médico, paciente ou admin

        // Para pacientes
        telefone: "",
        planoSaude: "",  // Novo campo

        // Para médicos
        crm: "",
        especialidade: "",
        telefoneConsultorio: "",  // Novo campo
        valorConsulta: 0,  // Novo campo

        // Para administradores
        nivelPermissao: "admin",  // Novo campo
        ultimoLogin: "",  // Novo campo
      },
      currentStep: 1,
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
        const usuarioData = {
          nomeCompleto: this.form.nomeCompleto,
          cpf: this.form.cpf,
          sexo: this.form.sexo,
          dataNascimento: this.form.dataNascimento,
          email: this.form.email,
          senha: this.form.senha,
          tipo: this.form.tipo,
        };

        // Criação do documento do usuário
        const dao = new DAOService("usuarios");
        const docId = await dao.insert(usuarioData);

        // Dados específicos de cada tipo de usuário
        if (this.form.tipo === "medico") {
          const medicoData = {
            crm: this.form.crm,
            especialidade: this.form.especialidade,
            telefoneConsultorio: this.form.telefoneConsultorio,
            valorConsulta: this.form.valorConsulta,
            usuarioId: docId,
            diasAtendimento: this.diasAtendimento,  // Adicionando os horários de atendimento
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

        // Sucesso
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
    <div class="container py-5 mt-5"> 
      <div class="row justify-content-center align-items-center">
        <div class="col-lg-10">
          <div class="card shadow-lg border-0 rounded-3">
            <div class="row g-0">
              <div class="col-md-8 bg text-light p-4" style="background-color: #000524;">
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
                        <input v-model="form.nomeCompleto" type="text" id="nomeCompleto" class="form-control rounded-3" placeholder="Digite seu nome completo" required />
                      </div>
                      <div class="col-md-6">
                        <label for="cpf" class="form-label">CPF</label>
                        <input v-model="form.cpf" type="text" id="cpf" class="form-control rounded-3" placeholder="Digite seu CPF" required />
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
                        <input v-model="form.dataNascimento" type="date" id="dataNascimento" class="form-control rounded-3" required />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-md-12">
                        <label for="email" class="form-label">E-mail</label>
                        <input v-model="form.email" type="email" id="email" class="form-control rounded-3" placeholder="seuemail@dominio.com" required />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="senha" class="form-label">Senha</label>
                        <input v-model="form.senha" type="password" id="senha" class="form-control rounded-3" placeholder="Digite sua senha" required />
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="button" class="btn btn-primary rounded-3 btn-lg" @click="nextStep">Próximo</button>
                    </div>
                  </div>

                  <div v-if="currentStep === 2">
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
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="telefoneConsultorio" class="form-label">Telefone do Consultório</label>
                          <input v-model="form.telefoneConsultorio" type="text" id="telefoneConsultorio" class="form-control rounded-3" placeholder="(xx) xxxx-xxxx" required />
                        </div>
                        <div class="col-md-6">
                          <label for="valorConsulta" class="form-label">Valor da Consulta</label>
                          <input v-model="form.valorConsulta" type="number" id="valorConsulta" class="form-control rounded-3" placeholder="R$ 150,00" required />
                        </div>
                      </div>

                      <!-- Horários de Atendimento -->
                      <h4 class="mt-4">Horários de Atendimento</h4>
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="segundaInicio" class="form-label">Segunda-feira (Início)</label>
                          <input v-model="diasAtendimento.segunda.inicio" type="time" id="segundaInicio" class="form-control rounded-3" />
                        </div>
                        <div class="col-md-6">
                          <label for="segundaFim" class="form-label">Segunda-feira (Fim)</label>
                          <input v-model="diasAtendimento.segunda.fim" type="time" id="segundaFim" class="form-control rounded-3" />
                        </div>
                      </div>
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="tercaInicio" class="form-label">Terça-feira (Início)</label>
                          <input v-model="diasAtendimento.terca.inicio" type="time" id="tercaInicio" class="form-control rounded-3" />
                        </div>
                        <div class="col-md-6">
                          <label for="tercaFim" class="form-label">Terça-feira (Fim)</label>
                          <input v-model="diasAtendimento.terca.fim" type="time" id="tercaFim" class="form-control rounded-3" />
                        </div>
                      </div>
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="quartaInicio" class="form-label">Quarta-feira (Início)</label>
                          <input v-model="diasAtendimento.quarta.inicio" type="time" id="quartaInicio" class="form-control rounded-3" />
                        </div>
                        <div class="col-md-6">
                          <label for="quartaFim" class="form-label">Quarta-feira (Fim)</label>
                          <input v-model="diasAtendimento.quarta.fim" type="time" id="quartaFim" class="form-control rounded-3" />
                        </div>
                      </div>
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="quintaInicio" class="form-label">Quinta-feira (Início)</label>
                          <input v-model="diasAtendimento.quinta.inicio" type="time" id="quintaInicio" class="form-control rounded-3" />
                        </div>
                        <div class="col-md-6">
                          <label for="quintaFim" class="form-label">Quinta-feira (Fim)</label>
                          <input v-model="diasAtendimento.quinta.fim" type="time" id="quintaFim" class="form-control rounded-3" />
                        </div>
                      </div>
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="sextaInicio" class="form-label">Sexta-feira (Início)</label>
                          <input v-model="diasAtendimento.sexta.inicio" type="time" id="sextaInicio" class="form-control rounded-3" />
                        </div>
                        <div class="col-md-6">
                          <label for="sextaFim" class="form-label">Sexta-feira (Fim)</label>
                          <input v-model="diasAtendimento.sexta.fim" type="time" id="sextaFim" class="form-control rounded-3" />
                        </div>
                      </div>
                      <div class="row mb-3">
                        <div class="col-md-6">
                          <label for="sabadoInicio" class="form-label">Sábado (Início)</label>
                          <input v-model="diasAtendimento.sabado.inicio" type="time" id="sabadoInicio" class="form-control rounded-3" />
                        </div>
                        <div class="col-md-6">
                          <label for="sabadoFim" class="form-label">Sábado (Fim)</label>
                          <input v-model="diasAtendimento.sabado.fim" type="time" id="sabadoFim" class="form-control rounded-3" />
                        </div>
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-primary rounded-3 btn-lg">Cadastrar</button>
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
/* Adicione seus estilos personalizados aqui */
</style>
