<template>
    <nav class="navbar navbar-expand-lg" :class="{ scrolled: isScrolled }">
        <div class="container">
            <a class="navbar-brand" href="#">
                <img src="/src/assets/img/NexusSaude_horizontal.png" alt="Nexus Saúde" style="height: 55px" />
            </a>
            <button class="navbar-toggler" :class="{ collapsed: isCollapsed }" type="button" @click="toggleCollapse"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" :class="{ show: !isCollapsed }" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Quem Somos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Fale Conosco</a>
                    </li>
                </ul>
                <div class="dropdown ms-3">
                    <a href="#" class="d-flex align-items-center" data-bs-toggle="dropdown">
                        <i class="bi bi-person-circle"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="/login">Login</a></li>
                        <li><a class="dropdown-item" href="#">Perfil</a></li>
                        <li><a class="dropdown-item" href="#">Consultas</a></li>
                        <li><a class="dropdown-item" href="#">Sair</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            isScrolled: false,
            isCollapsed: true,
        };
    },
    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 50;
        },
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
        },
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.handleScroll);
    },
};
</script>

<style scoped>
.navbar {
    background: transparent;
    color: white;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    transition: background-color 0.5s ease, box-shadow 0.5s ease;
    box-shadow: none;
}

.navbar.scrolled {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.9),
            rgba(240, 240, 240, 0.9));
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.navbar-brand {
    animation: slideIn 1s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.navbar-nav .nav-link {
    color: #53ba83;
    font-weight: bold;
    transition: color 0.4s ease, transform 0.4s ease;
}

.navbar-nav .nav-link:hover {
    color: #53ba83;
    text-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
    font-weight: bold;
}

.navbar-nav .nav-link.active {
    border-bottom: 3px solid #000524;
    padding-bottom: 2px;
}

.bi-person-circle {
    color: #53ba83;
    font-size: 1.5rem;
    transition: color 0.3s ease;
}

.dropdown-menu {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    backdrop-filter: blur(10px);
    border: none;
    padding: 10px;
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.navbar-toggler-icon {
    transition: 0.3s ease;
}

.navbar-toggler.collapsed .navbar-toggler-icon {
    transform: rotate(45deg);
}
</style>