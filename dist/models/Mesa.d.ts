import { Document } from 'mongoose';
import { IMesa } from '../types';
export interface IMesaDocument extends Omit<IMesa, '_id'>, Document {
    _id: number;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=Mesa.d.ts.map