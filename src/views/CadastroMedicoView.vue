<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "CadastroMedico",
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
      },
    };
  },
};
</script>

<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <div class="row justify-content-center align-items-center">
        <!-- Card Principal -->
        <div class="col-lg-10">
          <div class="card shadow-lg border-0 rounded-3">
            <div class="row g-0">
              <!-- Formulário -->
              <div class="col-md-8 bg-dark text-light p-5">
                <h1 class="text-center mb-4">Nexus Saúde</h1>
                <h3 class="text-center mb-4">Cadastro Médico</h3>
                <form>
                  <!-- Nome Completo e CRM -->
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="nomeCompleto" class="form-label">Nome Completo</label>
                      <input
                        v-model="form.nomeCompleto"
                        type="text"
                        id="nomeCompleto"
                        class="form-control rounded-3"
                        placeholder="Digite seu nome completo"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label for="crm" class="form-label">CRM</label>
                      <input
                        v-model="form.crm"
                        type="text"
                        id="crm"
                        class="form-control rounded-3"
                        placeholder="123456/PE"
                        required
                      />
                    </div>
                  </div>
                  <!-- Especialidade e Telefone -->
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="especialidade" class="form-label">Especialidade</label>
                      <select
                        v-model="form.especialidade"
                        id="especialidade"
                        class="form-select rounded-3"
                        required
                      >
                        <option value="" disabled selected>Selecione</option>
                        <option
                          v-for="especialidade in especialidades"
                          :key="especialidade"
                          :value="especialidade"
                        >
                          {{ especialidade }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label for="telefone" class="form-label">Telefone</label>
                      <input
                        v-model="form.telefone"
                        type="tel"
                        id="telefone"
                        class="form-control rounded-3"
                        placeholder="(81) 99999-9999"
                        required
                      />
                    </div>
                  </div>
                  <!-- E-mail e Senha -->
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="email" class="form-label">E-mail</label>
                      <input
                        v-model="form.email"
                        type="email"
                        id="email"
                        class="form-control rounded-3"
                        placeholder="seuemail@dominio.com"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label for="senha" class="form-label">Senha</label>
                      <input
                        v-model="form.senha"
                        type="password"
                        id="senha"
                        class="form-control rounded-3"
                        placeholder="Digite sua senha"
                        required
                      />
                    </div>
                  </div>
                  <!-- Data e Horários de Atendimento -->
                  <div class="mb-3">
                    <label class="form-label">Data e Horários de Atendimento</label>
                    <div class="row">
                      <div
                        class="col-6 col-md-4 mb-3"
                        v-for="(dia, key) in diasAtendimento"
                        :key="key"
                      >
                        <label :for="key" class="form-label">{{ key }}</label>
                        <div class="input-group">
                          <input
                            v-model="dia.inicio"
                            type="time"
                            :id="`${key}-inicio`"
                            class="form-control"
                          />
                          <input
                            v-model="dia.fim"
                            type="time"
                            :id="`${key}-fim`"
                            class="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Botão Criar Conta -->
                  <div class="text-center">
                    <button type="submit" class="btn btn-primary rounded-3 btn-lg">
                      Criar Conta
                    </button>
                  </div>
                </form>
              </div>
              <!-- Logo -->
              <div class="col-md-4 bg-light d-flex justify-content-center align-items-center">
                <img
                  src="@/assets/img/NexusSaude_vertical.png"
                  alt="Nexus Saúde"
                  class="img-fluid logo"
                />
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
/* Reset de margens e paddings */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: Arial, sans-serif;
  height: 100%;
  background: #f8f9fa;
}

/* Card principal */
.card {
  background-color: #000524;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Formulário */
.card .form-label {
  font-weight: bold;
  color: #ffffff;
}

.card input,
.card select {
  background-color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  padding: 10px 15px;
  width: 100%;
}

.card input::placeholder {
  color: #888;
}

.card .btn {
  background-color: #007bff;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  padding: 12px;
}

.card .btn:hover {
  background-color: #53ba83;
}

.card .col-md-4 img {
  max-width: 80%;
  height: auto;
}

/* Responsividade */
@media (max-width: 768px) {
  .card {
    flex-direction: column;
  }
  .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .card h1 {
    font-size: 24px;
  }

  .card h3 {
    font-size: 18px;
  }

  input,
  select {
    font-size: 14px;
  }

  .btn {
    font-size: 16px;
  }
}
</style>
