"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResponse = exports.formatDate = exports.formatCurrency = exports.calculateImporte = exports.asyncHandler = void 0;
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
const calculateImporte = (costo, cantidad) => {
    return Math.round((costo * cantidad) * 100) / 100;
};
exports.calculateImporte = calculateImporte;
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};
exports.formatDate = formatDate;
const createResponse = (success, data, message) => {
    return {
        success,
        message,
        data,
        timestamp: new Date().toISOString()
    };
};
exports.createResponse = createResponse;
//# sourceMappingURL=helpers.js.map