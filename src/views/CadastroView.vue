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
        tipo: "",
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
            experiencia: this.form.experiencia, 
            precoConsulta: this.form.precoConsulta, 
            diasAtendimento: this.diasAtendimento, 
            usuarioId: docId,
          };
          const medicoDao = new DAOService("medicos");
          await medicoDao.insert(medicoData);
        } else if (this.form.tipo === "paciente") {
          const pacienteData = {
            telefone: this.form.telefone,
            usuarioId: docId, 
          };
          const pacienteDao = new DAOService("pacientes");
          await pacienteDao.insert(pacienteData);
        } else if (this.form.tipo === "admin") {
          const adminData = {
            permissao: "full", 
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

                      <div class="row mb-3">
                        <div class="col-md-12">
                          <label for="experiencia" class="form-label">Experiência</label>
                          <textarea v-model="form.experiencia" id="experiencia" class="form-control" rows="3" placeholder="Digite a experiência do médico"></textarea>
                        </div>
                      </div>

                      <div class="row mb-3">
                        <div class="col-md-12">
                          <label for="precoConsulta" class="form-label">Preço da Consulta</label>
                          <input v-model="form.precoConsulta" type="number" id="precoConsulta" class="form-control" placeholder="Digite o preço da consulta" required />
                        </div>
                      </div>
                    </div>

                    <div v-if="form.tipo === 'paciente'">
                      <div class="row mb-3">
                        <div class="col-md-12">
                          <label for="telefone" class="form-label">Telefone</label>
                          <input v-model="form.telefone" type="text" id="telefone" class="form-control rounded-3" placeholder="Digite seu telefone" required />
                        </div>
                      </div>
                    </div>

                    <div v-if="form.tipo === 'admin'">
                      <div class="row mb-3">
                        <div class="col-md-12">
                          <label for="permissao" class="form-label">Permissões</label>
                          <select v-model="form.permissao" id="permissao" class="form-select rounded-3" required>
                            <option value="full">Administrador completo</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="text-center">
                      <button type="submit" class="btn btn-success rounded-3 btn-lg">Cadastrar</button>
                    </div>
                  </div>
                </form>
              </div>
              <div class="col-md-4 d-none d-md-block">
                <img src="@/assets/img/NexusSaude_vertical.png" alt="Imagem do cadastro" class="img-fluid rounded-end" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
