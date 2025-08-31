"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const helpers_1 = require("../utils/helpers");
const router = (0, express_1.Router)();
// GET /api/inventario - Consultar inventario
router.get('/', auth_1.authenticate, (0, helpers_1.asyncHandler)(async (req, res) => {
    const { tipoProducto, activo, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (tipoProducto)
        filter.idTipoProducto = tipoProducto;
    if (activo !== undefined)
        filter.activo = activo === 'true';
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [productos, total] = await Promise.all([
        models_1.Producto.find(filter)
            .sort({ nombre: 1 })
            .skip(skip)
            .limit(parseInt(limit)),
        models_1.Producto.countDocuments(filter)
    ]);
    // Agregar alertas de stock bajo
    const productosConAlertas = productos.map(producto => ({
        ...producto.toObject(),
        stockBajo: producto.cantidad <= 5,
        stockAgotado: producto.cantidad === 0
    }));
    res.json((0, helpers_1.createResponse)(true, {
        productos: productosConAlertas,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        },
        resumen: {
            total,
            stockBajo: productos.filter(p => p.cantidad <= 5 && p.cantidad > 0).length,
            stockAgotado: productos.filter(p => p.cantidad === 0).length
        }
    }));
}));
// POST /api/inventario/recibir - Recibir productos
router.post('/recibir', auth_1.authenticate, auth_1.isEncargado, (0, helpers_1.asyncHandler)(async (req, res) => {
    const { productos } = req.body; // Array de { idProducto, cantidad }
    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json((0, helpers_1.createResponse)(false, null, 'Debe proporcionar al menos un producto'));
    }
    const updates = [];
    for (const item of productos) {
        const { idProducto, cantidad } = item;
        if (cantidad <= 0) {
            continue;
        }
        const update = await models_1.Producto.findByIdAndUpdate(idProducto, { $inc: { cantidad } }, { new: true });
        if (update) {
            updates.push(update);
        }
    }
    res.json((0, helpers_1.createResponse)(true, updates, `${updates.length} productos actualizados exitosamente`));
}));
// PUT /api/inventario/ajustar/:id - Ajustar inventario
router.put('/ajustar/:id', auth_1.authenticate, auth_1.isEncargado, (0, helpers_1.asyncHandler)(async (req, res) => {
    const { cantidad, motivo } = req.body;
    if (cantidad < 0) {
        return res.status(400).json((0, helpers_1.createResponse)(false, null, 'La cantidad no puede ser negativa'));
    }
    const producto = await models_1.Producto.findByIdAndUpdate(req.params.id, { cantidad }, { new: true });
    if (!producto) {
        return res.status(404).json((0, helpers_1.createResponse)(false, null, 'Producto no encontrado'));
    }
    // TODO: Registrar el ajuste en un log de auditoría
    console.log(`Ajuste de inventario - Producto: ${producto.nombre}, Nueva cantidad: ${cantidad}, Motivo: ${motivo}`);
    res.json((0, helpers_1.createResponse)(true, producto, 'Inventario ajustado exitosamente'));
}));
exports.default = router;
//# sourceMappingURL=inventario.js.map