import mongoose, { Document } from 'mongoose';
import { ITipoUsuario } from '../types';
export interface ITipoUsuarioDocument extends Omit<ITipoUsuario, '_id'>, Document {
    _id: number;
}
declare const _default: mongoose.Model<ITipoUsuarioDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITipoUsuarioDocument, {}, {}> & ITipoUsuarioDocument & Required<{
    _id: number;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=TipoUsuario.d.ts.map