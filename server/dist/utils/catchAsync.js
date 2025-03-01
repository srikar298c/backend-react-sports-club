"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            // Pass the error to the next middleware (error handler)
            next(error);
        });
    };
};
exports.default = catchAsync;
