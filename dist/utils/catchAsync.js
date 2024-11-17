"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            res.status(500).json({ error: 'Internal Server Error', err: error });
        });
    };
};
exports.default = catchAsync;
