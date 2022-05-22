"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// import AppError from './utils/AppError'
// import { createClient } from 'redis'
// import connectRedis from 'connect-redis'
// import session from 'express-session'
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
// import config from './config/default'
// import categoryRouter from './routes/v1/categories'
const auth_1 = __importDefault(require("./routes/v1/auth"));
const users_1 = __importDefault(require("./routes/v1/users"));
dotenv_1.default.config();
// declare module 'express-session' {
//   export interface SessionData {
//     user: { [key: string]: any }
//   }
// }
// let RedisStore = connectRedis(session)
// let redisClient = createClient({
//   url: `${config.REDIS_IP}:${config.REDIS_PORT}`,
//   legacyMode: true,
// })
const app = (0, express_1.default)();
app.set('trust proxy', true);
app.use((0, cors_1.default)({}));
// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     secret: config.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true,
//     cookie: { secure: false, maxAge: 300000, httpOnly: true },
//   })
// )
app.use(express_1.default.json({ limit: '1000kb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get('/api/v1/ping', async (req, res) => {
    console.log(`Sending response from container ${os_1.default.hostname()}`);
    res.status(200).json({
        status: `success`,
        environment: process.env.NODE_ENV,
        message: 'pong!!!!!',
        response: `Sending response from container ${os_1.default.hostname()}`,
    });
});
// app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/users', users_1.default);
// app.all('*', async (req: Request, res: Response, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
// })
app.use(errorHandler_1.default);
exports.default = app;
