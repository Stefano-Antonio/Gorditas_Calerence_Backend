import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare const validate: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const loginSchema: Joi.ObjectSchema<any>;
export declare const createUserSchema: Joi.ObjectSchema<any>;
export declare const createOrdenSchema: Joi.ObjectSchema<any>;
export declare const addProductToOrdenSchema: Joi.ObjectSchema<any>;
export declare const addPlatilloToSubordenSchema: Joi.ObjectSchema<any>;
//# sourceMappingURL=validation.d.ts.map