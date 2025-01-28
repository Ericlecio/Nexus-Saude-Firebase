<template>
    <Navbar />
    <br />
    <div class="div-principal">
        <div class="container my-5">
            <button class="btn btn-primary btn-back" @click="voltarPagina">
                <i class="fas fa-arrow-left me-2"></i> Voltar
            </button>

            <h2 class="text-center text-primary fw-bold mb-4">Minhas Consultas</h2>

            <div v-if="carregando" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-3 text-muted">Carregando suas consultas...</p>
            </div>

            <div v-else>
                <!-- Menu de Filtros -->
                <ul class="nav nav-pills justify-content-center mb-4">
                    <li class="nav-item" v-for="opcao in opcoesFiltro" :key="opcao.valor">
                        <a class="nav-link" :class="{ active: filtroSituacao === opcao.valor }"
                            @click="filtroSituacao = opcao.valor">
                            {{ opcao.label }}
                        </a>
                    </li>
                </ul>

                <div class="table-responsive">
                    <table class="table table-striped table-hover shadow-sm">
                        <thead class="table-primary">
                            <tr>
                                <th>Especialidade</th>
                                <th>Paciente</th>
                                <th>Telefone</th>
                                <th>Local</th>
                                <th>Data e Hora</th>
                                <th>Situação</th>
                                <th class="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="consulta in consultasFiltradas" :key="consulta.id"
                                :class="{ 'consulta-cancelada': consulta.situacao.toLowerCase().includes('cancelada') }">
                                <td>{{ consulta.especialidade || 'Não informado' }}</td>
                                <td>{{ consulta.pacienteNome || 'Não disponível' }}</td>
                                <td>{{ consulta.pacienteTelefone || 'Não informado' }}</td>
                                <td>{{ consulta.local || 'Não informado' }}</td>
                                <td>{{ consulta.data || 'Não informado' }}</td>
                                <td>{{ consulta.situacao || 'Não informado' }}</td>
                                <td class="text-center">
                                    <button v-if="consulta.situacao === 'Confirmada'" class="btn btn-sm btn-warning"
                                        @click="confirmarCancelamento(consulta.id)">
                                        <i class="fas fa-ban"></i>
                                    </button>
                                    <button v-if="consulta.situacao === 'Confirmada'" class="btn btn-sm btn-warning"
                                        @click="confirmarPresença(consulta.id)">
                                        <i class="fas fa-check-circle"></i>
                                    </button>
                                    <button v-if="consulta.situacao === 'Confirmada'" class="btn btn-sm btn-warning"
                                        @click="ausente(consulta.id)">
                                        <i class="fas fa-times-circle"></i>
                                    </button>
                                    <button v-if="consulta.situacao.toLowerCase().includes('cancelada')"
                                        class="btn btn-sm btn-danger" @click="confirmarExclusao(consulta.id)">
                                        <i class="fas fa-trash"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p v-if="!consultasFiltradas.length" class="text-center text-muted">Nenhuma consulta encontrada.</p>
            </div>
        </div>

        <!-- Modal de confirmação de cancelamento/exclusão -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <h4 class="text-center text-danger fw-bold">{{ modalMensagem.titulo }}</h4>
                <p class="text-center">{{ modalMensagem.texto }}</p>
                <div class="text-center mt-3">
                    <button class="btn btn-danger me-3" @click="confirmarAcaoModal">Confirmar</button>
                    <button class="btn btn-secondary" @click="showModal = false">Fechar</button>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script>
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
    deleteDoc,
} from "firebase/firestore";
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
            showModal: false,
            consultaSelecionada: null,
            acaoSelecionada: null,
            modalMensagem: { titulo: "", texto: "" },
            filtroSituacao: "todas",
            opcoesFiltro: [
                { label: "Todas", valor: "todas" },
                { label: "Confirmadas", valor: "Confirmada" },
                { label: "Canceladas pelo Paciente", valor: "Cancelada pelo paciente" },
                { label: "Canceladas pelo Médico", valor: "Cancelada pelo médico" },
                { label: "Finalizadas", valor: "Finalizada" },
            ],
        };
    },
    computed: {
        consultasFiltradas() {
            let filtradas = [...this.consultas];

            if (this.filtroSituacao !== "todas") {
                filtradas = filtradas.filter(
                    (consulta) => consulta.situacao === this.filtroSituacao
                );
            }

            filtradas.sort((a, b) => new Date(a.data) - new Date(b.data));
            return filtradas;
        },
    },
    methods: {
        async carregarConsultas() {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || user.tipo !== "medico" || !user.id) {
                    alert("Apenas médicos podem acessar esta página. Faça login.");
                    this.$router.push("/login");
                    return;
                }

                const db = getFirestore();
                const q = query(
                    collection(db, "agendamentos"),
                    where("medicoId", "==", user.id)
                );
                const snapshot = await getDocs(q);

                this.consultas = snapshot.empty
                    ? []
                    : snapshot.docs.map((docSnap) => ({
                        id: docSnap.id,
                        ...docSnap.data(),
                    }));
            } catch (error) {
                console.error("Erro ao carregar consultas:", error);
                alert("Erro ao carregar consultas.");
            } finally {
                this.carregando = false;
            }
        },

        confirmarCancelamento(id) {
            this.consultaSelecionada = id;
            this.acaoSelecionada = "cancelar";
            this.modalMensagem = {
                titulo: "Confirmar Cancelamento",
                texto: "Tem certeza de que deseja cancelar esta consulta?",
            };
            this.showModal = true;
        },

        async cancelarConsulta() {
            const db = getFirestore();
            const consultaRef = doc(db, "agendamentos", this.consultaSelecionada);

            try {
                const consultaSnap = await getDoc(consultaRef);

                if (consultaSnap.exists()) {
                    const consulta = consultaSnap.data();
                    consulta.situacao = "Cancelada pelo médico";

                    // Adicionar consulta à agenda do médico
                    const medicoRef = doc(db, "medicos", consulta.medicoId);
                    await updateDoc(medicoRef, {
                        agenda: arrayUnion(consulta),
                    });

                    // Adicionar consulta à lista de consultas do paciente
                    const pacienteRef = doc(db, "pacientes", consulta.pacienteId);
                    await updateDoc(pacienteRef, {
                        consultas: arrayUnion(consulta),
                    });

                    // Remover a consulta da tabela agendamentos
                    await deleteDoc(consultaRef);

                    // Atualizar a lista de consultas na interface
                    this.consultas = this.consultas.filter(
                        (c) => c.id !== this.consultaSelecionada
                    );

                    alert(
                        "Consulta cancelada, movida para a agenda do médico e registrada nas consultas do paciente."
                    );
                } else {
                    alert("Consulta não encontrada.");
                }
            } catch (error) {
                console.error("Erro ao cancelar a consulta:", error);
                alert("Erro ao cancelar a consulta. Tente novamente.");
            } finally {
                this.showModal = false;
            }
        },

        confirmarExclusao(id) {
            this.consultaSelecionada = id;
            this.acaoSelecionada = "excluir";
            this.modalMensagem = {
                titulo: "Confirmar Exclusão",
                texto: "Tem certeza de que deseja excluir esta consulta permanentemente?",
            };
            this.showModal = true;
        },

        async excluirConsulta() {
            const db = getFirestore();
            try {
                const consultaRef = doc(db, "agendamentos", this.consultaSelecionada);

                // Verificar e excluir
                const consultaSnap = await getDoc(consultaRef);
                if (consultaSnap.exists()) {
                    const consulta = consultaSnap.data();

                    // Adicionar consulta à agenda do médico
                    const medicoRef = doc(db, "medicos", consulta.medicoId);
                    await updateDoc(medicoRef, {
                        agenda: arrayUnion(consulta),
                    });

                    // Adicionar consulta à lista de consultas do paciente
                    const pacienteRef = doc(db, "pacientes", consulta.pacienteId);
                    await updateDoc(pacienteRef, {
                        consultas: arrayUnion(consulta),
                    });

                    // Remover consulta da tabela agendamentos
                    await deleteDoc(consultaRef);

                    this.consultas = this.consultas.filter(
                        (c) => c.id !== this.consultaSelecionada
                    );

                    alert(
                        "Consulta excluída e registrada na agenda do médico e na lista de consultas do paciente."
                    );
                } else {
                    alert("Consulta não encontrada para exclusão.");
                }
            } catch (error) {
                console.error("Erro ao excluir consulta:", error);
                alert("Erro ao excluir consulta. Tente novamente.");
            } finally {
                this.showModal = false;
            }
        },

        async confirmarAcaoModal() {
            if (this.acaoSelecionada === "cancelar") await this.cancelarConsulta();
            else if (this.acaoSelecionada === "excluir") await this.excluirConsulta();
        },
        confirmarCancelamento(id) {
            this.consultaSelecionada = id;
            this.acaoSelecionada = "cancelar";
            this.modalMensagem = {
                titulo: "Confirmar Cancelamento",
                texto: "Tem certeza de que deseja cancelar esta consulta?",
            };
            this.showModal = true;
        },

        confirmarPresenca(id) {
            this.consultaSelecionada = id;
            this.acaoSelecionada = "presente";
            this.modalMensagem = {
                titulo: "Confirmar Presença",
                texto: "Deseja confirmar que o paciente esteve presente na consulta?",
            };
            this.showModal = true;
        },

        confirmarAusente(id) {
            this.consultaSelecionada = id;
            this.acaoSelecionada = "ausente";
            this.modalMensagem = {
                titulo: "Confirmar Ausência",
                texto: "Deseja confirmar que o paciente esteve ausente na consulta?",
            };
            this.showModal = true;
        },

        async confirmarAcaoModal() {
            if (this.acaoSelecionada === "cancelar") {
                await this.cancelarConsulta();
            } else if (this.acaoSelecionada === "presente") {
                await this.marcarPresente(this.consultaSelecionada);
            } else if (this.acaoSelecionada === "ausente") {
                await this.marcarAusente(this.consultaSelecionada);
            }
            this.showModal = false;
        },

        async marcarPresente(id) {
            await this.atualizarSituacaoConsulta(id, "Presente");
        },

        async marcarAusente(id) {
            await this.atualizarSituacaoConsulta(id, "Ausente");
        },

        async atualizarSituacaoConsulta(id, situacao) {
            const db = getFirestore();
            const consultaRef = doc(db, "agendamentos", id);

            try {
                const consultaSnap = await getDoc(consultaRef);

                if (consultaSnap.exists()) {
                    const consulta = consultaSnap.data();
                    consulta.situacao = situacao;

                    // Adicionar consulta à agenda do médico
                    const medicoRef = doc(db, "medicos", consulta.medicoId);
                    await updateDoc(medicoRef, {
                        agenda: arrayUnion(consulta),
                    });

                    // Adicionar consulta à lista de consultas do paciente
                    const pacienteRef = doc(db, "pacientes", consulta.pacienteId);
                    await updateDoc(pacienteRef, {
                        consultas: arrayUnion(consulta),
                    });

                    // Remover a consulta da tabela agendamentos
                    await deleteDoc(consultaRef);

                    // Atualizar a lista de consultas na interface
                    this.consultas = this.consultas.filter((c) => c.id !== id);

                    alert(
                        `Consulta marcada como ${situacao}, movida para a agenda do médico e registrada nas consultas do paciente.`
                    );
                } else {
                    alert("Consulta não encontrada.");
                }
            } catch (error) {
                console.error(`Erro ao marcar consulta como ${situacao}:`, error);
                alert(`Erro ao marcar consulta como ${situacao}. Tente novamente.`);
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

.btn-back {
    border-radius: 10px;
    padding: 10px 20px;
}

.nav-pills .nav-link {
    color: #53ba83;
    cursor: pointer;
}

.nav-pills .nav-link.active {
    background-color: #53ba83;
    color: white;
}

.table {
    border: 1px solid #ddd;
    border-radius: 10px;
}

.consulta-cancelada td {
    text-decoration: line-through;
    background: rgba(0, 0, 30, 0.1);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    text-align: center;
}
</style>
