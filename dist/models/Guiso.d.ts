import { Document } from 'mongoose';
import { IGuiso } from '../types';
export interface IGuisoDocument extends Omit<IGuiso, '_id'>, Document {
    _id: number;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=Guiso.d.ts.map