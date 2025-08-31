"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPlatilloToSubordenSchema = exports.addProductToOrdenSchema = exports.createOrdenSchema = exports.createUserSchema = exports.loginSchema = exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Error de validación',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};
exports.validate = validate;
// Validation schemas
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required()
});
exports.createUserSchema = joi_1.default.object({
    nombre: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    idTipoUsuario: joi_1.default.number().required(),
    nombreTipoUsuario: joi_1.default.string().required()
});
exports.createOrdenSchema = joi_1.default.object({
    idTipoOrden: joi_1.default.number().required(),
    nombreTipoOrden: joi_1.default.string().required(),
    idMesa: joi_1.default.number().optional(),
    nombreMesa: joi_1.default.string().optional()
});
exports.addProductToOrdenSchema = joi_1.default.object({
    idProducto: joi_1.default.number().required(),
    nombreProducto: joi_1.default.string().required(),
    costoProducto: joi_1.default.number().min(0).required(),
    cantidad: joi_1.default.number().min(1).required()
});
exports.addPlatilloToSubordenSchema = joi_1.default.object({
    idPlatillo: joi_1.default.number().required(),
    nombrePlatillo: joi_1.default.string().required(),
    idGuiso: joi_1.default.number().required(),
    nombreGuiso: joi_1.default.string().required(),
    costoPlatillo: joi_1.default.number().min(0).required(),
    cantidad: joi_1.default.number().min(1).required()
});
//# sourceMappingURL=validation.js.map