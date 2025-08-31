import mongoose, { Document } from 'mongoose';
import { ITipoPlatillo } from '../types';
export interface ITipoPlatilloDocument extends ITipoPlatillo, Document {
    _id: number;
}
declare const _default: mongoose.Model<ITipoPlatilloDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITipoPlatilloDocument, {}, {}> & ITipoPlatilloDocument & Required<{
    _id: number;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=TipoPlatillo.d.ts.map