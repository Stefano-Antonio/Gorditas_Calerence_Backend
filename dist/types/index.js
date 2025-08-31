"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "Admin";
    UserRole["ENCARGADO"] = "Encargado";
    UserRole["MESERO"] = "Mesero";
    UserRole["DESPACHADOR"] = "Despachador";
    UserRole["COCINERO"] = "Cocinero";
})(UserRole || (exports.UserRole = UserRole = {}));
var OrdenStatus;
(function (OrdenStatus) {
    OrdenStatus["RECEPCION"] = "Recepcion";
    OrdenStatus["PREPARACION"] = "Preparacion";
    OrdenStatus["LISTO"] = "Listo";
    OrdenStatus["ENTREGADO"] = "Entregado";
    OrdenStatus["CANCELADO"] = "Cancelado";
})(OrdenStatus || (exports.OrdenStatus = OrdenStatus = {}));
//# sourceMappingURL=index.js.map