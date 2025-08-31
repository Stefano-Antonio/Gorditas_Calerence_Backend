import { Document } from 'mongoose';
import { IProducto } from '../types';
export interface IProductoDocument extends Omit<IProducto, '_id'>, Document {
}
declare const _default: any;
export default _default;
//# sourceMappingURL=Producto.d.ts.map