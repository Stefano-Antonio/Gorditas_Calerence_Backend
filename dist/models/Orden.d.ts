import mongoose, { Document } from 'mongoose';
import { IOrden } from '../types';
export interface IOrdenDocument extends IOrden, Document {
}
declare const _default: mongoose.Model<IOrdenDocument, {}, {}, {}, mongoose.Document<unknown, {}, IOrdenDocument, {}, {}> & IOrdenDocument & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Orden.d.ts.map