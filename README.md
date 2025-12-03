# 🍰 Sistema de Gestión - Pastelería José Luis

Sistema web completo para la gestión de operaciones de una pastelería, incluyendo control de usuarios, inventario, ventas y reportes.

## 📋 Descripción del Proyecto

Este proyecto es un sistema de gestión integral desarrollado para la **Pastelería José Luis**, que permite administrar todas las operaciones del negocio de manera eficiente y centralizada.

### Características Principales

- **🔐 Sistema de Autenticación**: Login seguro con validación de credenciales
- **👥 Gestión de Usuarios**: CRUD completo para administración de usuarios con roles
- **📦 Gestión de Stock**: Control de inventario de productos con categorías
- **💰 Registro de Ventas**: Sistema completo para registrar y gestionar ventas
- **📊 Reportes**: Generación de reportes de ventas por rango de fechas
- **📈 Dashboard**: Panel principal con acceso a todos los módulos

### Tecnologías Utilizadas

- **Backend**: Node.js con Express.js
- **Base de Datos**: PostgreSQL
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Arquitectura**: Patrón DAO (Data Access Object)

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/pasteleria-jose-luis.git
   cd pasteleria-jose-luis
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   - Crear una base de datos PostgreSQL llamada `JoseLuis`
   - Configurar las credenciales en `database/connection.js`:
     ```javascript
     host: 'localhost',
     user: 'postgres',
     password: 'tu_contraseña',
     database: 'JoseLuis',
     port: 5432
     ```

4. **Crear las tablas en la base de datos**
   - Ejecutar los scripts SQL necesarios para crear las tablas:
     - `usuarios`
     - `categorias`
     - `stock`
     - `ventas`

5. **Iniciar el servidor**
   ```bash
   npm start
   ```

6. **Acceder a la aplicación**
   - Abrir el navegador en: `http://localhost:3000`

## 🔐 Sistema de Login

### Funcionalidad

El sistema cuenta con un módulo de autenticación completo que permite:

- **Validación de credenciales**: Verificación de usuario y contraseña contra la base de datos
- **Gestión de sesiones**: Uso de `sessionStorage` para mantener la sesión activa
- **Recordar usuario**: Opción para recordar el usuario en el navegador
- **Validación de contraseña**: 
  - Mínimo 8 caracteres
  - Debe contener al menos una letra minúscula
  - Debe contener al menos un dígito
- **Control de roles**: Diferentes niveles de acceso según el rol del usuario

### Endpoint de Login

**POST** `/api/login`

**Body:**
```json
{
  "usuario": "nombre_usuario",
  "password": "contraseña"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "usuario": "nombre_usuario",
  "rol": "admin",
  "nombre": "Nombre Completo"
}
```

**Respuesta de error:**
```json
{
  "error": "Usuario o contraseña incorrectos"
}
```

### Archivos Relacionados

- `Pasteleria Jose Luis (3)/Pasteleria Jose Luis/index.html` - Página de login
- `Pasteleria Jose Luis (3)/Pasteleria Jose Luis/controllers/authController.js` - Controlador de autenticación
- `server.js` - Ruta `/api/login` (líneas 81-104)

## 🛠️ Mantenimiento

### Estructura del Proyecto

```
Pasteleria Jose Luis (3)/
├── DAO/                    # Data Access Objects
│   ├── categoriaDao.js
│   ├── stockDao.js
│   ├── userDao.js
│   └── ventaDao.js
├── database/
│   └── connection.js       # Configuración de PostgreSQL
├── Pasteleria Jose Luis (3)/
│   └── Pasteleria Jose Luis/
│       ├── assets/
│       │   └── css/        # Estilos CSS
│       ├── controllers/    # Controladores del frontend
│       ├── img/            # Imágenes y logos
│       ├── models/         # Modelos de datos
│       └── *.html          # Páginas HTML
├── server.js               # Servidor Express principal
├── package.json            # Dependencias del proyecto
└── README.md              # Este archivo
```

### Endpoints de la API

#### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear nuevo usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario (soft delete)

#### Categorías
- `GET /api/categorias` - Obtener todas las categorías
- `POST /api/categorias` - Crear nueva categoría

#### Stock
- `GET /api/stock` - Obtener todo el stock
- `GET /api/stock/:id` - Obtener producto por ID
- `POST /api/stock` - Crear nuevo producto
- `PUT /api/stock/:id` - Actualizar producto
- `DELETE /api/stock/:id` - Eliminar producto

#### Ventas
- `GET /api/ventas` - Obtener todas las ventas
- `GET /api/ventas/:id` - Obtener venta por ID
- `POST /api/ventas` - Crear nueva venta
- `PUT /api/ventas/:id` - Actualizar venta
- `DELETE /api/ventas/:id` - Eliminar venta
- `POST /api/ventas/reportes` - Obtener reportes por rango de fechas

### Mantenimiento de la Base de Datos

#### Backup
```bash
pg_dump -U postgres -d JoseLuis > backup_$(date +%Y%m%d).sql
```

#### Restaurar Backup
```bash
psql -U postgres -d JoseLuis < backup_YYYYMMDD.sql
```

### Actualización de Dependencias

Para actualizar las dependencias del proyecto:

```bash
npm update
```

Para verificar dependencias desactualizadas:

```bash
npm outdated
```

### Solución de Problemas Comunes

1. **Error de conexión a la base de datos**
   - Verificar que PostgreSQL esté corriendo
   - Revisar credenciales en `database/connection.js`
   - Verificar que la base de datos `JoseLuis` exista

2. **Error al iniciar el servidor**
   - Verificar que el puerto 3000 no esté en uso
   - Revisar que todas las dependencias estén instaladas (`npm install`)

3. **Error 404 en las rutas**
   - Verificar que el servidor esté corriendo
   - Revisar la configuración de rutas estáticas en `server.js`

### Logs y Debugging

Los logs del servidor se muestran en la consola. Para debugging más detallado, se pueden agregar más `console.log` en los controladores y DAOs.

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor en el puerto 3000

## 🔒 Seguridad

- Las contraseñas se almacenan en texto plano (se recomienda implementar hash con bcrypt en producción)
- Las sesiones se manejan con `sessionStorage`
- Validación de entrada en todos los endpoints

## 👥 Contribuidores

- [Tu Nombre] - Desarrollo inicial

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 📞 Contacto

Para más información sobre el proyecto, contactar a: [tu-email@ejemplo.com]

---

**Versión**: 1.0.0  
**Última actualización**: 2024

