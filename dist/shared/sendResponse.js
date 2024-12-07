"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, params) => {
    const responseBody = {
        status: params.statusCode,
        success: params.success,
        message: params.message,
        meta: params.meta || null || undefined,
    };
    if (params.data !== undefined) {
        responseBody.data = params.data;
    }
    res.status(params.statusCode).json(responseBody);
};
exports.default = sendResponse;
