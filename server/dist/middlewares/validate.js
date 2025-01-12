"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => (req, res, next) => {
    try {
        // Parse and validate request
        const validated = schema.parse({
            params: req.params,
            query: req.query,
            body: req.body,
        });
        // Attach validated data to a custom property
        req.validated = validated;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors, // Provide details about what failed
            });
        }
        else {
            next(error); // Pass non-validation errors to the error handler
        }
    }
};
exports.validateRequest = validateRequest;
