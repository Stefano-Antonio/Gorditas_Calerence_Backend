import mongoose, { Document } from 'mongoose';
import { IGasto } from '../types';
export interface IGastoDocument extends Omit<IGasto, '_id'>, Document {
}
declare const _default: mongoose.Model<IGastoDocument, {}, {}, {}, mongoose.Document<unknown, {}, IGastoDocument, {}, {}> & IGastoDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Gasto.d.ts.map