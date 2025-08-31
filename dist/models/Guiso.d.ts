import mongoose, { Document } from 'mongoose';
import { IGuiso } from '../types';
export interface IGuisoDocument extends IGuiso, Document {
}
declare const _default: mongoose.Model<IGuisoDocument, {}, {}, {}, mongoose.Document<unknown, {}, IGuisoDocument, {}, {}> & IGuisoDocument & Required<{
    _id: number;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Guiso.d.ts.map