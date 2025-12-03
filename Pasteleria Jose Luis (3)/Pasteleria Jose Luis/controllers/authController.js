class AuthController {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    validatePassword(password) {
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        
        if (!hasLowerCase) {
            return 'La contraseña debe contener al menos una minúscula';
        }
        if (!hasDigit) {
            return 'La contraseña debe contener al menos un dígito';
        }
        return null;
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const loginData = {
            usuario: formData.get('usuario').trim(),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };

        try {
            this.showLoading();

            if (!loginData.usuario) {
                this.handleError('El campo usuario es obligatorio');
                return;
            }

            if (!loginData.password) {
                this.handleError('El campo contraseña es obligatorio');
                return;
            }

            if (loginData.password.length < 8) {
                this.handleError('La contraseña debe tener al menos 8 caracteres');
                return;  
            }

            const passwordError = this.validatePassword(loginData.password);
            if (passwordError) {
                this.handleError(passwordError);
                return;  
            }
            
            const isValid = await this.validateCredentials(loginData);
            
            if (isValid) {
                this.handleSuccess(loginData);
            } else {
                this.handleError('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            this.handleError('Error al procesar el login');
        } finally {
            this.hideLoading();
        }
    }

    async validateCredentials(loginData) {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: loginData.usuario,
                    password: loginData.password
                })
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                sessionStorage.setItem('currentUser', data.usuario);
                sessionStorage.setItem('userRol', data.rol);
                sessionStorage.setItem('userNombre', data.nombre);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error al validar credenciales:', error);
            return false;
        }
    }

    handleSuccess(loginData) {
        if (loginData.remember) {
            localStorage.setItem('rememberedUser', loginData.usuario);
        }
        
        sessionStorage.setItem('currentUser', loginData.usuario);
        sessionStorage.setItem('isLoggedIn', 'true');
        
        this.showMessage('¡Bienvenido! Redirigiendo...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    handleError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            ${type === 'success' ? 'background: #4caf50;' : 'background: #f44336;'}
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    showLoading() {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'CARGANDO...';
            loginBtn.style.opacity = '0.7';
        }
    }

    hideLoading() {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = 'INGRESAR';
            loginBtn.style.opacity = '1';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuthController();
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
