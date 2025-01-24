<template>
    <div class="div-principal">
        <Navbar />
        <div class="container my-5">
            <button class="btn-voltar" @click="voltarPagina">
                <i class="fas fa-arrow-left me-2"></i> Voltar
            </button>
            <h2 class="text-success text-center mb-10">Minhas Consultas</h2>

            <div v-if="carregando" class="text-center">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-2">Carregando suas consultas...</p>
            </div>

            <div v-else>
                <table class="table table-hover" v-if="consultas.length">
                    <thead>
                        <tr>
                            <th>Especialidade</th>
                            <th>Paciente</th>
                            <th>Telefone</th>
                            <th>Local</th>
                            <th>Data e Hora</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(consulta, index) in consultas" :key="consulta.id">
                            <td>{{ consulta.especialidade }}</td>
                            <td>{{ consulta.pacienteNome }}</td>
                            <td>{{ consulta.pacienteTelefone }}</td>
                            <td>{{ consulta.local }}</td>
                            <td>{{ consulta.data }}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" @click="cancelarConsulta(index)">Cancelar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p v-else class="text-center text-muted">Nenhuma consulta encontrada.</p>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
    name: "AgendaMedico",
    components: {
        Navbar,
        Footer,
    },
    data() {
        return {
            consultas: [],
            carregando: true,
            medicoLogado: null,
        };
    },
    methods: {
        async carregarConsultas() {
            try {
                const user = JSON.parse(localStorage.getItem("user"));

                if (!user || user.tipo !== "medico" || !user.id) {
                    console.warn("Nenhum médico logado encontrado. Redirecionando...");
                    alert("Apenas médicos podem acessar esta página. Faça login.");
                    this.$router.push("/login");
                    return;
                }

                this.medicoLogado = user;
                console.log("Médico logado encontrado:", this.medicoLogado);

                const db = getFirestore();
                const agendamentosRef = collection(db, "agendamentos");

                // Busca os agendamentos do médico logado usando o ID salvo no localStorage
                const q = query(agendamentosRef, where("medicoId", "==", this.medicoLogado.id));
                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    console.warn("Nenhuma consulta encontrada para este médico.");
                    this.consultas = [];
                } else {
                    this.consultas = snapshot.docs.map((docSnap) => ({
                        id: docSnap.id,
                        ...docSnap.data(),
                    }));
                }

                console.log("Consultas carregadas com sucesso:", this.consultas);
            } catch (error) {
                console.error("Erro ao carregar consultas:", error);
                alert("Erro ao carregar consultas. Tente novamente mais tarde.");
            } finally {
                this.carregando = false;
            }
        },

        async cancelarConsulta(index) {
            try {
                const consulta = this.consultas[index];
                const confirmar = confirm(`Deseja realmente cancelar a consulta de ${consulta.pacienteNome}?`);

                if (!confirmar) return;

                const db = getFirestore();
                await deleteDoc(doc(db, "agendamentos", consulta.id));

                this.consultas.splice(index, 1);
                alert("Consulta cancelada com sucesso.");
            } catch (error) {
                console.error("Erro ao cancelar consulta:", error);
                alert("Erro ao cancelar consulta. Tente novamente.");
            }
        },

        voltarPagina() {
            this.$router.push("/");
        },
    },
    async mounted() {
        await this.carregarConsultas();
    },
};
</script>

<style scoped>
.div-principal {
    margin-top: 5%;
}

.container {
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

h2 {
    font-size: 26px;
    font-weight: 600;
    color: #28a745;
    margin-bottom: 30px;
}

table {
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

th {
    background-color: #007bff;
    color: white;
    text-align: center;
}

td {
    text-align: center;
    vertical-align: middle;
    padding: 10px;
}

.btn {
    border-radius: 30px;
    font-size: 14px;
    padding: 8px 18px;
    transition: background-color 0.3s ease;
}

.btn-danger {
    background-color: #dc3545;
}

.btn-danger:hover {
    background-color: #c82333;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}

.text-muted {
    color: #6c757d;
    font-size: 16px;
}

.btn-voltar {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    margin-bottom: 20px;
}

.btn-voltar:hover {
    background-color: #0056b3;
}
</style>
