"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const helpers_1 = require("../utils/helpers");
const router = (0, express_1.Router)();
// POST /api/auth/login
router.post('/login', (0, validation_1.validate)(validation_1.loginSchema), (0, helpers_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    // Find user
    const user = await models_1.Usuario.findOne({ email, activo: true });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json((0, helpers_1.createResponse)(false, null, 'Credenciales inválidas'));
    }
    // Create token
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json((0, helpers_1.createResponse)(true, {
        token,
        user: user.toJSON()
    }, 'Inicio de sesión exitoso'));
}));
// GET /api/auth/profile
router.get('/profile', auth_1.authenticate, (0, helpers_1.asyncHandler)(async (req, res) => {
    res.json((0, helpers_1.createResponse)(true, req.user.toJSON(), 'Perfil obtenido exitosamente'));
}));
exports.default = router;
//# sourceMappingURL=auth.js.map