import mongoose, { Document } from 'mongoose';
import { IProducto } from '../types';
export interface IProductoDocument extends IProducto, Document {
}
declare const _default: mongoose.Model<IProductoDocument, {}, {}, {}, mongoose.Document<unknown, {}, IProductoDocument, {}, {}> & IProductoDocument & Required<{
    _id: number;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Producto.d.ts.map