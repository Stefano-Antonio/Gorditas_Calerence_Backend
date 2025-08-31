import { Document } from 'mongoose';
import { ITipoUsuario } from '../types';
export interface ITipoUsuarioDocument extends Omit<ITipoUsuario, '_id'>, Document {
    _id: number;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=TipoUsuario.d.ts.map