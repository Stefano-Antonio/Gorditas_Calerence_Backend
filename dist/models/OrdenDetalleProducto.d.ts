import mongoose, { Document } from 'mongoose';
import { IOrdenDetalleProducto } from '../types';
export interface IOrdenDetalleProductoDocument extends Document, Omit<IOrdenDetalleProducto, '_id'> {
}
declare const _default: mongoose.Model<IOrdenDetalleProductoDocument, {}, {}, {}, mongoose.Document<unknown, {}, IOrdenDetalleProductoDocument, {}, {}> & IOrdenDetalleProductoDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=OrdenDetalleProducto.d.ts.map