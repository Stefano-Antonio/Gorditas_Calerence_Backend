# Complete Routes Summary

## Authentication Routes (`/api/auth`)
1. **POST** `/login` - Login
   - Body: `{ email: string, password: string }`
   
2. **GET** `/profile` - Get user profile
   - Headers: `Authorization: Bearer <token>`

---

## Order Routes (`/api/ordenes`)

### Order Management
3. **GET** `/` - List orders
   - Query: `estatus?, mesa?, fecha?, page?, limit?`
   
4. **POST** `/nueva` - Create new order
   - Body: `{ idTipoOrden: number, nombreTipoOrden: string, idMesa?: number, nombreMesa?: string }`
   
5. **GET** `/:id/detalle` - Get complete order details
   - Params: `id: string`
   
6. **PUT** `/:id/estatus` - Change order status
   - Params: `id: string`
   - Body: `{ estatus: 'Recepcion' | 'Preparacion' | 'Surtida' | 'Entregado' | 'Finalizada' | 'Cancelado' }`

### Suborders
7. **POST** `/:id/suborden` - Add suborder to order
   - Params: `id: string`
   - Body: `{ nombre: string }`

### Products in Orders
8. **POST** `/:id/producto` - Add product to order
   - Params: `id: string`
   - Body: `{ idProducto: number, nombreProducto: string, costoProducto: number, cantidad: number }`
   
9. **PUT** `/:id/producto/:idProducto` - Update product quantity
   - Params: `id: string, idProducto: number`
   - Body: `{ cantidad: number }`
   
10. **DELETE** `/:id/producto/:idProducto` - Remove product from order
    - Params: `id: string, idProducto: number`
    
11. **PUT** `/:id/producto/:idProducto/entregar` - Mark product as delivered
    - Params: `id: string, idProducto: number`

### Dishes in Suborders
12. **POST** `/suborden/:id/platillo` - Add dish to suborder
    - Params: `id: string`
    - Body: `{ idPlatillo: number, nombrePlatillo: string, idGuiso: number, nombreGuiso: string, costoPlatillo: number, cantidad: number }`
    
13. **PUT** `/suborden/:id/platillo/:idPlatillo` - Update dish quantity
    - Params: `id: string, idPlatillo: number`
    - Body: `{ cantidad: number }`
    
14. **DELETE** `/suborden/:id/platillo/:idPlatillo` - Remove dish from suborder
    - Params: `id: string, idPlatillo: number`

### Dispatch & Billing
15. **GET** `/:id/productos-pendientes` - Get pending products for dispatch
    - Params: `id: string`
    
16. **GET** `/:id/factura` - Get order for billing
    - Params: `id: string`
    
17. **POST** `/:id/finalizar` - Finalize order payment
    - Params: `id: string`
    - Body: `{ metodoPago?: string, montoPagado?: number, cambio?: number }`

---

## Inventory Routes (`/api/inventario`)

18. **GET** `/` - Get inventory
    - Query: `tipoProducto?, activo?, page?, limit?`
    
19. **POST** `/recibir` - Receive products
    - Body: `{ productos: [{ idProducto: number, cantidad: number }] }`
    
20. **PUT** `/ajustar/:id` - Adjust inventory
    - Params: `id: number`
    - Body: `{ cantidad: number, motivo: string }`

---

## Expenses Routes (`/api/gastos`)

21. **GET** `/` - List expenses
    - Query: `tipoGasto?, fechaInicio?, fechaFin?, page?, limit?`
    
22. **POST** `/` - Create expense
    - Body: `{ idTipoGasto: number, nombreTipoGasto: string, costo: number, fecha?: Date }`
    
23. **GET** `/:id` - Get expense by ID
    - Params: `id: string`
    
24. **PUT** `/:id` - Update expense
    - Params: `id: string`
    - Body: `{ idTipoGasto?: number, nombreTipoGasto?: string, costo?: number, fecha?: Date }`
    
25. **DELETE** `/:id` - Delete expense
    - Params: `id: string`

---

## Reports Routes (`/api/reportes`)

26. **GET** `/ventas` - Sales report
    - Query: `fechaInicio?, fechaFin?, tipoOrden?, mesa?`
    
27. **GET** `/inventario` - Inventory report
    - No parameters
    
28. **GET** `/gastos` - Expenses report
    - Query: `fechaInicio?, fechaFin?, tipoGasto?`
    
29. **GET** `/productos-vendidos` - Best selling products
    - Query: `fechaInicio?, fechaFin?, limit?`

---

## Catalog Routes (`/api/catalogos`)

Available models: `guiso`, `tipoproducto`, `producto`, `tipoplatillo`, `platillo`, `tipousuario`, `usuario`, `tipoorden`, `mesa`, `tipogasto`

30. **GET** `/{modelo}` - List catalog items
    - Params: `modelo: string`
    - Query: `page?, limit?, activo?, search?`
    
31. **POST** `/{modelo}` - Create catalog item
    - Params: `modelo: string`
    - Body: Model-specific fields
    
32. **PUT** `/{modelo}/:id` - Update catalog item
    - Params: `modelo: string, id: string|number`
    - Body: Model-specific fields
    
33. **DELETE** `/{modelo}/:id` - Delete catalog item
    - Params: `modelo: string, id: string|number`

---

## Total Routes: 33

### By Category:
- **Authentication**: 2 routes
- **Orders**: 15 routes
- **Inventory**: 3 routes
- **Expenses**: 5 routes
- **Reports**: 4 routes
- **Catalogs**: 4 routes (x10 models = 40 effective endpoints)

### By Permission Level:
- **Public**: 1 route (login)
- **All authenticated**: 6 routes
- **Mesero+**: 8 routes
- **Despachador+**: 3 routes
- **Encargado+**: 13 routes
- **Admin only**: 1 route

### By HTTP Method:
- **GET**: 12 routes
- **POST**: 8 routes
- **PUT**: 8 routes
- **DELETE**: 5 routes