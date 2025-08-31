# API Routes Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All routes (except login) require authentication with JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Routes by Category

### 🔐 Authentication (`/api/auth`)

| Method | Route | Description | Body Parameters | Response |
|--------|-------|-------------|-----------------|----------|
| POST | `/login` | User login | `{ email, password }` | `{ token, user }` |
| GET | `/profile` | Get user profile | - | User data |

---

### 📝 Orders (`/api/ordenes`)

#### Order Management
| Method | Route | Description | Permissions | Body/Query Parameters |
|--------|-------|-------------|-------------|---------------------|
| GET | `/` | List orders | All | Query: `estatus`, `mesa`, `fecha`, `page`, `limit` |
| POST | `/nueva` | Create new order | Mesero+ | `{ idTipoOrden, nombreTipoOrden, idMesa?, nombreMesa? }` |
| GET | `/:id/detalle` | Get complete order details | All | - |
| PUT | `/:id/estatus` | Change order status | Despachador+ | `{ estatus }` |

#### Suborders
| Method | Route | Description | Permissions | Parameters |
|--------|-------|-------------|-------------|-----------|
| POST | `/:id/suborden` | Add suborder to order | Mesero+ | `{ nombre }` |

#### Products in Orders
| Method | Route | Description | Permissions | Parameters |
|--------|-------|-------------|-------------|-----------|
| POST | `/:id/producto` | Add product to order | Mesero+ | `{ idProducto, nombreProducto, costoProducto, cantidad }` |
| PUT | `/:id/producto/:idProducto` | Update product quantity | Mesero+ | `{ cantidad }` |
| DELETE | `/:id/producto/:idProducto` | Remove product from order | Mesero+ | - |
| PUT | `/:id/producto/:idProducto/entregar` | Mark product as delivered | Despachador+ | - |

#### Dishes in Suborders
| Method | Route | Description | Permissions | Parameters |
|--------|-------|-------------|-------------|-----------|
| POST | `/suborden/:id/platillo` | Add dish to suborder | Mesero+ | `{ idPlatillo, nombrePlatillo, idGuiso, nombreGuiso, costoPlatillo, cantidad }` |
| PUT | `/suborden/:id/platillo/:idPlatillo` | Update dish quantity | Mesero+ | `{ cantidad }` |
| DELETE | `/suborden/:id/platillo/:idPlatillo` | Remove dish from suborder | Mesero+ | - |

#### Dispatch & Billing
| Method | Route | Description | Permissions | Parameters |
|--------|-------|-------------|-------------|-----------|
| GET | `/:id/productos-pendientes` | Get pending products for dispatch | Despachador+ | - |
| GET | `/:id/factura` | Get order for billing | All | - |
| POST | `/:id/finalizar` | Finalize order payment | All | `{ metodoPago?, montoPagado?, cambio? }` |

---

### 📦 Inventory (`/api/inventario`)

| Method | Route | Description | Permissions | Parameters |
|--------|-------|-------------|-------------|-----------|
| GET | `/` | Get inventory | All | Query: `tipoProducto`, `activo`, `page`, `limit` |
| POST | `/recibir` | Receive products | Encargado+ | `{ productos: [{ idProducto, cantidad }] }` |
| PUT | `/ajustar/:id` | Adjust inventory | Encargado+ | `{ cantidad, motivo }` |

---

### 📊 Reports (`/api/reportes`)

| Method | Route | Description | Permissions | Query Parameters |
|--------|-------|-------------|-------------|------------------|
| GET | `/ventas` | Sales report | Encargado+ | `fechaInicio`, `fechaFin`, `tipoOrden`, `mesa` |
| GET | `/inventario` | Inventory report | Encargado+ | - |
| GET | `/gastos` | Expenses report | Encargado+ | `fechaInicio`, `fechaFin`, `tipoGasto` |
| GET | `/productos-vendidos` | Best selling products | Encargado+ | `fechaInicio`, `fechaFin`, `limit` |

---

### 💰 Expenses (`/api/gastos`)

| Method | Route | Description | Permissions | Parameters |
|--------|-------|-------------|-------------|-----------|
| GET | `/` | List expenses | Encargado+ | Query: `tipoGasto`, `fechaInicio`, `fechaFin`, `page`, `limit` |
| POST | `/` | Create expense | Encargado+ | `{ idTipoGasto, nombreTipoGasto, costo, fecha? }` |
| GET | `/:id` | Get expense by ID | Encargado+ | - |
| PUT | `/:id` | Update expense | Encargado+ | `{ idTipoGasto?, nombreTipoGasto?, costo?, fecha? }` |
| DELETE | `/:id` | Delete expense | Encargado+ | - |

---

### 📚 Catalogs (`/api/catalogos`)

#### Available Models
- `guiso` - Stews/Fillings
- `tipoproducto` - Product Types  
- `producto` - Products
- `tipoplatillo` - Dish Types
- `platillo` - Dishes
- `tipousuario` - User Types
- `usuario` - Users
- `tipoorden` - Order Types
- `mesa` - Tables
- `tipogasto` - Expense Types

| Method | Route | Description | Permissions | Parameters |
|--------|-------|-------------|-------------|-----------|
| GET | `/{modelo}` | List catalog items | All | Query: `page`, `limit`, `activo`, `search` |
| POST | `/{modelo}` | Create catalog item | Encargado+ | Model-specific fields |
| PUT | `/{modelo}/:id` | Update catalog item | Encargado+ | Model-specific fields |
| DELETE | `/{modelo}/:id` | Delete catalog item | Admin | - |

---

## Data Models Structure

### Catálogos (Master Collections)

#### Guisos
```json
{
  "_id": 1,
  "nombre": "Mole",
  "descripcion": "Mole con arroz",
  "activo": true
}
```

#### TipoProducto
```json
{
  "_id": 1,
  "nombre": "Bebida",
  "descripcion": "Bebidas",
  "activo": true
}
```

#### Productos
```json
{
  "_id": 1,
  "idTipoProducto": 1,
  "nombreTipoProducto": "Bebida",
  "nombre": "Jugo Boing 500ml",
  "cantidad": 5,
  "costo": 15,
  "activo": true
}
```

#### TipoPlatillo
```json
{
  "_id": 1,
  "nombre": "Gordita",
  "descripcion": "Gordita de Harina",
  "activo": true
}
```

#### Platillos
```json
{
  "_id": 1,
  "idTipoPlatillo": 1,
  "nombreTipoPlatillo": "Gordita",
  "nombre": "Gordita Harina",
  "descripcion": "Gordita de harina",
  "costo": 20,
  "activo": true
}
```

#### TipoUsuario
```json
{
  "_id": 1,
  "nombre": "Mesero",
  "descripcion": "Levanta órdenes"
}
```

#### Usuarios
```json
{
  "_id": "ObjectId",
  "nombre": "Marisol",
  "email": "marisol@example.com",
  "idTipoUsuario": 3,
  "nombreTipoUsuario": "Admin",
  "activo": true
}
```

#### TipoOrden
```json
{
  "_id": 1,
  "nombre": "Sitio",
  "activo": true
}
```

#### Mesas
```json
{
  "_id": 1,
  "nombre": "Mesa 1"
}
```

#### TipoGasto
```json
{
  "_id": 1,
  "nombre": "Carne",
  "activo": true
}
```

### Transaccionales (Operational Collections)

#### Ordenes
```json
{
  "_id": "ObjectId",
  "folio": "ORD-2024-001",
  "idTipoOrden": 1,
  "nombreTipoOrden": "Sitio",
  "estatus": "Recepcion",
  "idMesa": 1,
  "nombreMesa": "Mesa 1",
  "fechaHora": "2024-01-01T12:00:00Z",
  "total": 150.50
}
```

#### Subordenes
```json
{
  "_id": "ObjectId",
  "idOrden": "ObjectId",
  "nombre": "Orden Juan"
}
```

#### OrdenDetalleProducto
```json
{
  "_id": "ObjectId",
  "idOrden": "ObjectId",
  "idProducto": 1,
  "nombreProducto": "Jugo Boing 500ml",
  "costoProducto": 15,
  "cantidad": 2,
  "importe": 30
}
```

#### OrdenDetallePlatillo
```json
{
  "_id": "ObjectId",
  "idSuborden": "ObjectId",
  "idPlatillo": 1,
  "nombrePlatillo": "Gordita Harina",
  "idGuiso": 1,
  "nombreGuiso": "Mole",
  "costoPlatillo": 20,
  "cantidad": 3,
  "importe": 60
}
```

#### Gastos
```json
{
  "_id": "ObjectId",
  "idTipoGasto": 1,
  "nombreTipoGasto": "Carne",
  "costo": 500,
  "fecha": "2024-01-01T12:00:00Z"
}
```

---

## Order Status Flow

1. **Recepcion** - Order being created/edited (Mesero)
2. **Preparacion** - Order sent to kitchen (Cocinero)
3. **Surtida** - Order ready for dispatch (Despachador)
4. **Entregado** - Order delivered to customer
5. **Finalizada** - Order payment completed
6. **Cancelado** - Order cancelled

---

## User Roles & Permissions

- **Admin**: Full access to all functions
- **Encargado**: Catalog management, inventory, reports
- **Mesero**: Create/edit orders in "Recepcion" status
- **Despachador**: Supply orders, mark products as delivered
- **Cocinero**: View orders in preparation

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Success Responses

All endpoints return standardized success responses:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Usage Examples

### Create New Order Flow
1. `POST /api/ordenes/nueva` - Create order
2. `POST /api/ordenes/:id/suborden` - Add suborder
3. `POST /api/ordenes/suborden/:id/platillo` - Add dishes
4. `POST /api/ordenes/:id/producto` - Add products
5. `PUT /api/ordenes/:id/estatus` - Change to "Preparacion"

### Edit Order Flow
1. `GET /api/ordenes?estatus=Recepcion` - Get orders in reception
2. `GET /api/ordenes/:id/detalle` - Get order details
3. `PUT /api/ordenes/:id/producto/:idProducto` - Update quantities
4. `DELETE /api/ordenes/:id/producto/:idProducto` - Remove items

### Supply Order Flow
1. `GET /api/ordenes?estatus=Preparacion` - Get orders ready to supply
2. `PUT /api/ordenes/:id/estatus` - Change to "Surtida"

### Dispatch Flow
1. `GET /api/ordenes?estatus=Surtida` - Get supplied orders
2. `GET /api/ordenes/:id/productos-pendientes` - Get products to deliver
3. `PUT /api/ordenes/:id/producto/:idProducto/entregar` - Mark as delivered

### Billing Flow
1. `GET /api/ordenes/:id/factura` - Get order for billing
2. `POST /api/ordenes/:id/finalizar` - Complete payment