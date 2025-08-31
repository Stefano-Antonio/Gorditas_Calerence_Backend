import mongoose, { Document } from 'mongoose';
import { ITipoOrden } from '../types';
export interface ITipoOrdenDocument extends Omit<ITipoOrden, '_id'>, Document {
}
declare const _default: mongoose.Model<ITipoOrdenDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITipoOrdenDocument, {}, {}> & ITipoOrdenDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=TipoOrden.d.ts.map