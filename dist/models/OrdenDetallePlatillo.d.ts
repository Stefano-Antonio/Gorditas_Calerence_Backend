import mongoose, { Document } from 'mongoose';
import { IOrdenDetallePlatillo } from '../types';
export interface IOrdenDetallePlatilloDocument extends Omit<IOrdenDetallePlatillo, '_id'>, Document {
}
declare const _default: mongoose.Model<IOrdenDetallePlatilloDocument, {}, {}, {}, mongoose.Document<unknown, {}, IOrdenDetallePlatilloDocument, {}, {}> & IOrdenDetallePlatilloDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=OrdenDetallePlatillo.d.ts.map