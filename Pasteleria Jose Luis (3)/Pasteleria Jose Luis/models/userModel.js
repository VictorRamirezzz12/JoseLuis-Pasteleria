class UserModel {
    constructor() {
        this.users = [
            { id: 1, usuario: 'admin', password: 'admin123', rol: 'administrador', nombre: 'Administrador' },
            { id: 2, usuario: 'pastelero', password: 'pastelero123', rol: 'pastelero', nombre: 'Pastelero Principal' },
            { id: 3, usuario: 'vendedor', password: 'vendedor123', rol: 'vendedor', nombre: 'Vendedor' }
        ];
    }

    validateUser(usuario, password) {
        return this.users.find(user => 
            user.usuario === usuario && user.password === password
        );
    }

    getUserByUsername(usuario) {
        return this.users.find(user => user.usuario === usuario);
    }

    getAllUsers() {
        return this.users;
    }

    createUser(userData) {
        const newUser = {
            id: this.users.length + 1,
            ...userData
        };
        this.users.push(newUser);
        return newUser;
    }

    updateUser(id, userData) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...userData };
            return this.users[userIndex];
        }
        return null;
    }

    deleteUser(id) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            return this.users.splice(userIndex, 1)[0];
        }
        return null;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserModel;
}