"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const ordenes_1 = __importDefault(require("./routes/ordenes"));
const inventario_1 = __importDefault(require("./routes/inventario"));
const reportes_1 = __importDefault(require("./routes/reportes"));
const catalogos_1 = __importDefault(require("./routes/catalogos"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Connect to MongoDB
(0, database_1.connectDB)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}/auth`, auth_1.default);
app.use(`/api/${apiVersion}/ordenes`, ordenes_1.default);
app.use(`/api/${apiVersion}/inventario`, inventario_1.default);
app.use(`/api/${apiVersion}/reportes`, reportes_1.default);
app.use(`/api/${apiVersion}/catalogos`, catalogos_1.default);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// Error handling
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📖 API documentation available at http://localhost:${PORT}/api/${apiVersion}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map