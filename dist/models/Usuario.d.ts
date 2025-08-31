import { Document } from 'mongoose';
import { IUser } from '../types';
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=Usuario.d.ts.map