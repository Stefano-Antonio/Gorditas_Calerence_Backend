import mongoose, { Document } from 'mongoose';
import { ISuborden } from '../types';
export interface ISubordenDocument extends ISuborden, Document {
}
declare const _default: mongoose.Model<ISubordenDocument, {}, {}, {}, mongoose.Document<unknown, {}, ISubordenDocument, {}, {}> & ISubordenDocument & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Suborden.d.ts.map