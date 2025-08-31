"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../types");
const ordenSchema = new mongoose_1.Schema({
    folio: { type: String, required: true, unique: true },
    idTipoOrden: { type: Number, required: true },
    nombreTipoOrden: { type: String, required: true, trim: true },
    estatus: {
        type: String,
        required: true,
        enum: Object.values(types_1.OrdenStatus),
        default: types_1.OrdenStatus.RECEPCION
    },
    idMesa: { type: Number },
    nombreMesa: { type: String, trim: true },
    fechaHora: { type: Date, default: Date.now },
    total: { type: Number, required: true, min: 0, default: 0 }
}, {
    timestamps: true,
    versionKey: false
});
ordenSchema.index({ folio: 1 });
ordenSchema.index({ estatus: 1 });
ordenSchema.index({ fechaHora: -1 });
ordenSchema.index({ idMesa: 1 });
exports.default = mongoose_1.default.model('Orden', ordenSchema);
//# sourceMappingURL=Orden.js.map