"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCocinero = exports.isDespachador = exports.isMesero = exports.isEncargado = exports.isAdmin = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const types_1 = require("../types");
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await models_1.Usuario.findById(decoded.id);
        if (!user || !user.activo) {
            return res.status(401).json({ message: 'Usuario no válido' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token no válido' });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        if (!roles.includes(req.user.nombreTipoUsuario)) {
            return res.status(403).json({ message: 'No tienes permisos para esta acción' });
        }
        next();
    };
};
exports.authorize = authorize;
exports.isAdmin = (0, exports.authorize)(types_1.UserRole.ADMIN);
exports.isEncargado = (0, exports.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.ENCARGADO);
exports.isMesero = (0, exports.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.ENCARGADO, types_1.UserRole.MESERO);
exports.isDespachador = (0, exports.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.ENCARGADO, types_1.UserRole.DESPACHADOR);
exports.isCocinero = (0, exports.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.ENCARGADO, types_1.UserRole.COCINERO);
//# sourceMappingURL=auth.js.map