const API_URL = 'http://localhost:3000/api';

let usuarios = [];
let selectedUsuario = null;

async function loadUsuarios() {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        if (response.ok) {
            usuarios = await response.json();
            displayUsuarios();
        } else {
            alert('Error al cargar usuarios');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

function displayUsuarios() {
    const tbody = document.getElementById('usuariosTableBody');
    tbody.innerHTML = '';

    usuarios.forEach((usuario) => {
        const row = document.createElement('tr');
        row.dataset.id = usuario.id;
        row.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.rol}</td>
        `;
        row.addEventListener('click', () => selectUsuario(usuario));
        tbody.appendChild(row);
    });
}

function selectUsuario(usuario) {
    selectedUsuario = usuario;
    document.getElementById('idUsuario').value = usuario.id;
    document.getElementById('nombre').value = usuario.nombre;
    document.getElementById('password').value = usuario.password;
    
    if (usuario.rol === 'administrador' || usuario.rol === 'Administrador' || usuario.rol === 'Admin') {
        document.getElementById('rolAdmin').checked = true;
    } else {
        document.getElementById('rolVendedor').checked = true;
    }
}

function validatePassword(password) {
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

function clearForm() {
    document.getElementById('idUsuario').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('password').value = '';
    document.querySelectorAll('input[name="rol"]').forEach(radio => radio.checked = false);
    selectedUsuario = null;
}

async function registrarUsuario() {
    const nombre = document.getElementById('nombre').value.trim();
    const password = document.getElementById('password').value.trim();
    const rol = document.querySelector('input[name="rol"]:checked')?.value;
    const usuario = nombre.toLowerCase().replace(/\s+/g, '');

    if (!nombre || !password || !rol) {
        alert('Por favor, complete todos los campos');
        return;
    }

    if (password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        alert(passwordError);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario,
                password: password,
                rol: rol === 'Administrador' ? 'administrador' : rol.toLowerCase(),
                nombre: nombre
            })
        });

        if (response.ok) {
            alert('Usuario registrado exitosamente');
            clearForm();
            loadUsuarios();
        } else {
            const error = await response.json();
            alert(error.error || 'Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

async function eliminarUsuario() {
    if (!selectedUsuario) {
        alert('Por favor, seleccione un usuario de la tabla haciendo clic en la fila');
        return;
    }

    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
        try {
            const response = await fetch(`${API_URL}/usuarios/${selectedUsuario.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Usuario eliminado exitosamente');
                clearForm();
                loadUsuarios();
            } else {
                const error = await response.json();
                alert(error.error || 'Error al eliminar usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    }
}

async function modificarUsuario() {
    if (!selectedUsuario) {
        alert('Por favor, seleccione un usuario de la tabla haciendo clic en la fila');
        return;
    }

    const nombre = document.getElementById('nombre').value.trim();
    const password = document.getElementById('password').value.trim();
    const rol = document.querySelector('input[name="rol"]:checked')?.value;
    const usuario = nombre.toLowerCase().replace(/\s+/g, '');

    if (!nombre || !password || !rol) {
        alert('Por favor, complete todos los campos');
        return;
    }

    if (password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        alert(passwordError);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/usuarios/${selectedUsuario.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario,
                password: password,
                rol: rol === 'Administrador' ? 'administrador' : rol.toLowerCase(),
                nombre: nombre
            })
        });

        if (response.ok) {
            alert('Usuario modificado exitosamente');
            clearForm();
            loadUsuarios();
        } else {
            const error = await response.json();
            alert(error.error || 'Error al modificar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadUsuarios();

    document.getElementById('registrarBtn').addEventListener('click', registrarUsuario);
    document.getElementById('eliminarBtn').addEventListener('click', eliminarUsuario);
    document.getElementById('modificarBtn').addEventListener('click', modificarUsuario);
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
});
