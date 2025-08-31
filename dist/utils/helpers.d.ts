export declare const asyncHandler: (fn: Function) => (req: any, res: any, next: any) => Promise<any>;
export declare const calculateImporte: (costo: number, cantidad: number) => number;
export declare const formatCurrency: (amount: number) => string;
export declare const formatDate: (date: Date) => string;
export declare const createResponse: (success: boolean, data?: any, message?: string) => {
    success: boolean;
    message: string | undefined;
    data: any;
    timestamp: string;
};
//# sourceMappingURL=helpers.d.ts.map