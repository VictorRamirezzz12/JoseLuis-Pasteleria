class DashboardController {
    constructor() {
        this.init();
    }

    init() {
        this.loadUserInfo();
        this.bindEvents();
    }

    loadUserInfo() {
        const currentUser = sessionStorage.getItem('currentUser');
        const userNameElement = document.getElementById('userName');
        
        if (currentUser && userNameElement) {
            const userNameSpan = userNameElement.querySelector('span');
            if (userNameSpan) {
                userNameSpan.textContent = currentUser;
            } else {
                userNameElement.innerHTML = `
                    <svg class="user-icon-small" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>${currentUser}</span>
                `;
            }
        }
    }

    bindEvents() {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Cerrar Sesión';
        logoutBtn.className = 'logout-btn';
        logoutBtn.onclick = () => this.logout();
        
        const dashboardContainer = document.querySelector('.dashboard-container');
        if (dashboardContainer) {
            dashboardContainer.appendChild(logoutBtn);
        }
    }

    logout() {
        sessionStorage.clear();
        localStorage.removeItem('rememberedUser');
        window.location.href = 'index.html';
    }
}

function navigateTo(module) {
    switch(module) {
        case 'usuarios':
            window.location.href = 'usuarios.html';
            break;
        case 'ventas':
            window.location.href = 'ventas.html';
            break;
        case 'reportes':
            window.location.href = 'reportes.html';
            break;
        case 'stock':
            window.location.href = 'stock.html';
            break;
        default:
            console.log('Módulo no encontrado');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DashboardController();
});

const logoutStyle = document.createElement('style');
logoutStyle.textContent = `
    .logout-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background: #f44336;
        color: white;
        border: 2px solid #d32f2f;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
        z-index: 1000;
    }
    
    .logout-btn:hover {
        background: #d32f2f;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(244, 67, 54, 0.4);
    }
    
    .logout-btn:active {
        transform: translateY(0);
    }
`;
document.head.appendChild(logoutStyle);
