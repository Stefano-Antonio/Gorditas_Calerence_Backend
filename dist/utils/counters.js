"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFolio = exports.getNextSequence = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const counterSchema = new mongoose_1.default.Schema({
    _id: String,
    sequence_value: { type: Number, default: 0 }
});
const Counter = mongoose_1.default.model('Counter', counterSchema);
const getNextSequence = async (name) => {
    const result = await Counter.findByIdAndUpdate(name, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
    return result.sequence_value;
};
exports.getNextSequence = getNextSequence;
const generateFolio = async () => {
    const sequence = await (0, exports.getNextSequence)('orden');
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `ORD-${year}${month}${day}-${sequence.toString().padStart(4, '0')}`;
};
exports.generateFolio = generateFolio;
//# sourceMappingURL=counters.js.map