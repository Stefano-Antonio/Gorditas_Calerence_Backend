import { Document } from 'mongoose';
import { IGasto } from '../types';
export interface IGastoDocument extends Omit<IGasto, '_id'>, Document {
}
declare const _default: any;
export default _default;
//# sourceMappingURL=Gasto.d.ts.map