import mongoose, { Document } from 'mongoose';
import { IOrden } from '../types';
export interface IOrdenDocument extends Omit<IOrden, '_id'>, Document {
}
declare const _default: mongoose.Model<IOrdenDocument, {}, {}, {}, mongoose.Document<unknown, {}, IOrdenDocument, {}, {}> & IOrdenDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Orden.d.ts.map