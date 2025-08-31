import mongoose, { Document } from 'mongoose';
import { ITipoGasto } from '../types';
export interface ITipoGastoDocument extends Omit<ITipoGasto, '_id'>, Document {
}
declare const _default: mongoose.Model<ITipoGastoDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITipoGastoDocument, {}, {}> & ITipoGastoDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=TipoGasto.d.ts.map