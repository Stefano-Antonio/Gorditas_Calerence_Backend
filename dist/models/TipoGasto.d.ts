import mongoose, { Document } from 'mongoose';
import { ITipoGasto } from '../types';
export interface ITipoGastoDocument extends ITipoGasto, Document {
}
declare const _default: mongoose.Model<ITipoGastoDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITipoGastoDocument, {}, {}> & ITipoGastoDocument & Required<{
    _id: number;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=TipoGasto.d.ts.map