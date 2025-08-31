"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const helpers_1 = require("../utils/helpers");
const counters_1 = require("../utils/counters");
const types_1 = require("../types");
const router = (0, express_1.Router)();
// GET /api/ordenes - Listar órdenes
router.get('/', auth_1.authenticate, (0, helpers_1.asyncHandler)(async (req, res) => {
    const { estatus, mesa, fecha, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (estatus)
        filter.estatus = estatus;
    if (mesa)
        filter.idMesa = mesa;
    if (fecha) {
        const startDate = new Date(fecha);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        filter.fechaHora = { $gte: startDate, $lt: endDate };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [ordenes, total] = await Promise.all([
        models_1.Orden.find(filter)
            .sort({ fechaHora: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        models_1.Orden.countDocuments(filter)
    ]);
    res.json((0, helpers_1.createResponse)(true, {
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
router.post('/nueva', auth_1.authenticate, auth_1.isMesero, (0, validation_1.validate)(validation_1.createOrdenSchema), (0, helpers_1.asyncHandler)(async (req, res) => {
    const folio = await (0, counters_1.generateFolio)();
    const orden = new models_1.Orden({
        folio,
        ...req.body,
        estatus: types_1.OrdenStatus.RECEPCION
    });
    await orden.save();
    res.status(201).json((0, helpers_1.createResponse)(true, orden, 'Orden creada exitosamente'));
}));
// POST /api/ordenes/:id/suborden - Agregar suborden
router.post('/:id/suborden', auth_1.authenticate, auth_1.isMesero, (0, helpers_1.asyncHandler)(async (req, res) => {
    const { nombre } = req.body;
    const orden = await models_1.Orden.findById(req.params.id);
    if (!orden) {
        return res.status(404).json((0, helpers_1.createResponse)(false, null, 'Orden no encontrada'));
    }
    if (orden.estatus !== types_1.OrdenStatus.RECEPCION) {
        return res.status(400).json((0, helpers_1.createResponse)(false, null, 'Solo se pueden modificar órdenes en recepción'));
    }
    const suborden = new models_1.Suborden({
        idOrden: orden._id,
        nombre
    });
    await suborden.save();
    res.status(201).json((0, helpers_1.createResponse)(true, suborden, 'Suborden creada exitosamente'));
}));
// POST /api/ordenes/suborden/:id/platillo - Agregar platillo
router.post('/suborden/:id/platillo', auth_1.authenticate, auth_1.isMesero, (0, validation_1.validate)(validation_1.addPlatilloToSubordenSchema), (0, helpers_1.asyncHandler)(async (req, res) => {
    const suborden = await models_1.Suborden.findById(req.params.id);
    if (!suborden) {
        return res.status(404).json((0, helpers_1.createResponse)(false, null, 'Suborden no encontrada'));
    }
    const orden = await models_1.Orden.findById(suborden.idOrden);
    if (orden?.estatus !== types_1.OrdenStatus.RECEPCION) {
        return res.status(400).json((0, helpers_1.createResponse)(false, null, 'Solo se pueden modificar órdenes en recepción'));
    }
    const { costoPlatillo, cantidad } = req.body;
    const importe = (0, helpers_1.calculateImporte)(costoPlatillo, cantidad);
    const detallePlatillo = new models_1.OrdenDetallePlatillo({
        idSuborden: suborden._id,
        ...req.body,
        importe
    });
    await detallePlatillo.save();
    // Actualizar total de la orden
    await updateOrdenTotal(orden._id);
    res.status(201).json((0, helpers_1.createResponse)(true, detallePlatillo, 'Platillo agregado exitosamente'));
}));
// POST /api/ordenes/:id/producto - Agregar producto
router.post('/:id/producto', auth_1.authenticate, auth_1.isMesero, (0, validation_1.validate)(validation_1.addProductToOrdenSchema), (0, helpers_1.asyncHandler)(async (req, res) => {
    const orden = await models_1.Orden.findById(req.params.id);
    if (!orden) {
        return res.status(404).json((0, helpers_1.createResponse)(false, null, 'Orden no encontrada'));
    }
    if (orden.estatus !== types_1.OrdenStatus.RECEPCION) {
        return res.status(400).json((0, helpers_1.createResponse)(false, null, 'Solo se pueden modificar órdenes en recepción'));
    }
    const { idProducto, costoProducto, cantidad } = req.body;
    // Verificar inventario
    const producto = await models_1.Producto.findById(idProducto);
    if (!producto || producto.cantidad < cantidad) {
        return res.status(400).json((0, helpers_1.createResponse)(false, null, 'Producto no disponible o stock insuficiente'));
    }
    const importe = (0, helpers_1.calculateImporte)(costoProducto, cantidad);
    const detalleProducto = new models_1.OrdenDetalleProducto({
        idOrden: orden._id,
        ...req.body,
        importe
    });
    await detalleProducto.save();
    // Actualizar inventario
    await models_1.Producto.findByIdAndUpdate(idProducto, {
        $inc: { cantidad: -cantidad }
    });
    // Actualizar total de la orden
    await updateOrdenTotal(orden._id);
    res.status(201).json((0, helpers_1.createResponse)(true, detalleProducto, 'Producto agregado exitosamente'));
}));
// PUT /api/ordenes/:id/estatus - Cambiar estatus
router.put('/:id/estatus', auth_1.authenticate, auth_1.isDespachador, (0, helpers_1.asyncHandler)(async (req, res) => {
    const { estatus } = req.body;
    if (!Object.values(types_1.OrdenStatus).includes(estatus)) {
        return res.status(400).json((0, helpers_1.createResponse)(false, null, 'Estatus no válido'));
    }
    const orden = await models_1.Orden.findByIdAndUpdate(req.params.id, { estatus }, { new: true });
    if (!orden) {
        return res.status(404).json((0, helpers_1.createResponse)(false, null, 'Orden no encontrada'));
    }
    res.json((0, helpers_1.createResponse)(true, orden, 'Estatus actualizado exitosamente'));
}));
// Helper function to update orden total
async function updateOrdenTotal(ordenId) {
    const [productosTotal, platillosTotal] = await Promise.all([
        models_1.OrdenDetalleProducto.aggregate([
            { $match: { idOrden: ordenId } },
            { $group: { _id: null, total: { $sum: '$importe' } } }
        ]),
        models_1.OrdenDetallePlatillo.aggregate([
            { $lookup: { from: 'subordenes', localField: 'idSuborden', foreignField: '_id', as: 'suborden' } },
            { $match: { 'suborden.idOrden': ordenId } },
            { $group: { _id: null, total: { $sum: '$importe' } } }
        ])
    ]);
    const total = (productosTotal[0]?.total || 0) + (platillosTotal[0]?.total || 0);
    await models_1.Orden.findByIdAndUpdate(ordenId, { total });
}
exports.default = router;
//# sourceMappingURL=ordenes.js.map