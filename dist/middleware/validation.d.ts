import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare const validate: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => any;
export declare const loginSchema: any;
export declare const createUserSchema: any;
export declare const createOrdenSchema: any;
export declare const addProductToOrdenSchema: any;
export declare const addPlatilloToSubordenSchema: any;
//# sourceMappingURL=validation.d.ts.map