import mongoose, { Document } from 'mongoose';
import { IOrdenDetallePlatillo } from '../types';
export interface IOrdenDetallePlatilloDocument extends IOrdenDetallePlatillo, Document {
}
declare const _default: mongoose.Model<IOrdenDetallePlatilloDocument, {}, {}, {}, mongoose.Document<unknown, {}, IOrdenDetallePlatilloDocument, {}, {}> & IOrdenDetallePlatilloDocument & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=OrdenDetallePlatillo.d.ts.map