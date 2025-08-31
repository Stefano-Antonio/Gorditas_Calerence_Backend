"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const helpers_1 = require("../utils/helpers");
const types_1 = require("../types");
const router = (0, express_1.Router)();
// GET /api/reportes/ventas - Reporte de ventas
router.get('/ventas', auth_1.authenticate, auth_1.isEncargado, (0, helpers_1.asyncHandler)(async (req, res) => {
    const { fechaInicio, fechaFin, tipoOrden, mesa } = req.query;
    const filter = {
        estatus: { $in: [types_1.OrdenStatus.ENTREGADO] }
    };
    if (fechaInicio && fechaFin) {
        filter.fechaHora = {
            $gte: new Date(fechaInicio),
            $lte: new Date(fechaFin)
        };
    }
    if (tipoOrden)
        filter.idTipoOrden = parseInt(tipoOrden);
    if (mesa)
        filter.idMesa = parseInt(mesa);
    const [ordenes, resumen] = await Promise.all([
        models_1.Orden.find(filter).sort({ fechaHora: -1 }),
        models_1.Orden.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalVentas: { $sum: '$total' },
                    cantidadOrdenes: { $sum: 1 },
                    promedioVenta: { $avg: '$total' }
                }
            }
        ])
    ]);
    // Ventas por día
    const ventasPorDia = await models_1.Orden.aggregate([
        { $match: filter },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$fechaHora' } },
                ventas: { $sum: '$total' },
                ordenes: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    // Ventas por tipo de orden
    const ventasPorTipo = await models_1.Orden.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$nombreTipoOrden',
                ventas: { $sum: '$total' },
                ordenes: { $sum: 1 }
            }
        }
    ]);
    res.json((0, helpers_1.createResponse)(true, {
        ordenes,
        resumen: resumen[0] || { totalVentas: 0, cantidadOrdenes: 0, promedioVenta: 0 },
        ventasPorDia,
        ventasPorTipo
    }));
}));
// GET /api/reportes/inventario - Reporte de inventario
router.get('/inventario', auth_1.authenticate, auth_1.isEncargado, (0, helpers_1.asyncHandler)(async (req, res) => {
    const productos = await models_1.Producto.find({ activo: true }).sort({ cantidad: 1 });
    const resumen = {
        totalProductos: productos.length,
        stockBajo: productos.filter(p => p.cantidad <= 5 && p.cantidad > 0).length,
        stockAgotado: productos.filter(p => p.cantidad === 0).length,
        valorInventario: productos.reduce((total, producto) => total + (producto.cantidad * producto.costo), 0)
    };
    const productosStockBajo = productos.filter(p => p.cantidad <= 5);
    const productosStockAlto = productos.filter(p => p.cantidad > 50);
    res.json((0, helpers_1.createResponse)(true, {
        productos,
        resumen,
        alertas: {
            stockBajo: productosStockBajo,
            stockAlto: productosStockAlto
        }
    }));
}));
// GET /api/reportes/gastos - Reporte de gastos
router.get('/gastos', auth_1.authenticate, auth_1.isEncargado, (0, helpers_1.asyncHandler)(async (req, res) => {
    const { fechaInicio, fechaFin, tipoGasto } = req.query;
    const filter = {};
    if (fechaInicio && fechaFin) {
        filter.fecha = {
            $gte: new Date(fechaInicio),
            $lte: new Date(fechaFin)
        };
    }
    if (tipoGasto)
        filter.idTipoGasto = parseInt(tipoGasto);
    const [gastos, resumen] = await Promise.all([
        models_1.Gasto.find(filter).sort({ fecha: -1 }),
        models_1.Gasto.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalGastos: { $sum: '$costo' },
                    cantidadGastos: { $sum: 1 },
                    promedioGasto: { $avg: '$costo' }
                }
            }
        ])
    ]);
    // Gastos por tipo
    const gastosPorTipo = await models_1.Gasto.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$nombreTipoGasto',
                gastos: { $sum: '$costo' },
                cantidad: { $sum: 1 }
            }
        },
        { $sort: { gastos: -1 } }
    ]);
    // Gastos por día
    const gastosPorDia = await models_1.Gasto.aggregate([
        { $match: filter },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$fecha' } },
                gastos: { $sum: '$costo' },
                cantidad: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    res.json((0, helpers_1.createResponse)(true, {
        gastos,
        resumen: resumen[0] || { totalGastos: 0, cantidadGastos: 0, promedioGasto: 0 },
        gastosPorTipo,
        gastosPorDia
    }));
}));
// GET /api/reportes/productos-vendidos - Productos más vendidos
router.get('/productos-vendidos', auth_1.authenticate, auth_1.isEncargado, (0, helpers_1.asyncHandler)(async (req, res) => {
    const { fechaInicio, fechaFin, limit = 10 } = req.query;
    const matchFilter = {};
    if (fechaInicio && fechaFin) {
        // Necesitamos hacer lookup con Orden para filtrar por fecha
        const ordenesFiltradas = await models_1.Orden.find({
            fechaHora: {
                $gte: new Date(fechaInicio),
                $lte: new Date(fechaFin)
            },
            estatus: types_1.OrdenStatus.ENTREGADO
        }).select('_id');
        matchFilter.idOrden = { $in: ordenesFiltradas.map(o => o._id) };
    }
    const productosVendidos = await models_1.OrdenDetalleProducto.aggregate([
        { $match: matchFilter },
        {
            $group: {
                _id: {
                    idProducto: '$idProducto',
                    nombreProducto: '$nombreProducto'
                },
                cantidadVendida: { $sum: '$cantidad' },
                totalVentas: { $sum: '$importe' },
                vecesVendido: { $sum: 1 }
            }
        },
        { $sort: { cantidadVendida: -1 } },
        { $limit: parseInt(limit) }
    ]);
    // Platillos más vendidos
    const platillosVendidos = await models_1.OrdenDetallePlatillo.aggregate([
        // Lookup con subordenes para obtener idOrden
        {
            $lookup: {
                from: 'subordenes',
                localField: 'idSuborden',
                foreignField: '_id',
                as: 'suborden'
            }
        },
        // Lookup con ordenes para filtrar
        {
            $lookup: {
                from: 'ordenes',
                localField: 'suborden.idOrden',
                foreignField: '_id',
                as: 'orden'
            }
        },
        {
            $match: {
                'orden.estatus': types_1.OrdenStatus.ENTREGADO,
                ...(fechaInicio && fechaFin ? {
                    'orden.fechaHora': {
                        $gte: new Date(fechaInicio),
                        $lte: new Date(fechaFin)
                    }
                } : {})
            }
        },
        {
            $group: {
                _id: {
                    idPlatillo: '$idPlatillo',
                    nombrePlatillo: '$nombrePlatillo'
                },
                cantidadVendida: { $sum: '$cantidad' },
                totalVentas: { $sum: '$importe' },
                vecesVendido: { $sum: 1 }
            }
        },
        { $sort: { cantidadVendida: -1 } },
        { $limit: parseInt(limit) }
    ]);
    res.json((0, helpers_1.createResponse)(true, {
        productos: productosVendidos,
        platillos: platillosVendidos
    }));
}));
exports.default = router;
//# sourceMappingURL=reportes.js.map