"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const http_status_codes_1 = require("http-status-codes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandlers_1 = __importDefault(require("./app/middlewares/globalErrorHandlers"));
const app = (0, express_1.default)();
// app.use(cors());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: "https://ix-client.vercel.app",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://ix-client.vercel.app"], // Array for multiple origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allows cookies to be sent with cross-origin requests
}));
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send({
        message: "Welcome to IX-Server ",
    });
});
app.use(globalErrorHandlers_1.default);
app.use((req, res, next) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        status: http_status_codes_1.StatusCodes.NOT_FOUND,
        message: `${req.originalUrl} - Your requested path is not found!`,
    });
});
exports.default = app;
