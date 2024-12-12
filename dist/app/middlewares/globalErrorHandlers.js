"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const globalErrorHandlers = (err, req, res, next) => {
    console.log("hit here");
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        status: (err === null || err === void 0 ? void 0 : err.status) || http_status_codes_1.StatusCodes.NOT_FOUND,
        message: (err === null || err === void 0 ? void 0 : err.message) || "Something went wrong",
    });
};
exports.default = globalErrorHandlers;
