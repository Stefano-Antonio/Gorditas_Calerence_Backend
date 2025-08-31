import mongoose, { Document } from 'mongoose';
import { IMesa } from '../types';
export interface IMesaDocument extends Omit<IMesa, '_id'>, Document {
    _id: number;
}
declare const _default: mongoose.Model<IMesaDocument, {}, {}, {}, mongoose.Document<unknown, {}, IMesaDocument, {}, {}> & IMesaDocument & Required<{
    _id: number;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Mesa.d.ts.map