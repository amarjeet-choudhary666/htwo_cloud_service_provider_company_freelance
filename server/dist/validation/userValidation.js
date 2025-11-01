"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
        firstname: zod_1.z.string().min(1, 'First name is required').optional(),
        address: zod_1.z.string().optional(),
        companyName: zod_1.z.string().optional(),
        gstNumber: zod_1.z.string().optional(),
    }),
});
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
//# sourceMappingURL=userValidation.js.map