import mongoose, { Document } from 'mongoose';
import { IGasto } from '../types';
export interface IGastoDocument extends IGasto, Document {
}
declare const _default: mongoose.Model<IGastoDocument, {}, {}, {}, mongoose.Document<unknown, {}, IGastoDocument, {}, {}> & IGastoDocument & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Gasto.d.ts.map