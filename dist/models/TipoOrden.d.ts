import mongoose, { Document } from 'mongoose';
import { ITipoOrden } from '../types';
export interface ITipoOrdenDocument extends ITipoOrden, Document {
}
declare const _default: mongoose.Model<ITipoOrdenDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITipoOrdenDocument, {}, {}> & ITipoOrdenDocument & Required<{
    _id: number;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=TipoOrden.d.ts.map