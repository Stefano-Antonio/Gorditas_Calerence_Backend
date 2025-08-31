import mongoose, { Document } from 'mongoose';
import { ITipoProducto } from '../types';
export interface ITipoProductoDocument extends ITipoProducto, Document {
}
export interface ITipoProductoDocument extends Omit<ITipoProducto, '_id'>, Document {
    _id: number;
}
declare const _default: mongoose.Model<ITipoProductoDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITipoProductoDocument, {}, {}> & ITipoProductoDocument & Required<{
    _id: number;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=TipoProducto.d.ts.map