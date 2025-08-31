"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const helpers_1 = require("../utils/helpers");
const counters_1 = require("../utils/counters");
const router = (0, express_1.Router)();
// Mapeo de modelos
const modelMap = {
    guiso: models_1.Guiso,
    tipoproducto: models_1.TipoProducto,
    producto: models_1.Producto,
    tipoplatillo: models_1.TipoPlatillo,
    platillo: models_1.Platillo,
    tipousuario: models_1.TipoUsuario,
    usuario: models_1.Usuario,
    tipoorden: models_1.TipoOrden,
    mesa: models_1.Mesa,
    tipogasto: models_1.TipoGasto
};
// Middleware para validar el modelo
const validateModel = (req, res, next) => {
    const { modelo } = req.params;
    if (!modelMap[modelo.toLowerCase()]) {
        return res.status(400).json((0, helpers_1.createResponse)(false, null, 'Modelo no válido'));
    }
    req.Model = modelMap[modelo.toLowerCase()];
    next();
};
// GET /api/catalogos/{modelo} - Listar
router.get('/:modelo', auth_1.authenticate, validateModel, (0, helpers_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 20, activo, search } = req.query;
    const filter = {};
    if (activo !== undefined)
        filter.activo = activo === 'true';
    if (search) {
        filter.$or = [
            { nombre: { $regex: search, $options: 'i' } },
            { descripcion: { $regex: search, $options: 'i' } }
        ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
        req.Model.find(filter)
            .sort({ nombre: 1 })
            .skip(skip)
            .limit(parseInt(limit)),
        req.Model.countDocuments(filter)
    ]);
    res.json((0, helpers_1.createResponse)(true, {
        items,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    }));
}));
// POST /api/catalogos/{modelo} - Crear
router.post('/:modelo', auth_1.authenticate, auth_1.isEncargado, validateModel, (0, helpers_1.asyncHandler)(async (req, res) => {
    // Para modelos con _id numérico, generar el siguiente ID
    const needsNumericId = !['usuario'].includes(req.params.modelo.toLowerCase());
    let itemData = { ...req.body };
    if (needsNumericId) {
        const nextId = await (0, counters_1.getNextSequence)(req.params.modelo.toLowerCase());
        itemData._id = nextId;
    }
    const item = new req.Model(itemData);
    await item.save();
    res.status(201).json((0, helpers_1.createResponse)(true, item, 'Registro creado exitosamente'));
}));
// PUT /api/catalogos/{modelo}/:id - Actualizar
router.put('/:modelo/:id', auth_1.authenticate, auth_1.isEncargado, validateModel, (0, helpers_1.asyncHandler)(async (req, res) => {
    const item = await req.Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
        return res.status(404).json((0, helpers_1.createResponse)(false, null, 'Registro no encontrado'));
    }
    res.json((0, helpers_1.createResponse)(true, item, 'Registro actualizado exitosamente'));
}));
// DELETE /api/catalogos/{modelo}/:id - Eliminar
router.delete('/:modelo/:id', auth_1.authenticate, auth_1.isAdmin, validateModel, (0, helpers_1.asyncHandler)(async (req, res) => {
    // Para modelos críticos, solo desactivar
    const criticalModels = ['usuario', 'producto', 'platillo'];
    if (criticalModels.includes(req.params.modelo.toLowerCase())) {
        const item = await req.Model.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
        if (!item) {
            return res.status(404).json((0, helpers_1.createResponse)(false, null, 'Registro no encontrado'));
        }
        return res.json((0, helpers_1.createResponse)(true, item, 'Registro desactivado exitosamente'));
    }
    // Para otros modelos, eliminar completamente
    const item = await req.Model.findByIdAndDelete(req.params.id);
    if (!item) {
        return res.status(404).json((0, helpers_1.createResponse)(false, null, 'Registro no encontrado'));
    }
    res.json((0, helpers_1.createResponse)(true, null, 'Registro eliminado exitosamente'));
}));
exports.default = router;
//# sourceMappingURL=catalogos.js.map