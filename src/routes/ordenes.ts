import { Router } from 'express';
import { 
  Orden, 
  Suborden, 
  OrdenDetalleProducto, 
  OrdenDetallePlatillo,
  Producto 
} from '../models';
import { authenticate, isMesero, isDespachador, isCocinero } from '../middleware/auth';
import { 
  validate, 
  createOrdenSchema, 
  addProductToOrdenSchema,
  addPlatilloToSubordenSchema 
} from '../middleware/validation';
import { asyncHandler, createResponse, calculateImporte } from '../utils/helpers';
import { generateFolio } from '../utils/counters';
import { OrdenStatus } from '../types';

const router = Router();

// GET /api/ordenes - Listar órdenes
router.get('/', authenticate, asyncHandler(async (req: any, res: any) => {
  const { estatus, mesa, fecha, page = 1, limit = 10 } = req.query;
  
  const filter: any = {};
  if (estatus) filter.estatus = estatus;
  if (mesa) filter.idMesa = mesa;
  if (fecha) {
    const startDate = new Date(fecha);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    filter.fechaHora = { $gte: startDate, $lt: endDate };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [ordenes, total] = await Promise.all([
    Orden.find(filter)
      .sort({ fechaHora: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Orden.countDocuments(filter)
  ]);

  res.json(createResponse(true, {
    ordenes,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  }));
}));

// POST /api/ordenes/nueva - Crear nueva orden
router.post('/nueva', authenticate, isMesero, validate(createOrdenSchema), 
  asyncHandler(async (req: any, res: any) => {
    const folio = await generateFolio();
    
    const orden = new Orden({
      folio,
      ...req.body,
      estatus: OrdenStatus.RECEPCION
    });

    await orden.save();
    res.status(201).json(createResponse(true, orden, 'Orden creada exitosamente'));
  })
);

// POST /api/ordenes/:id/suborden - Agregar suborden
router.post('/:id/suborden', authenticate, isMesero, 
  asyncHandler(async (req: any, res: any) => {
    const { nombre } = req.body;
    
    const orden = await Orden.findById(req.params.id);
    if (!orden) {
      return res.status(404).json(createResponse(false, null, 'Orden no encontrada'));
    }

    if (orden.estatus !== OrdenStatus.RECEPCION) {
      return res.status(400).json(createResponse(false, null, 'Solo se pueden modificar órdenes en recepción'));
    }

    const suborden = new Suborden({
      idOrden: orden._id,
      nombre
    });

    await suborden.save();
    res.status(201).json(createResponse(true, suborden, 'Suborden creada exitosamente'));
  })
);

// POST /api/ordenes/suborden/:id/platillo - Agregar platillo
router.post('/suborden/:id/platillo', authenticate, isMesero, 
  validate(addPlatilloToSubordenSchema),
  asyncHandler(async (req: any, res: any) => {
    const suborden = await Suborden.findById(req.params.id);
    if (!suborden) {
      return res.status(404).json(createResponse(false, null, 'Suborden no encontrada'));
    }

    const orden = await Orden.findById(suborden.idOrden);
    if (!orden || orden.estatus !== OrdenStatus.RECEPCION) {
      return res.status(400).json(createResponse(false, null, 'Solo se pueden modificar órdenes en recepción'));
    }

    const { costoPlatillo, cantidad } = req.body;
    const importe = calculateImporte(costoPlatillo, cantidad);

    const detallePlatillo = new OrdenDetallePlatillo({
      idSuborden: suborden._id,
      ...req.body,
      importe
    });

    await detallePlatillo.save();

    // Actualizar total de la orden
    await updateOrdenTotal((orden._id as string));

    res.status(201).json(createResponse(true, detallePlatillo, 'Platillo agregado exitosamente'));
  })
);

// POST /api/ordenes/:id/producto - Agregar producto
router.post('/:id/producto', authenticate, isMesero, 
  validate(addProductToOrdenSchema),
  asyncHandler(async (req: any, res: any) => {
    const orden = await Orden.findById(req.params.id);
    if (!orden) {
      return res.status(404).json(createResponse(false, null, 'Orden no encontrada'));
    }

    if (orden.estatus !== OrdenStatus.RECEPCION) {
      return res.status(400).json(createResponse(false, null, 'Solo se pueden modificar órdenes en recepción'));
    }

    const { idProducto, costoProducto, cantidad } = req.body;
    
    // Verificar inventario
    const producto = await Producto.findById(idProducto);
    if (!producto || producto.cantidad < cantidad) {
      return res.status(400).json(createResponse(false, null, 'Producto no disponible o stock insuficiente'));
    }

    const importe = calculateImporte(costoProducto, cantidad);

    const detalleProducto = new OrdenDetalleProducto({
      idOrden: orden._id,
      ...req.body,
      importe
    });

    await detalleProducto.save();

    // Actualizar inventario
    await Producto.findByIdAndUpdate(idProducto, {
      $inc: { cantidad: -cantidad }
    });

    // Actualizar total de la orden
    await updateOrdenTotal((orden._id as string));

    res.status(201).json(createResponse(true, detalleProducto, 'Producto agregado exitosamente'));
  })
);

// PUT /api/ordenes/:id/estatus - Cambiar estatus
router.put('/:id/estatus', authenticate, isDespachador,
  asyncHandler(async (req: any, res: any) => {
    const { estatus } = req.body;
    
    if (!Object.values(OrdenStatus).includes(estatus)) {
      return res.status(400).json(createResponse(false, null, 'Estatus no válido'));
    }

    const orden = await Orden.findByIdAndUpdate(
      req.params.id,
      { estatus },
      { new: true }
    );

    if (!orden) {
      return res.status(404).json(createResponse(false, null, 'Orden no encontrada'));
    }

    res.json(createResponse(true, orden, 'Estatus actualizado exitosamente'));
  })
);

// GET /api/ordenes/:id/detalle - Obtener detalle completo de orden
router.get('/:id/detalle', authenticate, asyncHandler(async (req: any, res: any) => {
  const orden = await Orden.findById(req.params.id);
  if (!orden) {
    return res.status(404).json(createResponse(false, null, 'Orden no encontrada'));
  }

  const [productos, subordenes] = await Promise.all([
    OrdenDetalleProducto.find({ idOrden: orden._id }),
    Suborden.find({ idOrden: orden._id })
  ]);

  // Obtener platillos de todas las subórdenes
  const platillos = await OrdenDetallePlatillo.find({
    idSuborden: { $in: subordenes.map(s => s._id) }
  });

  res.json(createResponse(true, {
    orden,
    productos,
    subordenes,
    platillos
  }));
}));

// DELETE /api/ordenes/:id/producto/:idProducto - Eliminar producto de orden
router.delete('/:id/producto/:idProducto', authenticate, isMesero,
  asyncHandler(async (req: any, res: any) => {
    const orden = await Orden.findById(req.params.id);
    if (!orden) {
      return res.status(404).json(createResponse(false, null, 'Orden no encontrada'));
    }

    if (orden.estatus !== OrdenStatus.RECEPCION) {
      return res.status(400).json(createResponse(false, null, 'Solo se pueden modificar órdenes en recepción'));
    }

    const detalleProducto = await OrdenDetalleProducto.findOneAndDelete({
      idOrden: orden._id,
      idProducto: req.params.idProducto
    });

    if (!detalleProducto) {
      return res.status(404).json(createResponse(false, null, 'Producto no encontrado en la orden'));
    }

    // Restaurar inventario
    await Producto.findByIdAndUpdate(detalleProducto.idProducto, {
      $inc: { cantidad: detalleProducto.cantidad }
    });

    // Actualizar total de la orden
    await updateOrdenTotal((orden._id as string));

    res.json(createResponse(true, null, 'Producto eliminado exitosamente'));
  })
);

// DELETE /api/ordenes/suborden/:id/platillo/:idPlatillo - Eliminar platillo de suborden
router.delete('/suborden/:id/platillo/:idPlatillo', authenticate, isMesero,
  asyncHandler(async (req: any, res: any) => {
    const suborden = await Suborden.findById(req.params.id);
    if (!suborden) {
      return res.status(404).json(createResponse(false, null, 'Suborden no encontrada'));
    }

    const orden = await Orden.findById(suborden.idOrden);
    if (!orden || orden.estatus !== OrdenStatus.RECEPCION) {
      return res.status(400).json(createResponse(false, null, 'Solo se pueden modificar órdenes en recepción'));
    }

    const detallePlatillo = await OrdenDetallePlatillo.findOneAndDelete({
      idSuborden: suborden._id,
      idPlatillo: req.params.idPlatillo
    });

    if (!detallePlatillo) {
      return res.status(404).json(createResponse(false, null, 'Platillo no encontrado en la suborden'));
    }

    // Actualizar total de la orden
    await updateOrdenTotal((orden._id as string));

    res.json(createResponse(true, null, 'Platillo eliminado exitosamente'));
  })
);

// PUT /api/ordenes/:id/producto/:idProducto - Actualizar cantidad de producto
router.put('/:id/producto/:idProducto', authenticate, isMesero,
  asyncHandler(async (req: any, res: any) => {
    const { cantidad } = req.body;
    
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json(createResponse(false, null, 'Cantidad debe ser mayor a 0'));
    }

    const orden = await Orden.findById(req.params.id);
    if (!orden) {
      return res.status(404).json(createResponse(false, null, 'Orden no encontrada'));
    }

    if (orden.estatus !== OrdenStatus.RECEPCION) {
      return res.status(400).json(createResponse(false, null, 'Solo se pueden modificar órdenes en recepción'));
    }

    const detalleProducto = await OrdenDetalleProducto.findOne({
      idOrden: orden._id,
      idProducto: req.params.idProducto
    });

    if (!detalleProducto) {
      return res.status(404).json(createResponse(false, null, 'Producto no encontrado en la orden'));
    }

    // Verificar inventario disponible
    const producto = await Producto.findById(req.params.idProducto);
    if (!producto) {
      return res.status(404).json(createResponse(false, null, 'Producto no encontrado'));
    }

    const diferencia = cantidad - detalleProducto.cantidad;
    if (producto.cantidad < diferencia) {
      return res.status(400).json(createResponse(false, null, 'Stock insuficiente'));
    }

    // Actualizar inventario
    await Producto.findByIdAndUpdate(req.params.idProducto, {
      $inc: { cantidad: -diferencia }
    });

    // Actualizar detalle
    detalleProducto.cantidad = cantidad;
    detalleProducto.importe = calculateImporte(detalleProducto.costoProducto, cantidad);
    await detalleProducto.save();

    // Actualizar total de la orden
    await updateOrdenTotal((orden._id as string));

    res.json(createResponse(true, detalleProducto, 'Cantidad actualizada exitosamente'));
  })
);

// PUT /api/ordenes/suborden/:id/platillo/:idPlatillo - Actualizar cantidad de platillo
router.put('/suborden/:id/platillo/:idPlatillo', authenticate, isMesero,
  asyncHandler(async (req: any, res: any) => {
    const { cantidad } = req.body;
    
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json(createResponse(false, null, 'Cantidad debe ser mayor a 0'));
    }

    const suborden = await Suborden.findById(req.params.id);
    if (!suborden) {
      return res.status(404).json(createResponse(false, null, 'Suborden no encontrada'));
    }

    const orden = await Orden.findById(suborden.idOrden);
    if (!orden || orden.estatus !== OrdenStatus.RECEPCION) {
      return res.status(400).json(createResponse(false, null, 'Solo se pueden modificar órdenes en recepción'));
    }

    const detallePlatillo = await OrdenDetallePlatillo.findOne({
      idSuborden: suborden._id,
      idPlatillo: req.params.idPlatillo
    });

    if (!detallePlatillo) {
      return res.status(404).json(createResponse(false, null, 'Platillo no encontrado en la suborden'));
    }

    // Actualizar detalle
    detallePlatillo.cantidad = cantidad;
    detallePlatillo.importe = calculateImporte(detallePlatillo.costoPlatillo, cantidad);
    await detallePlatillo.save();

    // Actualizar total de la orden
    await updateOrdenTotal((orden._id as string));

    res.json(createResponse(true, detallePlatillo, 'Cantidad actualizada exitosamente'));
  })
);

// PUT /api/ordenes/:id/producto/:idProducto/entregar - Marcar producto como entregado
router.put('/:id/producto/:idProducto/entregar', authenticate, isDespachador,
  asyncHandler(async (req: any, res: any) => {
    const orden = await Orden.findById(req.params.id);
    if (!orden) {
      return res.status(404).json(createResponse(false, null, 'Orden no encontrada'));
    }

    if (orden.estatus !== OrdenStatus.SURTIDA) {
      return res.status(400).json(createResponse(false, null, 'Solo se pueden entregar productos de órdenes surtidas'));
    }

    const detalleProducto = await OrdenDetalleProducto.findOne({
      idOrden: orden._id,
      idProducto: req.params.idProducto
    });

    if (!detalleProducto) {
      return res.status(404).json(createResponse(false, null, 'Producto no encontrado en la orden'));
    }

    // Marcar como entregado (podríamos agregar un campo 'entregado' al modelo)
    // Por ahora solo confirmamos que está en la orden
    res.json(createResponse(true, detalleProducto, 'Producto marcado como entregado'));
  })
);

// GET /api/ordenes/:id/productos-pendientes - Obtener productos pendientes de entrega
router.get('/:id/productos-pendientes', authenticate, isDespachador,
  asyncHandler(async (req: any, res: any) => {
    const orden = await Orden.findById(req.params.id);
    if (!orden) {
      return res.status(404).json(createResponse(false, null, 'Orden no encontrada'));
    }

    const productos = await OrdenDetalleProducto.find({ idOrden: orden._id });
    
    res.json(createResponse(true, {
      orden,
      productos
    }));
  })
);

// GET /api/ordenes/:id/factura - Obtener orden para facturación
router.get('/:id/factura', authenticate, asyncHandler(async (req: any, res: any) => {
  const orden = await Orden.findById(req.params.id);
  if (!orden) {
    return res.status(404).json(createResponse(false, null, 'Orden no encontrada'));
  }

  const [productos, subordenes] = await Promise.all([
    OrdenDetalleProducto.find({ idOrden: orden._id }),
    Suborden.find({ idOrden: orden._id })
  ]);

  // Obtener platillos de todas las subórdenes
  const platillos = await OrdenDetallePlatillo.find({
    idSuborden: { $in: subordenes.map(s => s._id) }
  });

  // Calcular totales
  const totalProductos = productos.reduce((sum, p) => sum + p.importe, 0);
  const totalPlatillos = platillos.reduce((sum, p) => sum + p.importe, 0);
  const totalGeneral = totalProductos + totalPlatillos;

  res.json(createResponse(true, {
    orden: {
      ...orden.toObject(),
      total: totalGeneral
    },
    productos,
    subordenes: subordenes.map(sub => ({
      ...sub.toObject(),
      platillos: platillos.filter(p => p.idSuborden === sub._id)
    })),
    resumen: {
      totalProductos,
      totalPlatillos,
      totalGeneral,
      cantidadProductos: productos.length,
      cantidadPlatillos: platillos.length
    }
  }));
}));

// POST /api/ordenes/:id/finalizar - Finalizar orden (cobrar)
router.post('/:id/finalizar', authenticate, asyncHandler(async (req: any, res: any) => {
  const { metodoPago, montoPagado, cambio } = req.body;
  
  const orden = await Orden.findById(req.params.id);
  if (!orden) {
    return res.status(404).json(createResponse(false, null, 'Orden no encontrada'));
  }

  if (orden.estatus === OrdenStatus.FINALIZADA) {
    return res.status(400).json(createResponse(false, null, 'La orden ya fue finalizada'));
  }

  // Actualizar estatus a finalizada
  orden.estatus = OrdenStatus.FINALIZADA;
  await orden.save();

  // Aquí se podría generar un ticket/factura
  res.json(createResponse(true, {
    orden,
    metodoPago,
    montoPagado,
    cambio,
    fechaFinalizacion: new Date()
  }, 'Orden finalizada exitosamente'));
}));

// Helper function to update orden total
async function updateOrdenTotal(ordenId: string) {
  const [productosTotal, platillosTotal] = await Promise.all([
    OrdenDetalleProducto.aggregate([
      { $match: { idOrden: ordenId } },
      { $group: { _id: null, total: { $sum: '$importe' } } }
    ]),
    OrdenDetallePlatillo.aggregate([
      { $lookup: { from: 'subordenes', localField: 'idSuborden', foreignField: '_id', as: 'suborden' } },
      { $match: { 'suborden.idOrden': ordenId } },
      { $group: { _id: null, total: { $sum: '$importe' } } }
    ])
  ]);

  const total = (productosTotal[0]?.total || 0) + (platillosTotal[0]?.total || 0);
  
  await Orden.findByIdAndUpdate(ordenId, { total });
}

export default router;