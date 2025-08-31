import mongoose, { Document } from 'mongoose';
import { IOrdenDetalleProducto } from '../types';
export interface IOrdenDetalleProductoDocument extends IOrdenDetalleProducto, Document {
}
declare const _default: mongoose.Model<IOrdenDetalleProductoDocument, {}, {}, {}, mongoose.Document<unknown, {}, IOrdenDetalleProductoDocument, {}, {}> & IOrdenDetalleProductoDocument & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=OrdenDetalleProducto.d.ts.map