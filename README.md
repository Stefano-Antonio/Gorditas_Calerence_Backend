# Restaurant API

API REST para gestión de restaurante desarrollada con Node.js, Express, TypeScript y MongoDB.

## 🚀 Características

- **Gestión completa de restaurante**: Órdenes, inventario, catálogos y reportes
- **Autenticación JWT**: Sistema de autenticación seguro con roles
- **Base de datos MongoDB**: Usando Mongoose para modelado de datos
- **TypeScript**: Tipado estático para mayor robustez
- **Arquitectura modular**: Código organizado y mantenible
- **Validaciones**: Usando Joi para validación de datos
- **Seguridad**: Helmet, CORS y manejo de errores

## 📋 Requisitos

- Node.js 18+
- MongoDB 4.4+
- npm o yarn

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd restaurant-api
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar el archivo `.env` con tus configuraciones:
```env
MONGODB_URI=mongodb://localhost:27017/restaurant-db
JWT_SECRET=tu-jwt-secret-muy-seguro
PORT=3000
```

5. Construir el proyecto:
```bash
npm run build
```

6. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
src/
├── config/          # Configuración de base de datos
├── middleware/      # Middlewares (auth, validación, errores)
├── models/          # Modelos de MongoDB
├── routes/          # Rutas de la API
├── types/           # Tipos TypeScript
├── utils/           # Utilidades y helpers
└── server.ts        # Punto de entrada
```

## 🔗 API Endpoints

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/profile` - Obtener perfil del usuario

### Órdenes
- `GET /api/ordenes` - Listar órdenes
- `POST /api/ordenes/nueva` - Crear nueva orden
- `GET /api/ordenes/:id/detalle` - Obtener detalle completo de orden
- `POST /api/ordenes/:id/suborden` - Agregar suborden
- `POST /api/ordenes/suborden/:id/platillo` - Agregar platillo a suborden
- `POST /api/ordenes/:id/producto` - Agregar producto a orden
- `PUT /api/ordenes/:id/estatus` - Cambiar estatus de orden
- `PUT /api/ordenes/:id/producto/:idProducto` - Actualizar cantidad de producto
- `PUT /api/ordenes/suborden/:id/platillo/:idPlatillo` - Actualizar cantidad de platillo
- `DELETE /api/ordenes/:id/producto/:idProducto` - Eliminar producto de orden
- `DELETE /api/ordenes/suborden/:id/platillo/:idPlatillo` - Eliminar platillo de suborden
- `PUT /api/ordenes/:id/producto/:idProducto/entregar` - Marcar producto como entregado
- `GET /api/ordenes/:id/productos-pendientes` - Obtener productos pendientes
- `GET /api/ordenes/:id/factura` - Obtener orden para facturación
- `POST /api/ordenes/:id/finalizar` - Finalizar orden (cobrar)

### Inventario
- `GET /api/inventario` - Consultar inventario
- `POST /api/inventario/recibir` - Recibir productos
- `PUT /api/inventario/ajustar/:id` - Ajustar inventario

### Gastos
- `GET /api/gastos` - Listar gastos
- `POST /api/gastos` - Crear gasto
- `GET /api/gastos/:id` - Obtener gasto por ID
- `PUT /api/gastos/:id` - Actualizar gasto
- `DELETE /api/gastos/:id` - Eliminar gasto

### Reportes
- `GET /api/reportes/ventas` - Reporte de ventas
- `GET /api/reportes/inventario` - Reporte de inventario
- `GET /api/reportes/gastos` - Reporte de gastos
- `GET /api/reportes/productos-vendidos` - Productos más vendidos

### Catálogos (CRUD)
- `GET /api/catalogos/{modelo}` - Listar
- `POST /api/catalogos/{modelo}` - Crear
- `PUT /api/catalogos/{modelo}/:id` - Actualizar
- `DELETE /api/catalogos/{modelo}/:id` - Eliminar

**Modelos disponibles**: `guiso`, `tipoproducto`, `producto`, `tipoplatillo`, `platillo`, `tipousuario`, `usuario`, `tipoorden`, `mesa`, `tipogasto`

> 📖 **Documentación completa de API**: Ver [API_ROUTES.md](./API_ROUTES.md) para documentación detallada de todas las rutas, parámetros y ejemplos de uso.

## 🔒 Roles y Permisos

### Admin
- Acceso completo a todas las funcionalidades

### Encargado
- Gestión de catálogos, inventario y reportes
- No puede eliminar registros críticos

### Mesero
- Crear y editar órdenes en estatus "Recepcion"

### Despachador
- Surtir órdenes y marcar productos como entregados

### Cocinero
- Ver órdenes en preparación

## 📊 Modelos de Datos

### Catálogos Maestros
- **Guisos**: Tipos de guisos disponibles
- **TipoProducto**: Categorías de productos
- **Productos**: Inventario de productos
- **TipoPlatillo**: Tipos de platillos
- **Platillos**: Platillos del menú
- **TipoUsuario**: Roles de usuarios
- **Usuarios**: Usuarios del sistema
- **TipoOrden**: Tipos de orden (mesa, para llevar, etc.)
- **Mesas**: Mesas del restaurante
- **TipoGasto**: Categorías de gastos

### Transaccionales
- **Ordenes**: Órdenes principales
- **Subordenes**: Subórdenes para organizar platillos
- **OrdenDetalleProducto**: Productos en órdenes
- **OrdenDetallePlatillo**: Platillos en subórdenes
- **Gastos**: Registro de gastos

## 🧪 Testing

```bash
npm test
```

## 📝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 🤝 Soporte

Para soporte, envía un email a [tu-email@ejemplo.com] o crea un issue en GitHub.