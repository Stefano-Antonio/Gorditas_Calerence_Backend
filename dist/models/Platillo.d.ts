import mongoose, { Document } from 'mongoose';
import { IPlatillo } from '../types';
export interface IPlatilloDocument extends IPlatillo, Document {
}
declare const _default: mongoose.Model<IPlatilloDocument, {}, {}, {}, mongoose.Document<unknown, {}, IPlatilloDocument, {}, {}> & IPlatilloDocument & Required<{
    _id: number;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Platillo.d.ts.map