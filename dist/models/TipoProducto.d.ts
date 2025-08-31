import { Document } from 'mongoose';
import { ITipoProducto } from '../types';
export interface ITipoProductoDocument extends ITipoProducto, Document {
}
export interface ITipoProductoDocument extends Omit<ITipoProducto, '_id'>, Document {
    _id: number;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=TipoProducto.d.ts.map