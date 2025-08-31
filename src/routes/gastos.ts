import { Router } from 'express';
import { Gasto } from '../models';
import { authenticate, isEncargado } from '../middleware/auth';
import { asyncHandler, createResponse } from '../utils/helpers';

const router = Router();

// GET /api/gastos - Listar gastos
router.get('/', authenticate, isEncargado, 
  asyncHandler(async (req: any, res: any) => {
    const { tipoGasto, fechaInicio, fechaFin, page = 1, limit = 20 } = req.query;
    
    const filter: any = {};
    
    if (tipoGasto) filter.idTipoGasto = parseInt(tipoGasto);
    
    if (fechaInicio && fechaFin) {
      filter.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [gastos, total] = await Promise.all([
      Gasto.find(filter)
        .sort({ fecha: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Gasto.countDocuments(filter)
    ]);

    res.json(createResponse(true, {
      gastos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }));
  })
);

// POST /api/gastos - Crear gasto
router.post('/', authenticate, isEncargado, 
  asyncHandler(async (req: any, res: any) => {
    const gasto = new Gasto({
      ...req.body,
      fecha: req.body.fecha || new Date()
    });
    
    await gasto.save();
    
    res.status(201).json(createResponse(true, gasto, 'Gasto registrado exitosamente'));
  })
);

// PUT /api/gastos/:id - Actualizar gasto
router.put('/:id', authenticate, isEncargado, 
  asyncHandler(async (req: any, res: any) => {
    const gasto = await Gasto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!gasto) {
      return res.status(404).json(createResponse(false, null, 'Gasto no encontrado'));
    }

    res.json(createResponse(true, gasto, 'Gasto actualizado exitosamente'));
  })
);

// DELETE /api/gastos/:id - Eliminar gasto
router.delete('/:id', authenticate, isEncargado, 
  asyncHandler(async (req: any, res: any) => {
    const gasto = await Gasto.findByIdAndDelete(req.params.id);

    if (!gasto) {
      return res.status(404).json(createResponse(false, null, 'Gasto no encontrado'));
    }

    res.json(createResponse(true, null, 'Gasto eliminado exitosamente'));
  })
);

// GET /api/gastos/:id - Obtener gasto por ID
router.get('/:id', authenticate, isEncargado, 
  asyncHandler(async (req: any, res: any) => {
    const gasto = await Gasto.findById(req.params.id);

    if (!gasto) {
      return res.status(404).json(createResponse(false, null, 'Gasto no encontrado'));
    }

    res.json(createResponse(true, gasto));
  })
);

export default router;